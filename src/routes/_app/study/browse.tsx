import { useState } from "react"
import { IconArrowLeft } from "@tabler/icons-react"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"
import { getAllCards } from "@/routes/_app/study/-api/get-all-cards"
import { CardBrowserTable } from "@/routes/_app/study/-ui/card-browser-table"
import { CardEditSheet } from "@/routes/_app/study/-ui/card-edit-sheet"

const BrowsePage = () => {
  const cards = Route.useLoaderData()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingCard, setEditingCard] = useState<FlashcardRecord | null>(null)

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/study">
            <Button variant="ghost" size="icon-sm">
              <IconArrowLeft />
            </Button>
          </Link>
          <p className="text-xl font-semibold tracking-tight">Browse</p>
          <Badge variant="secondary">{cards.length} cards</Badge>
        </div>
        <Input
          className="max-w-xs"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search..."
          value={searchQuery}
        />
      </header>

      <CardBrowserTable
        cards={cards}
        onEditCard={setEditingCard}
        searchQuery={searchQuery}
      />

      <CardEditSheet
        card={editingCard}
        onOpenChange={(open) => {
          if (!open) setEditingCard(null)
        }}
        open={editingCard !== null}
      />
    </>
  )
}

const BrowsePending = () => {
  return (
    <>
      <header className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-9 w-60" />
      </header>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </>
  )
}

export const Route = createFileRoute("/_app/study/browse")({
  loader: () => getAllCards(),
  pendingComponent: BrowsePending,
  pendingMs: 0,
  component: BrowsePage,
})
