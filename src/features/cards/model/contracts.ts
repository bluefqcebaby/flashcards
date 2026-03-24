import { z } from "zod"

export const expressionTypeSchema = z.enum(["word", "phrase"])

export type ExpressionType = z.infer<typeof expressionTypeSchema>

export const flashcardExampleSchema = z.object({
  targetText: z
    .string()
    .trim()
    .min(1, "Add the example in the learning language."),
  baseText: z.string().trim().min(1, "Add the example translation."),
})

export const flashcardExamplesSchema = z
  .array(flashcardExampleSchema)
  .length(2, "Add exactly 2 examples.")

export type FlashcardExample = z.infer<typeof flashcardExampleSchema>

export const studyRatingSchema = z.enum(["again", "hard", "good"])

export type StudyRating = z.infer<typeof studyRatingSchema>

export type Flashcard = {
  id: string
  userId: string
  expression: string
  expressionType: ExpressionType
  translation: string
  examples: FlashcardExample[]
  notes: string | null
  pronunciation: string | null
  dueAt: Date
  lastReviewedAt: Date | null
  reviewCount: number
  lapseCount: number
  intervalDays: number
  lastRating: StudyRating | null
  createdAt: Date
  updatedAt: Date
}

export const createFlashcardInputSchema = z.object({
  expression: z
    .string()
    .trim()
    .min(1, "Add the word or phrase you want to study."),
  expressionType: expressionTypeSchema,
  translation: z.string().trim().min(1, "Add the main translation."),
  examples: flashcardExamplesSchema,
  notes: z.string().trim().optional(),
  pronunciation: z.string().trim().optional(),
})

export type CreateFlashcardInput = z.infer<typeof createFlashcardInputSchema>

export const rateStudyCardInputSchema = z.object({
  cardId: z.string().trim().min(1, "Missing card id."),
  rating: studyRatingSchema,
})

export type RateStudyCardInput = z.infer<typeof rateStudyCardInputSchema>
