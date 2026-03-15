import { z } from "zod"

export type LanguageOption = {
  code: string
  name: string
  nativeName: string
}

export type ViewerIdentity = {
  id: string
  name: string
  email: string
  image: string | null
}

export type ViewerPreferences = {
  userId: string
  learningLanguageCode: string
  learningLanguageName: string
  baseLanguageCode: string
  baseLanguageName: string
  onboardingCompletedAt: Date
}

export type ViewerState =
  | { status: "signed-out" }
  | { status: "needs-onboarding"; user: ViewerIdentity }
  | { status: "ready"; user: ViewerIdentity; preferences: ViewerPreferences }

export const saveViewerPreferencesInputSchema = z.object({
  learningLanguageCode: z
    .string()
    .min(1, "Choose the language you want to learn."),
  baseLanguageCode: z.string().min(1, "Choose your base language."),
})

export type SaveViewerPreferencesInput = z.infer<
  typeof saveViewerPreferencesInputSchema
>

export function formatLanguageLabel(language: LanguageOption) {
  return language.nativeName === language.name
    ? `${language.name} (${language.code.toUpperCase()})`
    : `${language.name} (${language.nativeName})`
}

export function formatLanguagePair(preferences: ViewerPreferences) {
  return `${preferences.learningLanguageName} -> ${preferences.baseLanguageName}`
}

export function getInitials(name: string, email?: string) {
  const source = name.trim() || email?.trim() || "U"
  const parts = source.split(/\s+/).filter(Boolean)
  const [first = "U", second = ""] = parts

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase()
  }

  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase()
}
