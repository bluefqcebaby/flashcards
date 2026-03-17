import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

import { saveViewerPreferencesInputSchema } from "@/features/viewer/model/contracts"
import { userPreferences } from "@/features/viewer/model/user-preferences-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"
import {
  getLanguageOption,
  isValidLanguageCode,
} from "@/routes/onboarding/-model/languages"

export const saveViewerPreferences = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(
    saveViewerPreferencesInputSchema.refine(
      (value) =>
        isValidLanguageCode(value.learningLanguageCode) &&
        isValidLanguageCode(value.baseLanguageCode),
      {
        message: "Choose both languages from the available list.",
      }
    )
  )
  .handler(async ({ context, data }) => {
    const { session } = context

    const learningLanguage = getLanguageOption(data.learningLanguageCode)
    const baseLanguage = getLanguageOption(data.baseLanguageCode)

    if (!(learningLanguage && baseLanguage)) {
      throw new Error("Selected languages are no longer available.")
    }

    const now = new Date()

    await db
      .insert(userPreferences)
      .values({
        userId: session.user.id,
        learningLanguageCode: learningLanguage.code,
        learningLanguageName: learningLanguage.name,
        baseLanguageCode: baseLanguage.code,
        baseLanguageName: baseLanguage.name,
        onboardingCompletedAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          learningLanguageCode: learningLanguage.code,
          learningLanguageName: learningLanguage.name,
          baseLanguageCode: baseLanguage.code,
          baseLanguageName: baseLanguage.name,
          onboardingCompletedAt: now,
          updatedAt: now,
        },
      })

    throw redirect({ to: "/dashboard" })
  })
