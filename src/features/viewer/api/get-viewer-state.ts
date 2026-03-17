import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"

import type {
  ViewerIdentity,
  ViewerPreferences,
  ViewerState,
} from "@/features/viewer/model/contracts"
import {
  type UserPreferencesRecord,
  userPreferences,
} from "@/features/viewer/model/user-preferences-schema"
import { db } from "@/lib/server/db"
import { sessionMiddleware } from "@/lib/server/server-fn-middleware"

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

function toViewerPreferences(record: UserPreferencesRecord): ViewerPreferences {
  return {
    userId: record.userId,
    learningLanguageCode: record.learningLanguageCode,
    learningLanguageName: record.learningLanguageName,
    baseLanguageCode: record.baseLanguageCode,
    baseLanguageName: record.baseLanguageName,
    onboardingCompletedAt: record.onboardingCompletedAt,
  }
}

export const getViewerState = createServerFn({
  method: "GET",
})
  .middleware([sessionMiddleware])
  .handler(async ({ context }): Promise<ViewerState> => {
    const { session } = context

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
