import { useState } from "react"
import { IconArrowLeft, IconTrash, IconX } from "@tabler/icons-react"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"
import { deleteCards } from "@/routes/_app/study/-api/delete-cards"
import { getAllCards } from "@/routes/_app/study/-api/get-all-cards"
import { CardBrowserTable } from "@/routes/_app/study/-ui/card-browser-table"
import { CardEditSheet } from "@/routes/_app/study/-ui/card-edit-sheet"

const BrowsePage = () => {
  const cards = Route.useLoaderData()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingCard, setEditingCard] = useState<FlashcardRecord | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const submitDelete = useServerFn(deleteCards)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await submitDelete({ data: { ids: [...selectedIds] } })
      setSelectedIds(new Set())
      setShowDeleteDialog(false)
      await router.invalidate()
    } finally {
      setIsDeleting(false)
    }
  }

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
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Floating selection bar */}
      <div
        className={`fixed bottom-[15%] left-[var(--sidebar-width)] right-0 z-50 mx-auto flex w-full max-w-lg items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur transition-all duration-300 ${
          selectedIds.size > 0
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="tabular-nums">
            {selectedIds.size}
          </Badge>
          selected
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSelectedIds(new Set())}
          >
            <IconX />
          </Button>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
        >
          <IconTrash data-icon="inline-start" />
          Delete
        </Button>
      </div>

      <CardEditSheet
        card={editingCard}
        onOpenChange={(open) => {
          if (!open) setEditingCard(null)
        }}
        open={editingCard !== null}
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete ${selectedIds.size} card${selectedIds.size === 1 ? "" : "s"}?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
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
