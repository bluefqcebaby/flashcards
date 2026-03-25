import { createServerFn } from "@tanstack/react-start"
import { and, eq, inArray } from "drizzle-orm"

import { deleteFlashcardsInputSchema } from "@/features/cards/model/contracts"
import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"

export const deleteCards = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(deleteFlashcardsInputSchema)
  .handler(async ({ context, data }) => {
    await db
      .delete(flashcards)
      .where(
        and(
          inArray(flashcards.id, data.ids),
          eq(flashcards.userId, context.session.user.id)
        )
      )
  })
