import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AddCardPendingPage() {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-6 overflow-hidden px-4 py-6 lg:flex-row lg:items-stretch lg:gap-8 lg:px-6">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 lg:shrink-0">
        <Card className="border-primary/15 bg-card/90 shadow-lg shadow-black/10">
          <CardHeader className="gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            <div className="grid gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>

      <div className="flex min-h-0 min-w-0 flex-[2] flex-col overflow-hidden px-1 py-1">
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden pr-2">
          <AddCardPendingDraft />
          <AddCardPendingDraft />
          <AddCardPendingDraft />
        </div>
      </div>
    </div>
  )
}

function AddCardPendingDraft() {
  return (
    <Card className="gap-0 overflow-hidden border-border/70 bg-card/95 py-0 shadow-sm shadow-black/5">
      <CardContent className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-3" />
              <Skeleton className="h-5 w-24" />
            </div>

            <Skeleton className="h-4 w-48" />
          </div>

          <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}
