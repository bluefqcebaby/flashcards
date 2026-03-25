import { IconCards, IconSearch } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"

type CardBrowserTableProps = {
  cards: FlashcardRecord[]
  searchQuery: string
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  onEditCard: (card: FlashcardRecord) => void
}

export const CardBrowserTable = ({
  cards,
  searchQuery,
  selectedIds,
  onSelectionChange,
  onEditCard,
}: CardBrowserTableProps) => {
  const query = searchQuery.toLowerCase().trim()
  const filtered = query
    ? cards.filter(
        (card) =>
          card.expression.toLowerCase().includes(query) ||
          card.translation.toLowerCase().includes(query)
      )
    : cards

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id))

  const someFilteredSelected =
    !allFilteredSelected && filtered.some((c) => selectedIds.has(c.id))

  const toggleAll = () => {
    if (allFilteredSelected) {
      const next = new Set(selectedIds)
      for (const c of filtered) next.delete(c.id)
      onSelectionChange(next)
    } else {
      const next = new Set(selectedIds)
      for (const c of filtered) next.add(c.id)
      onSelectionChange(next)
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onSelectionChange(next)
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconCards />
            </EmptyMedia>
            <EmptyTitle>No cards yet</EmptyTitle>
            <EmptyDescription>
              Create your first card to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/add-card">
              <Button>Add card</Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconSearch />
          </EmptyMedia>
          <EmptyTitle>No matches</EmptyTitle>
          <EmptyDescription>
            No cards match &ldquo;{searchQuery}&rdquo;
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              checked={allFilteredSelected}
              indeterminate={someFilteredSelected}
              onCheckedChange={toggleAll}
            />
          </TableHead>
          <TableHead>Expression</TableHead>
          <TableHead>Translation</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="hidden md:table-cell">Due</TableHead>
          <TableHead className="hidden lg:table-cell">Reviews</TableHead>
          <TableHead className="hidden lg:table-cell">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((card) => (
          <TableRow
            key={card.id}
            className="cursor-pointer"
            data-state={selectedIds.has(card.id) ? "selected" : undefined}
          >
            <TableCell onClick={(e) => e.stopPropagation()} className="w-10">
              <Checkbox
                checked={selectedIds.has(card.id)}
                onCheckedChange={() => toggleOne(card.id)}
              />
            </TableCell>
            <TableCell className="font-medium" onClick={() => onEditCard(card)}>
              {card.expression}
            </TableCell>
            <TableCell
              className="text-muted-foreground"
              onClick={() => onEditCard(card)}
            >
              {card.translation}
            </TableCell>
            <TableCell
              className="hidden sm:table-cell"
              onClick={() => onEditCard(card)}
            >
              <Badge variant="outline">{card.expressionType}</Badge>
            </TableCell>
            <TableCell
              className="hidden text-muted-foreground md:table-cell"
              onClick={() => onEditCard(card)}
            >
              {formatDueDate(card.dueAt)}
            </TableCell>
            <TableCell
              className="hidden text-muted-foreground lg:table-cell"
              onClick={() => onEditCard(card)}
            >
              {card.reviewCount}
            </TableCell>
            <TableCell
              className="hidden lg:table-cell"
              onClick={() => onEditCard(card)}
            >
              {card.lastRating ? (
                <RatingBadge rating={card.lastRating} />
              ) : (
                <span className="text-muted-foreground">&mdash;</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const RatingBadge = ({ rating }: { rating: string }) => {
  const variant =
    rating === "again"
      ? "destructive"
      : rating === "good"
        ? "default"
        : "secondary"

  return <Badge variant={variant}>{rating}</Badge>
}

const formatDueDate = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const absDiff = Math.abs(diff)

  const minutes = Math.floor(absDiff / 60_000)
  const hours = Math.floor(absDiff / 3_600_000)
  const days = Math.floor(absDiff / 86_400_000)

  const isPast = diff < 0

  if (minutes < 1) return "now"
  if (minutes < 60) {
    const label = `${minutes}m`
    return isPast ? `${label} ago` : `in ${label}`
  }
  if (hours < 24) {
    const label = `${hours}h`
    return isPast ? `${label} ago` : `in ${label}`
  }
  const label = `${days}d`
  return isPast ? `${label} ago` : `in ${label}`
}
