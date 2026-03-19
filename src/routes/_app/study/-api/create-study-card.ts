import { createServerFn } from "@tanstack/react-start"

import { createFlashcardInputSchema } from "@/features/cards/model/contracts"
import { saveFlashcard } from "@/features/cards/server/save-flashcard"
import { authMiddleware } from "@/lib/server/server-fn-middleware"

export const createStudyCard = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(createFlashcardInputSchema)
  .handler(async ({ context, data }) => {
    await saveFlashcard({
      userId: context.session.user.id,
      ...data,
    })
  })
