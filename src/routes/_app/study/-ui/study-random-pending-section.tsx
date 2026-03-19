import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const StudyRandomPendingSection = () => {
  return (
    <Card className="border-primary/20 bg-card/95">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <CardTitle>Random study</CardTitle>
            <Skeleton className="h-4 w-full max-w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="rounded-2xl border border-primary/20 bg-background/40 p-6">
          <Skeleton className="h-10 w-64" />
        </div>

        <Skeleton className="h-10 w-36" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-full max-w-72" />
          </div>
          <div className="rounded-xl border border-border/60 bg-background/30 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-4 w-full max-w-56" />
            <Skeleton className="mt-2 h-4 w-full max-w-48" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <div className="rounded-xl border border-border/60 bg-background/30 p-4">
            <Skeleton className="h-5 w-full max-w-80" />
            <Skeleton className="mt-3 h-4 w-full max-w-64" />
          </div>
          <div className="rounded-xl border border-border/60 bg-background/30 p-4">
            <Skeleton className="h-5 w-full max-w-72" />
            <Skeleton className="mt-3 h-4 w-full max-w-56" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </CardContent>
    </Card>
  )
}
