import { createFileRoute } from "@tanstack/react-router"

import { AppPagePlaceholder } from "@/routes/_app/-ui/app-page-placeholder"

export const Route = createFileRoute("/_app/study")({
  component: StudyPage,
})

function StudyPage() {
  return (
    <AppPagePlaceholder
      ctaLabel="Shape the first study session"
      description="This space will turn into the review flow for spaced repetition ratings, fast card flipping, and session momentum."
      eyebrow="Practice"
      highlights={[
        {
          label: "Review format",
          value: "Single-card focus",
          help: "A calm, one-card-at-a-time experience will likely keep the MVP clear.",
        },
        {
          label: "Rating model",
          value: "SRS choices",
          help: "Future feedback buttons will decide how cards move through repetition.",
        },
        {
          label: "Session mood",
          value: "Calm and fast",
          help: "The shell already leaves room for keyboard flow and low-friction repetition.",
        },
      ]}
      notes={[
        "This should feel more like a focused ritual than a busy dashboard.",
        "Progress cues should support momentum without breaking concentration.",
        "The eventual interaction model can be optimized for both click and keyboard use.",
      ]}
      title="Study cards and keep the rhythm"
    />
  )
}
