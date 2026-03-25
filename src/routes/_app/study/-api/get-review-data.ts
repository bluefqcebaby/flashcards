import { createServerFn } from "@tanstack/react-start"

import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"
import { authMiddleware } from "@/lib/server/server-fn-middleware"
import {
  getCurrentStudyCard,
  getDueStudyCardCount,
  getTotalStudyCardCount,
} from "@/routes/_app/study/-api/queries"

export type ReviewData = {
  currentCard: FlashcardRecord | null
  dueCardCount: number
  totalCardCount: number
}

export const getReviewData = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ReviewData> => {
    const { session } = context
    const now = new Date()

    const [currentCard, dueCardCount, totalCardCount] = await Promise.all([
      getCurrentStudyCard(session.user.id, now),
      getDueStudyCardCount(session.user.id, now),
      getTotalStudyCardCount(session.user.id),
    ])

    return { currentCard, dueCardCount, totalCardCount }
  })
