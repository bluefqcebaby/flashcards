import { createFileRoute } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { getStudyRouteData } from "@/routes/_app/study/-api/get-study-route-data"
import { StudyQueuePendingSection } from "@/routes/_app/study/-ui/study-queue-pending-section"
import { StudyQueueSection } from "@/routes/_app/study/-ui/study-queue-section"
import { StudyRandomPendingSection } from "@/routes/_app/study/-ui/study-random-pending-section"
import { StudyRandomSection } from "@/routes/_app/study/-ui/study-random-section"

const StudyRoutePage = () => {
  const { currentCard, dueCardCount, randomCards, totalCardCount } =
    Route.useLoaderData()

  return (
    <main className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-5xl flex-col gap-5">
        <StudyPageHeader
          dueCardCount={dueCardCount}
          randomCardCount={randomCards.length}
          totalCardCount={totalCardCount}
        />

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] xl:items-start">
          <StudyQueueSection
            key={currentCard?.id ?? "empty"}
            currentCard={currentCard}
            dueCardCount={dueCardCount}
            totalCardCount={totalCardCount}
          />
          <StudyRandomSection randomCards={randomCards} />
        </section>
      </div>
    </main>
  )
}

const StudyRoutePending = () => {
  return (
    <main className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] xl:items-start">
        <StudyQueuePendingSection />
        <StudyRandomPendingSection />
      </div>
    </main>
  )
}

type StudyPageHeaderProps = {
  dueCardCount: number
  randomCardCount: number
  totalCardCount: number
}

const StudyPageHeader = ({
  dueCardCount,
  randomCardCount,
  totalCardCount,
}: StudyPageHeaderProps) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
      <p className="text-xl font-semibold tracking-tight">Study</p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{totalCardCount} total</Badge>
        <Badge variant="outline">{dueCardCount} due</Badge>
        <Badge variant="outline">{randomCardCount} shuffle-ready</Badge>
      </div>
    </header>
  )
}

export const Route = createFileRoute("/_app/study")({
  loader: () => getStudyRouteData(),
  pendingComponent: StudyRoutePending,
  pendingMs: 0,
  component: StudyRoutePage,
})
