import { createFileRoute } from "@tanstack/react-router"

import { getStudyRouteData } from "@/routes/_app/study/-api/get-study-route-data"
import { StudyCreateCardSection } from "@/routes/_app/study/-ui/study-create-card-section"
import { StudyQueuePendingSection } from "@/routes/_app/study/-ui/study-queue-pending-section"
import { StudyQueueSection } from "@/routes/_app/study/-ui/study-queue-section"

const StudyRoutePage = () => {
  const { currentCard, dueCardCount, totalCardCount } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <StudyCreateCardSection />
      <StudyQueueSection
        key={currentCard?.id ?? "empty"}
        currentCard={currentCard}
        dueCardCount={dueCardCount}
        totalCardCount={totalCardCount}
      />
    </div>
  )
}

const StudyRoutePending = () => {
  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <StudyCreateCardSection />
      <StudyQueuePendingSection />
    </div>
  )
}

export const Route = createFileRoute("/_app/study")({
  loader: () => getStudyRouteData(),
  pendingComponent: StudyRoutePending,
  pendingMs: 0,
  component: StudyRoutePage,
})
