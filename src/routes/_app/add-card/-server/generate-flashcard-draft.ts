import { eq } from "drizzle-orm"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"

import { userPreferences } from "@/features/viewer/model/user-preferences-schema"
import { db } from "@/lib/server/db"
import { env } from "@/lib/server/env"
import { generatedFlashcardDraftSchema } from "@/routes/_app/add-card/-model/add-card-types"

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

type UserLanguageContext = {
  learningLanguageCode: string
  learningLanguageName: string
  baseLanguageCode: string
  baseLanguageName: string
}

function buildGenerationInstructions(context: UserLanguageContext) {
  return [
    "You generate high-quality language-learning flashcards.",
    `The learner studies ${context.learningLanguageName} (${context.learningLanguageCode}) from ${context.baseLanguageName} (${context.baseLanguageCode}).`,
    "The user will usually paste one word or one short phrase. Treat it as the intended study expression.",
    "If the input is a transliteration, contains minor spelling noise, or uses the base-language script to approximate the target language, normalize it into the most likely canonical writing in the learning language when you can do so confidently.",
    "If the input is ambiguous, stay conservative, keep the best likely form, and explain the nuance briefly in notes.",
    "Return one natural primary translation in the base language, not a list.",
    "Return exactly two short example pairs. Keep examples practical, everyday, and easy to review.",
    "Pronunciation must help the learner say the target expression naturally. Prefer a transcription style that is comfortable for a speaker of the base language when possible; otherwise use a clear Latin transliteration.",
    "Use notes only for useful nuance: register, literal sense, correction, or ambiguity. Return null when there is nothing helpful to add.",
    "Classify expressionType as 'word' for single lexical items and 'phrase' for greetings, idioms, collocations, and multi-word expressions.",
    "Return null for notes, pronunciation, or partOfSpeech when you cannot provide a useful value.",
    "Do not add markdown, numbering, deck labels, or extra commentary.",
  ].join("\n")
}

function buildGenerationInput(
  context: UserLanguageContext,
  seedExpression: string
) {
  return [
    `Learning language: ${context.learningLanguageName} (${context.learningLanguageCode})`,
    `Base language: ${context.baseLanguageName} (${context.baseLanguageCode})`,
    `User input: ${seedExpression}`,
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

export async function generateFlashcardDraft(
  userId: string,
  seedExpression: string
) {
  const context = await getUserLanguageContext(userId)

  if (!context) {
    throw new Error("Finish onboarding before generating AI flashcards.")
  }

  const response = await openai.responses.parse({
    model: env.OPENAI_MODEL,
    instructions: buildGenerationInstructions(context),
    input: buildGenerationInput(context, seedExpression.trim()),
    text: {
      format: zodTextFormat(generatedFlashcardDraftSchema, "flashcard_draft"),
      verbosity: "low",
    },
  })

  if (!response.output_parsed) {
    throw new Error("The AI response was empty. Please try again.")
  }

  return response.output_parsed
}
