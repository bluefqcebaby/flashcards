import { createFileRoute } from "@tanstack/react-router"

import { AppPagePlaceholder } from "@/routes/_app/-ui/app-page-placeholder"

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <AppPagePlaceholder
      ctaLabel="Design the first useful dashboard"
      description="This will become the daily home for the learner: what to review next, what to add, and what is improving."
      eyebrow="Overview"
      highlights={[
        {
          label: "Daily review queue",
          value: "0 cards",
          help: "A future high-signal summary of what needs attention right now.",
        },
        {
          label: "Cards created",
          value: "Coming soon",
          help: "A lightweight snapshot of how much fresh material the learner added.",
        },
        {
          label: "Study rhythm",
          value: "Unshaped",
          help: "Streaks, consistency, and learning momentum can settle here later.",
        },
      ]}
      notes={[
        "Surface the next best action immediately, not just passive stats.",
        "Show a compact study summary that makes returning to the app feel useful.",
        "Keep room for motivational signals without turning the page into noise.",
      ]}
      title="Welcome back to your language workspace"
    />
  )
}
