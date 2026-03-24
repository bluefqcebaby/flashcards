import { z } from "zod"

import { expressionTypeSchema } from "@/features/cards/model/contracts"

const inputModes = ["learning", "base"] as const
const draftStatuses = ["pending", "ready", "failed", "saved"] as const

const generatedExampleSchema = z.object({
  targetText: z
    .string()
    .trim()
    .min(1, "Add the example in the learning language.")
    .max(160, "Keep the example concise."),
  baseText: z
    .string()
    .trim()
    .min(1, "Add the example translation.")
    .max(160, "Keep the example concise."),
})

export const generatedFlashcardDraftSchema = z.object({
  expression: z
    .string()
    .trim()
    .min(1, "Add the word or phrase you want to study.")
    .max(120, "Keep the expression concise."),
  expressionType: expressionTypeSchema,
  translation: z
    .string()
    .trim()
    .min(1, "Add the main translation.")
    .max(120, "Keep the translation concise."),
  examples: z
    .array(generatedExampleSchema)
    .length(2, "Add exactly 2 examples."),
  notes: z
    .string()
    .trim()
    .min(1, "Add a helpful usage note.")
    .max(240, "Keep the note brief.")
    .nullable(),
  pronunciation: z
    .string()
    .trim()
    .min(1, "Add a pronunciation guide.")
    .max(120, "Keep the pronunciation concise.")
    .nullable(),
})

export type GeneratedFlashcardDraft = z.infer<
  typeof generatedFlashcardDraftSchema
>

export const addCardInputModeSchema = z.enum(inputModes)

export type AddCardInputMode = z.infer<typeof addCardInputModeSchema>

export const flashcardDraftStatusSchema = z.enum(draftStatuses)

export type FlashcardDraftStatus = z.infer<typeof flashcardDraftStatusSchema>

export const persistedFlashcardDraftSchema = z.object({
  id: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  status: flashcardDraftStatusSchema,
  seedExpression: z.string().trim().min(1).max(160),
  inputMode: addCardInputModeSchema,
  regenerationNotes: z.string().trim().max(400).nullable(),
  expression: generatedFlashcardDraftSchema.shape.expression.nullable(),
  expressionType: generatedFlashcardDraftSchema.shape.expressionType.nullable(),
  translation: generatedFlashcardDraftSchema.shape.translation.nullable(),
  examples: generatedFlashcardDraftSchema.shape.examples.nullable(),
  notes: generatedFlashcardDraftSchema.shape.notes,
  pronunciation: generatedFlashcardDraftSchema.shape.pronunciation,
  errorMessage: z.string().trim().max(400).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type PersistedFlashcardDraft = z.infer<
  typeof persistedFlashcardDraftSchema
>

export type AddCardDraftListItem = Omit<PersistedFlashcardDraft, "userId"> & {
  isOptimistic?: boolean
  userId: string | null
}

export const addCardRouteDataSchema = z.object({
  drafts: z.array(persistedFlashcardDraftSchema),
})

export type AddCardRouteData = z.infer<typeof addCardRouteDataSchema>

export const createDraftInputSchema = z.object({
  seedExpression: z
    .string()
    .trim()
    .min(1, "Enter a word or phrase to generate a card.")
    .max(160, "Keep the request under 160 characters."),
  inputMode: addCardInputModeSchema,
})

export const runDraftGenerationInputSchema = z.object({
  draftId: z.string().trim().min(1, "Missing draft id."),
  regenerationNotes: z
    .string()
    .trim()
    .max(400, "Keep the extra guidance under 400 characters.")
    .nullable(),
})

export const saveDraftAsFlashcardInputSchema = z.object({
  draftId: z.string().trim().min(1, "Missing draft id."),
})

export const dismissDraftInputSchema = z.object({
  draftId: z.string().trim().min(1, "Missing draft id."),
})

export function draftHasGeneratedCard(
  draft: Pick<
    PersistedFlashcardDraft,
    "examples" | "expression" | "expressionType" | "translation"
  >
): draft is GeneratedFlashcardDraft & {
  expression: string
  expressionType: GeneratedFlashcardDraft["expressionType"]
  translation: string
  examples: GeneratedFlashcardDraft["examples"]
} {
  return Boolean(
    draft.expression &&
      draft.expressionType &&
      draft.translation &&
      draft.examples?.length === 2
  )
}
