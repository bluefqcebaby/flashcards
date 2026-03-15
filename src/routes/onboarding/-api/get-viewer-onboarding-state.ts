import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/server/auth"
import { db } from "@/lib/server/db"
import {
  type ViewerIdentity,
  type ViewerOnboardingState,
  type ViewerPreferences,
} from "@/routes/onboarding/-model/contracts"
import {
  userPreferences,
  type UserPreferencesRecord,
} from "@/routes/onboarding/-model/user-preferences-schema"

function toViewerIdentity(user: {
  id: string
  name: string
  email: string
  image?: string | null
}): ViewerIdentity {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
  }
}

function toViewerPreferences(
  record: UserPreferencesRecord,
): ViewerPreferences {
  return {
    userId: record.userId,
    learningLanguageCode: record.learningLanguageCode,
    learningLanguageName: record.learningLanguageName,
    baseLanguageCode: record.baseLanguageCode,
    baseLanguageName: record.baseLanguageName,
    onboardingCompletedAt: record.onboardingCompletedAt,
  }
}

export const getViewerOnboardingState = createServerFn({
  method: "GET",
}).handler(async (): Promise<ViewerOnboardingState> => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  if (!session) {
    return { status: "signed-out" }
  }

  const [preferences] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1)

  if (!preferences) {
    return {
      status: "needs-onboarding",
      user: toViewerIdentity(session.user),
    }
  }

  return {
    status: "ready",
    user: toViewerIdentity(session.user),
    preferences: toViewerPreferences(preferences),
  }
})
