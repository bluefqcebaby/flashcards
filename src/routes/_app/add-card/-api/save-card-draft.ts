import { createServerFn } from "@tanstack/react-start"
import { and, eq, inArray } from "drizzle-orm"

import { flashcardDrafts } from "@/features/cards/model/flashcard-draft-schema"
import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"
import {
  draftHasGeneratedCard,
  saveDraftAsFlashcardInputSchema,
} from "@/routes/_app/add-card/-model/add-card-types"

export const saveCardDraft = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(saveDraftAsFlashcardInputSchema)
  .handler(async ({ context, data }) => {
    const userId = context.session.user.id

    return db.transaction(async (tx) => {
      const now = new Date()
      const [draft] = await tx
        .update(flashcardDrafts)
        .set({
          status: "saved",
          updatedAt: now,
        })
        .where(
          and(
            eq(flashcardDrafts.id, data.draftId),
            eq(flashcardDrafts.userId, userId),
            inArray(flashcardDrafts.status, ["ready", "failed"])
          )
        )
        .returning()

      if (!draft) {
        throw new Error("This draft is not ready to save.")
      }

      if (!draftHasGeneratedCard(draft)) {
        throw new Error("This draft is missing generated content.")
      }

      const [savedCard] = await tx
        .insert(flashcards)
        .values({
          id: crypto.randomUUID(),
          userId,
          expression: draft.expression,
          expressionType: draft.expressionType,
          translation: draft.translation,
          examples: draft.examples,
          notes: draft.notes?.trim() || null,
          pronunciation: draft.pronunciation?.trim() || null,
          dueAt: now,
          lastReviewedAt: null,
          reviewCount: 0,
          lapseCount: 0,
          intervalDays: 0,
          lastRating: null,
          updatedAt: now,
        })
        .returning({
          id: flashcards.id,
          expression: flashcards.expression,
        })

      return savedCard
    })
  })
