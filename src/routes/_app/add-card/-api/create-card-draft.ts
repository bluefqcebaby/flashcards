import { createServerFn } from "@tanstack/react-start"

import { flashcardDrafts } from "@/features/cards/model/flashcard-draft-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"
import {
  createDraftInputSchema,
  persistedFlashcardDraftSchema,
} from "@/routes/_app/add-card/-model/add-card-types"

export const createCardDraft = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(createDraftInputSchema)
  .handler(async ({ context, data }) => {
    const now = new Date()
    const [draft] = await db
      .insert(flashcardDrafts)
      .values({
        id: crypto.randomUUID(),
        userId: context.session.user.id,
        status: "pending",
        seedExpression: data.seedExpression,
        inputMode: data.inputMode,
        regenerationNotes: null,
        errorMessage: null,
        updatedAt: now,
      })
      .returning()

    return persistedFlashcardDraftSchema.parse(draft)
  })
