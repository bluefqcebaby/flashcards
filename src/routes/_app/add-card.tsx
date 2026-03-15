import { createFileRoute } from "@tanstack/react-router"

import { AppPagePlaceholder } from "@/routes/_app/-ui/app-page-placeholder"

export const Route = createFileRoute("/_app/add-card")({
  component: AddCardPage,
})

function AddCardPage() {
  return (
    <AppPagePlaceholder
      ctaLabel="Prototype card creation flow"
      description="This screen is reserved for the smallest useful creation loop: enter a phrase, let AI propose translation and examples, then accept or regenerate."
      eyebrow="Creation"
      highlights={[
        {
          label: "Input mode",
          value: "Word or phrase",
          help: "The first version should feel lightweight enough for quick capture.",
        },
        {
          label: "AI output",
          value: "3 response blocks",
          help: "Translation plus two short examples is the current intended MVP payload.",
        },
        {
          label: "Decision point",
          value: "Accept / Regenerate",
          help: "The page should make iteration feel fast, not like filling a long form.",
        },
      ]}
      notes={[
        "Keep the route focused on one fast creation loop, not deck management.",
        "Use the learner's selected language pair as hidden context, not extra form noise.",
        "Leave visual room for future generation states and alternate suggestions.",
      ]}
      title="Add a new card with AI help"
    />
  )
}
