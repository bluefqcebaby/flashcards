import { createServerFn } from "@tanstack/react-start"
import { desc, eq } from "drizzle-orm"

import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"

export const getAllCards = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return db
      .select()
      .from(flashcards)
      .where(eq(flashcards.userId, context.session.user.id))
      .orderBy(desc(flashcards.createdAt))
  })
