import { createServerFn } from "@tanstack/react-start"
import { and, eq } from "drizzle-orm"

import { updateFlashcardInputSchema } from "@/features/cards/model/contracts"
import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"

export const updateCard = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(updateFlashcardInputSchema)
  .handler(async ({ context, data }) => {
    const { id, ...fields } = data

    await db
      .update(flashcards)
      .set({
        expression: fields.expression,
        expressionType: fields.expressionType,
        translation: fields.translation,
        examples: fields.examples,
        notes: fields.notes?.trim() || null,
        pronunciation: fields.pronunciation?.trim() || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(flashcards.id, id),
          eq(flashcards.userId, context.session.user.id)
        )
      )
  })
