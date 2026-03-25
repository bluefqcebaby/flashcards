import { IconSearch } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
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
  onEditCard: (card: FlashcardRecord) => void
}

export const CardBrowserTable = ({
  cards,
  searchQuery,
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

  if (cards.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No cards yet</EmptyTitle>
          <EmptyDescription>
            Cards you create will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
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
            onClick={() => onEditCard(card)}
          >
            <TableCell className="font-medium">{card.expression}</TableCell>
            <TableCell className="text-muted-foreground">
              {card.translation}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant="outline">{card.expressionType}</Badge>
            </TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">
              {formatDueDate(card.dueAt)}
            </TableCell>
            <TableCell className="hidden text-muted-foreground lg:table-cell">
              {card.reviewCount}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
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
