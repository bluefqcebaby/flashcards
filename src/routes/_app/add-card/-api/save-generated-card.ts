import { createServerFn } from "@tanstack/react-start"

import { saveFlashcard } from "@/features/cards/server/save-flashcard"
import { authMiddleware } from "@/lib/server/server-fn-middleware"
import { saveGeneratedFlashcardInputSchema } from "@/routes/_app/add-card/-model/add-card-types"

export const saveGeneratedCard = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(saveGeneratedFlashcardInputSchema)
  .handler(async ({ context, data }) => {
    const savedCard = await saveFlashcard({
      userId: context.session.user.id,
      expression: data.expression,
      expressionType: data.expressionType,
      translation: data.translation,
      examples: data.examples,
      notes: data.notes ?? undefined,
      pronunciation: data.pronunciation ?? undefined,
      partOfSpeech: data.partOfSpeech ?? undefined,
    })

    return savedCard
  })
