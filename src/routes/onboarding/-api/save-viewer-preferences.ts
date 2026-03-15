import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { redirect } from "@tanstack/react-router"
import { auth } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import {
  saveViewerPreferencesInputSchema,
  type SaveViewerPreferencesInput,
} from "@/routes/onboarding/-model/contracts"
import {
  getLanguageOption,
  isValidLanguageCode,
} from "@/routes/onboarding/-model/languages"
import { userPreferences } from "@/routes/onboarding/-model/user-preferences-schema"

export const saveViewerPreferences = createServerFn({
  method: "POST",
})
  .inputValidator(saveViewerPreferencesInputSchema.refine(
    (value) =>
      isValidLanguageCode(value.learningLanguageCode) &&
      isValidLanguageCode(value.baseLanguageCode),
    {
      message: "Choose both languages from the available list.",
    },
  ))
  .handler(async ({ data }: { data: SaveViewerPreferencesInput }) => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })

    if (!session) {
      throw redirect({ to: "/" })
    }

    const learningLanguage = getLanguageOption(data.learningLanguageCode)
    const baseLanguage = getLanguageOption(data.baseLanguageCode)

    if (!learningLanguage || !baseLanguage) {
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

    throw redirect({ to: "/" })
  })
