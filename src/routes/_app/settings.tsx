import { createFileRoute } from "@tanstack/react-router"

import { AppPagePlaceholder } from "@/routes/_app/-ui/app-page-placeholder"

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <AppPagePlaceholder
      ctaLabel="Outline account settings"
      description="Settings will eventually hold account controls, language preferences, and product-level switches without becoming a dumping ground."
      eyebrow="Control"
      highlights={[
        {
          label: "Account",
          value: "Authenticated",
          help: "Basic identity and sign-out already exist in the shell footer.",
        },
        {
          label: "Learning preferences",
          value: "Language pair ready",
          help: "This page can later expose editing of learner defaults without reopening onboarding.",
        },
        {
          label: "Theme mode",
          value: "Dark-only",
          help: "The current redesign intentionally commits to dark mode for this phase.",
        },
      ]}
      notes={[
        "Keep settings compact and product-specific, not a generic account graveyard.",
        "Language preferences likely belong here once onboarding is complete.",
        "Future toggles should stay rare and meaningful so the product remains opinionated.",
      ]}
      title="Tune the product around the learner"
    />
  )
}
