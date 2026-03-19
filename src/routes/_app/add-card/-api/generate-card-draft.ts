import { createServerFn } from "@tanstack/react-start"

import { authMiddleware } from "@/lib/server/server-fn-middleware"
import {
  generatedFlashcardDraftSchema,
  generateFlashcardDraftInputSchema,
} from "@/routes/_app/add-card/-model/add-card-types"
import { generateFlashcardDraft } from "@/routes/_app/add-card/-server/generate-flashcard-draft"

export const generateCardDraft = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(generateFlashcardDraftInputSchema)
  .handler(async ({ context, data }) => {
    const draft = await generateFlashcardDraft(
      context.session.user.id,
      data.seedExpression
    )

    return generatedFlashcardDraftSchema.parse(draft)
  })
