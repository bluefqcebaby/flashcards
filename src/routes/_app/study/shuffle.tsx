import { IconArrowLeft } from "@tabler/icons-react"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getStudyRouteData } from "@/routes/_app/study/-api/get-study-route-data"
import { StudyRandomPendingSection } from "@/routes/_app/study/-ui/study-random-pending-section"
import { StudyRandomSection } from "@/routes/_app/study/-ui/study-random-section"

const ShufflePage = () => {
  const { randomCards } = Route.useLoaderData()

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/study">
            <Button variant="ghost" size="icon-sm">
              <IconArrowLeft />
            </Button>
          </Link>
          <p className="text-xl font-semibold tracking-tight">Shuffle</p>
          <Badge variant="secondary">{randomCards.length} cards</Badge>
        </div>
      </header>

      <StudyRandomSection randomCards={randomCards} />
    </>
  )
}

const ShufflePending = () => {
  return (
    <>
      <header className="flex items-center gap-3 border-b border-border/60 pb-4">
        <div className="size-8 animate-pulse rounded-md bg-muted" />
        <div className="h-7 w-20 animate-pulse rounded bg-muted" />
      </header>
      <StudyRandomPendingSection />
    </>
  )
}

export const Route = createFileRoute("/_app/study/shuffle")({
  loader: () => getStudyRouteData(),
  pendingComponent: ShufflePending,
  pendingMs: 0,
  component: ShufflePage,
})
