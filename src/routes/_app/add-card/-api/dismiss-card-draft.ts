import { createServerFn } from "@tanstack/react-start"
import { and, eq, ne } from "drizzle-orm"

import { flashcardDrafts } from "@/features/cards/model/flashcard-draft-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"
import { dismissDraftInputSchema } from "@/routes/_app/add-card/-model/add-card-types"

export const dismissCardDraft = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(dismissDraftInputSchema)
  .handler(async ({ context, data }) => {
    const [dismissedDraft] = await db
      .delete(flashcardDrafts)
      .where(
        and(
          eq(flashcardDrafts.id, data.draftId),
          eq(flashcardDrafts.userId, context.session.user.id),
          ne(flashcardDrafts.status, "saved")
        )
      )
      .returning({ id: flashcardDrafts.id })

    if (!dismissedDraft) {
      throw new Error("Could not dismiss this draft.")
    }

    return dismissedDraft
  })
