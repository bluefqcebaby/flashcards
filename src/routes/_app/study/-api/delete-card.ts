import { createServerFn } from "@tanstack/react-start"
import { and, eq } from "drizzle-orm"

import { deleteFlashcardInputSchema } from "@/features/cards/model/contracts"
import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"

export const deleteCard = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(deleteFlashcardInputSchema)
  .handler(async ({ context, data }) => {
    await db
      .delete(flashcards)
      .where(
        and(
          eq(flashcards.id, data.id),
          eq(flashcards.userId, context.session.user.id)
        )
      )
  })
