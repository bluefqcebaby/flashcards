import { createServerFn } from "@tanstack/react-start"

import { createFlashcardInputSchema } from "@/features/cards/model/contracts"
import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"

export const createStudyCard = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(createFlashcardInputSchema)
  .handler(async ({ context, data }) => {
    const { session } = context
    const now = new Date()

    await db.insert(flashcards).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      expression: data.expression,
      expressionType: data.expressionType,
      translation: data.translation,
      examples: data.examples,
      notes: data.notes?.trim() || null,
      pronunciation: data.pronunciation?.trim() || null,
      partOfSpeech: data.partOfSpeech?.trim() || null,
      dueAt: now,
      lastReviewedAt: null,
      reviewCount: 0,
      lapseCount: 0,
      intervalDays: 0,
      lastRating: null,
      updatedAt: now,
    })
  })
