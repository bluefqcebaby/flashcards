import { createServerFn } from "@tanstack/react-start"
import { and, eq } from "drizzle-orm"

import { rateStudyCardInputSchema } from "@/features/cards/model/contracts"
import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"
import { scheduleNextReview } from "@/routes/_app/study/-model/review-scheduler"

export const rateStudyCard = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(rateStudyCardInputSchema)
  .handler(async ({ context, data }) => {
    const { session } = context
    const [card] = await db
      .select()
      .from(flashcards)
      .where(
        and(
          eq(flashcards.id, data.cardId),
          eq(flashcards.userId, session.user.id)
        )
      )
      .limit(1)

    if (!card) {
      throw new Error("Card not found.")
    }

    const now = new Date()

    await db
      .update(flashcards)
      .set({
        ...scheduleNextReview(card, data.rating, now),
        updatedAt: now,
      })
      .where(eq(flashcards.id, card.id))
  })
