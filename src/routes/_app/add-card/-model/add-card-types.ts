import { z } from "zod"

import {
  createFlashcardInputSchema,
  expressionTypeSchema,
  flashcardExamplesSchema,
} from "@/features/cards/model/contracts"

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
  partOfSpeech: z
    .string()
    .trim()
    .min(1, "Add the part of speech.")
    .max(80, "Keep the part of speech concise.")
    .nullable(),
})

export type GeneratedFlashcardDraft = z.infer<
  typeof generatedFlashcardDraftSchema
>

export const generateFlashcardDraftInputSchema = z.object({
  seedExpression: z
    .string()
    .trim()
    .min(1, "Enter a word or phrase to generate a card.")
    .max(160, "Keep the request under 160 characters."),
})

export type GenerateFlashcardDraftInput = z.infer<
  typeof generateFlashcardDraftInputSchema
>

export const saveGeneratedFlashcardInputSchema = z.object({
  expression: createFlashcardInputSchema.shape.expression,
  expressionType: createFlashcardInputSchema.shape.expressionType,
  translation: createFlashcardInputSchema.shape.translation,
  examples: flashcardExamplesSchema,
  notes: z.string().trim().nullable(),
  pronunciation: z.string().trim().nullable(),
  partOfSpeech: z.string().trim().nullable(),
})

export type SaveGeneratedFlashcardInput = z.infer<
  typeof saveGeneratedFlashcardInputSchema
>
