import type { GeneratedFlashcardDraft } from "@/routes/_app/add-card/-model/add-card-types"

export type UserLanguageContext = {
  learningLanguageCode: string
  learningLanguageName: string
  baseLanguageCode: string
  baseLanguageName: string
}

type GenerationScriptPolicy = {
  normalizationInstruction: string
  extraInstructions: string[]
  retryInstruction: string | null
}

const georgianScriptPattern = /[\u10A0-\u10FF\u1C90-\u1CBF\u2D00-\u2D2F]/u

export function getGenerationScriptPolicy(
  context: UserLanguageContext
): GenerationScriptPolicy {
  if (context.learningLanguageCode === "ka") {
    return {
      normalizationInstruction:
        "If the input is a transliteration, contains minor spelling noise, uses the base-language script to approximate Georgian, or is already written in Georgian script, normalize it into the most likely learner-friendly Latin transliteration when you can do so confidently.",
      extraInstructions: [
        "For Georgian, return the study expression in readable Latin transliteration only, for example 'gamarjoba' or 'madloba'.",
        "For Georgian, write every target-language example in the same Latin transliteration style, never in Georgian script.",
        "For Georgian, keep pronunciation in Latin letters as well. Do not use Georgian letters in expression, pronunciation, or target-language examples.",
      ],
      retryInstruction:
        "Your previous answer used Georgian script. Regenerate the full flashcard draft using Latin transliteration only for every learning-language field.",
    }
  }

  return {
    normalizationInstruction:
      "If the input is a transliteration, contains minor spelling noise, or uses the base-language script to approximate the target language, normalize it into the most likely canonical writing in the learning language when you can do so confidently.",
    extraInstructions: [],
    retryInstruction: null,
  }
}

export function hasDisallowedLearningScript(
  draft: GeneratedFlashcardDraft,
  context: UserLanguageContext
) {
  if (context.learningLanguageCode !== "ka") {
    return false
  }

  if (containsGeorgianScript(draft.expression)) {
    return true
  }

  if (draft.pronunciation && containsGeorgianScript(draft.pronunciation)) {
    return true
  }

  return draft.examples.some((example) =>
    containsGeorgianScript(example.targetText)
  )
}

export function containsGeorgianScript(value: string) {
  return georgianScriptPattern.test(value)
}
