import { IconArrowsShuffle, IconCards, IconTable } from "@tabler/icons-react"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getStudyHubData } from "@/routes/_app/study/-api/get-study-hub-data"

const StudyHubPage = () => {
  const { dueCardCount, totalCardCount } = Route.useLoaderData()

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <ModeCard
        to="/study/browse"
        icon={<IconTable className="size-6" />}
        label="Browse"
        stat={`${totalCardCount}`}
        statLabel="cards"
      />
      <ModeCard
        to="/study/review"
        icon={<IconCards className="size-6" />}
        label="Review"
        stat={`${dueCardCount}`}
        statLabel="due"
      />
      <ModeCard
        to="/study/shuffle"
        icon={<IconArrowsShuffle className="size-6" />}
        label="Shuffle"
        stat={`${totalCardCount}`}
        statLabel="cards"
      />
    </section>
  )
}

type ModeCardProps = {
  to: string
  icon: React.ReactNode
  label: string
  stat: string
  statLabel: string
}

const ModeCard = ({ to, icon, label, stat, statLabel }: ModeCardProps) => {
  return (
    <Link to={to} className="no-underline">
      <Card className="transition-colors hover:bg-muted/40">
        <CardContent className="flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            {icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{label}</p>
            <Badge variant="secondary" className="w-fit">
              {stat} {statLabel}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

const StudyHubPending = () => {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <SkeletonModeCard />
      <SkeletonModeCard />
      <SkeletonModeCard />
    </section>
  )
}

const SkeletonModeCard = () => (
  <Card>
    <CardContent className="flex items-center gap-4">
      <Skeleton className="size-10 rounded-lg" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </CardContent>
  </Card>
)

export const Route = createFileRoute("/_app/study/")({
  loader: () => getStudyHubData(),
  pendingComponent: StudyHubPending,
  pendingMs: 0,
  component: StudyHubPage,
})
