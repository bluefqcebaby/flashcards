import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const StudyQueuePendingSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Study queue</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="rounded-xl border border-border/70 bg-background/40 p-6">
          <Skeleton className="h-10 w-56" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <div className="rounded-lg border border-border/60 bg-background/30 p-4">
            <Skeleton className="h-5 w-full max-w-80" />
            <Skeleton className="mt-3 h-4 w-full max-w-64" />
          </div>
          <div className="rounded-lg border border-border/60 bg-background/30 p-4">
            <Skeleton className="h-5 w-full max-w-72" />
            <Skeleton className="mt-3 h-4 w-full max-w-56" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
