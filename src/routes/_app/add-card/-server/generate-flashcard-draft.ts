import { eq } from "drizzle-orm"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"

import { userPreferences } from "@/features/viewer/model/user-preferences-schema"
import { db } from "@/lib/server/db"
import { env } from "@/lib/server/env"
import type {
  AddCardInputMode,
  GeneratedFlashcardDraft,
} from "@/routes/_app/add-card/-model/add-card-types"
import { generatedFlashcardDraftSchema } from "@/routes/_app/add-card/-model/add-card-types"
import {
  getGenerationScriptPolicy,
  hasDisallowedLearningScript,
  type UserLanguageContext,
} from "@/routes/_app/add-card/-server/generation-script-policy"

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

type FlashcardGenerationRequest = {
  inputMode: AddCardInputMode
  regenerationNotes: string | null
  seedExpression: string
}

function getInputModeInstruction(
  context: UserLanguageContext,
  inputMode: AddCardInputMode
) {
  if (inputMode === "base") {
    return `The user input may be written in any language. Infer the closest practical ${context.learningLanguageName} word or short phrase the learner most likely wants, then build the flashcard around that ${context.learningLanguageName} expression.`
  }

  return `The user input is intended to be in ${context.learningLanguageName}. Treat it as the study expression, normalize spelling or transliteration when helpful, and preserve the intended meaning.`
}

function buildGenerationInstructions(
  context: UserLanguageContext,
  request: FlashcardGenerationRequest
) {
  const scriptPolicy = getGenerationScriptPolicy(context)

  return [
    "You generate high-quality language-learning flashcards.",
    `The learner studies ${context.learningLanguageName} (${context.learningLanguageCode}) from ${context.baseLanguageName} (${context.baseLanguageCode}).`,
    "The user will usually paste one word or one short phrase.",
    getInputModeInstruction(context, request.inputMode),
    scriptPolicy.normalizationInstruction,
    "The final expression must be in the learning language. The translation must be a short natural gloss in the base language.",
    "Never answer with a question, request for clarification, or multiple-choice wording.",
    "Never put uncertainty prompts like 'do you mean', 'maybe', 'or', or quoted alternatives into the translation field.",
    "If the input is ambiguous, choose the single closest practical everyday meaning instead of asking the user to clarify.",
    "When two meanings are close, prefer the one a learner is most likely to hear in daily life. Mention the nuance briefly in notes only if it materially helps.",
    request.regenerationNotes
      ? "The user may add an optional clarification note after a first draft. Treat that note as strong disambiguation context and apply it across the entire regenerated card."
      : "If there is no clarification note, use the most practical everyday meaning.",
    "Return one natural primary translation in the base language, not a list.",
    "Return exactly two short example pairs. Keep examples practical, everyday, and easy to review.",
    "Pronunciation must help the learner say the target expression naturally. Prefer a transcription style that is comfortable for a speaker of the base language when possible; otherwise use a clear Latin transliteration.",
    ...scriptPolicy.extraInstructions,
    "The notes field is shown to the learner as a short usage tip.",
    "Use notes for practical usage help, not generic filler.",
    "Prefer one concise, useful note about how the word is also used: a common alternate meaning, another frequent form, a phrase or context where it changes meaning, or a common situation where native speakers use it.",
    "Grammar is welcome only when it helps real usage. Prefer 'you may also hear X in Y context' over abstract linguistic explanation.",
    "Do not repeat the main translation in notes unless the extra context changes the meaning.",
    "Return null for notes when there is no genuinely useful extra usage information.",
    "Classify expressionType as 'word' for single lexical items and 'phrase' for greetings, idioms, collocations, and multi-word expressions.",
    "Return null for notes or pronunciation when you cannot provide a useful value.",
    "Do not add markdown, numbering, deck labels, or extra commentary.",
  ].join("\n")
}

function buildGenerationInput(
  context: UserLanguageContext,
  request: FlashcardGenerationRequest
) {
  return [
    `Learning language: ${context.learningLanguageName} (${context.learningLanguageCode})`,
    `Base language: ${context.baseLanguageName} (${context.baseLanguageCode})`,
    `Input mode: ${request.inputMode === "base" ? "Any language to learning-language lookup" : context.learningLanguageName}`,
    `User input: ${request.seedExpression}`,
    request.regenerationNotes
      ? `Clarification note: ${request.regenerationNotes}`
      : "Clarification note: none",
    "Generate the flashcard draft now.",
  ].join("\n")
}

async function getUserLanguageContext(userId: string) {
  const [preferences] = await db
    .select({
      learningLanguageCode: userPreferences.learningLanguageCode,
      learningLanguageName: userPreferences.learningLanguageName,
      baseLanguageCode: userPreferences.baseLanguageCode,
      baseLanguageName: userPreferences.baseLanguageName,
    })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1)

  return preferences ?? null
}

async function requestFlashcardDraft(
  context: UserLanguageContext,
  request: FlashcardGenerationRequest,
  retryInstruction?: string
) {
  const instructions = retryInstruction
    ? `${buildGenerationInstructions(context, request)}\n${retryInstruction}`
    : buildGenerationInstructions(context, request)

  const response = await openai.responses.parse({
    model: env.OPENAI_MODEL,
    instructions,
    input: buildGenerationInput(context, {
      ...request,
      seedExpression: request.seedExpression.trim(),
    }),
    text: {
      format: zodTextFormat(generatedFlashcardDraftSchema, "flashcard_draft"),
      verbosity: "medium",
    },
  })

  if (!response.output_parsed) {
    throw new Error("The AI response was empty. Please try again.")
  }

  return response.output_parsed satisfies GeneratedFlashcardDraft
}

export async function generateFlashcardDraft(
  userId: string,
  request: FlashcardGenerationRequest
) {
  const context = await getUserLanguageContext(userId)

  if (!context) {
    throw new Error("Finish onboarding before generating AI flashcards.")
  }

  const draft = await requestFlashcardDraft(context, request)
  const scriptPolicy = getGenerationScriptPolicy(context)

  if (
    scriptPolicy.retryInstruction &&
    hasDisallowedLearningScript(draft, context)
  ) {
    return requestFlashcardDraft(
      context,
      request,
      scriptPolicy.retryInstruction
    )
  }

  return draft
}
