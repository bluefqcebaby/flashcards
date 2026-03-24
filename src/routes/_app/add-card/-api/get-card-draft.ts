import { createServerFn } from "@tanstack/react-start"

import { authMiddleware } from "@/lib/server/server-fn-middleware"
import { getFlashcardDraftById } from "@/routes/_app/add-card/-api/queries"
import {
  persistedFlashcardDraftSchema,
  saveDraftAsFlashcardInputSchema,
} from "@/routes/_app/add-card/-model/add-card-types"

export const getCardDraft = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .inputValidator(saveDraftAsFlashcardInputSchema)
  .handler(async ({ context, data }) => {
    const draft = await getFlashcardDraftById(
      context.session.user.id,
      data.draftId
    )

    return draft ? persistedFlashcardDraftSchema.parse(draft) : null
  })
