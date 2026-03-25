import { useCallback, useEffect, useState } from "react"
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCards,
  IconCheck,
  IconFlame,
  IconReload,
} from "@tabler/icons-react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import type { RateStudyCardInput } from "@/features/cards/model/contracts"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"
import { getReviewData } from "@/routes/_app/study/-api/get-review-data"
import { rateStudyCard } from "@/routes/_app/study/-api/rate-study-card"
import { StudyFlashcard } from "@/routes/_app/study/-ui/study-flashcard"

// ─── Rating config ───────────────────────────────────────────────────────────

type Rating = "again" | "hard" | "good"

const RATINGS: {
  value: Rating
  label: string
  shortcut: string
  variant: "destructive" | "outline" | "default"
  icon: React.ReactNode
}[] = [
  {
    value: "again",
    label: "Again",
    shortcut: "1",
    variant: "destructive",
    icon: <IconReload className="size-5" />,
  },
  {
    value: "hard",
    label: "Hard",
    shortcut: "2",
    variant: "outline",
    icon: <IconReload className="size-5" />,
  },
  {
    value: "good",
    label: "Good",
    shortcut: "3",
    variant: "default",
    icon: <IconCheck className="size-5" />,
  },
]

const ratingKeyMap: Record<string, Rating> = Object.fromEntries(
  RATINGS.map((r) => [r.shortcut, r.value])
) as Record<string, Rating>

// ─── Page ────────────────────────────────────────────────────────────────────

const ReviewPage = () => {
  const { currentCard, dueCardCount, totalCardCount } = Route.useLoaderData()

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/study">
            <Button variant="ghost" size="icon-sm">
              <IconArrowLeft />
            </Button>
          </Link>
          <p className="text-xl font-semibold tracking-tight">Review</p>
          <Badge variant="outline">{dueCardCount} due</Badge>
        </div>
      </header>

      {currentCard ? (
        <ReviewCard
          key={currentCard.id}
          card={currentCard}
          dueCardCount={dueCardCount}
        />
      ) : totalCardCount === 0 ? (
        <ReviewEmpty variant="no-cards" />
      ) : (
        <ReviewEmpty variant="all-done" totalCardCount={totalCardCount} />
      )}
    </>
  )
}

// ─── Review Card ─────────────────────────────────────────────────────────────

type ReviewCardProps = {
  card: FlashcardRecord
  dueCardCount: number
}

const ReviewCard = ({ card, dueCardCount }: ReviewCardProps) => {
  const router = useRouter()
  const [isRevealed, setIsRevealed] = useState(false)
  const submitRating = useServerFn(rateStudyCard)

  const form = useForm({
    defaultValues: { cardId: card.id, rating: "good" } as RateStudyCardInput,
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await submitRating({ data: value as RateStudyCardInput })
          return undefined
        } catch (error) {
          return error instanceof Error
            ? error.message
            : "Could not save the rating."
        }
      },
    },
    onSubmit: async () => {
      await router.invalidate()
    },
  })

  const rate = useCallback(
    (rating: Rating) => {
      if (form.state.isSubmitting) return
      form.setFieldValue("rating", rating)
      void form.handleSubmit()
    },
    [form]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFormElement(e.target as HTMLElement)) return

      if (e.key === " ") {
        e.preventDefault()
        handleSpaceKey(isRevealed, setIsRevealed, rate)
        return
      }

      handleNumberKey(e.key, rate)
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isRevealed, rate])

  return (
    <div className="flex flex-1 flex-col">
      {/* Card area */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-4">
        {/* Progress */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconFlame className="size-4" />
          <span>{dueCardCount} remaining</span>
        </div>

        <StudyFlashcard
          card={card}
          isRevealed={isRevealed}
          onReveal={() => setIsRevealed(true)}
        />
      </div>

      {/* Error */}
      <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
        {(reviewError) =>
          reviewError ? (
            <Alert className="mb-4" variant="destructive">
              <IconAlertCircle />
              <AlertTitle>Could not save the rating</AlertTitle>
              <AlertDescription>{String(reviewError)}</AlertDescription>
            </Alert>
          ) : null
        }
      </form.Subscribe>

      {/* Sticky rating footer */}
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isRating) => (
          <form
            className="sticky bottom-0 mt-auto border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const rating = (
                e.nativeEvent as SubmitEvent
              ).submitter?.getAttribute("value") as Rating | null
              if (rating) {
                form.setFieldValue("rating", rating)
              }
              void form.handleSubmit()
            }}
          >
            <div className="mx-auto grid max-w-xl grid-cols-3 gap-3">
              {RATINGS.map((r) => (
                <RatingButton
                  key={r.value}
                  disabled={isRating}
                  label={r.label}
                  shortcut={r.shortcut}
                  variant={r.variant}
                  value={r.value}
                  icon={r.icon}
                  isLoading={isRating}
                />
              ))}
            </div>
          </form>
        )}
      </form.Subscribe>
    </div>
  )
}

// ─── Rating Button ───────────────────────────────────────────────────────────

type RatingButtonProps = {
  disabled: boolean
  label: string
  shortcut: string
  variant: "destructive" | "outline" | "default"
  value: string
  icon: React.ReactNode
  isLoading: boolean
}

const RatingButton = ({
  disabled,
  label,
  shortcut,
  variant,
  value,
  icon,
  isLoading,
}: RatingButtonProps) => (
  <Button
    type="submit"
    name="rating"
    value={value}
    className="h-12 flex-col gap-0.5 text-xs sm:h-14 sm:text-sm"
    disabled={disabled}
    variant={variant}
  >
    {isLoading ? <Spinner className="size-5" /> : <>{icon}</>}
    <span className="inline-flex items-center gap-1">
      {label}
      <kbd className="mt-0.5 hidden text-[10px] leading-none opacity-50 sm:inline">
        {shortcut}
      </kbd>
    </span>
  </Button>
)

// ─── Empty States ────────────────────────────────────────────────────────────

type ReviewEmptyProps =
  | { variant: "no-cards"; totalCardCount?: never }
  | { variant: "all-done"; totalCardCount: number }

const ReviewEmpty = ({ variant, totalCardCount }: ReviewEmptyProps) => (
  <div className="flex flex-1 items-center justify-center py-12">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {variant === "no-cards" ? <IconCards /> : <IconCheck />}
        </EmptyMedia>
        {variant === "no-cards" ? (
          <>
            <EmptyTitle>No cards yet</EmptyTitle>
            <EmptyDescription>
              Create cards first, then come back to review.
            </EmptyDescription>
          </>
        ) : (
          <>
            <EmptyTitle>All caught up</EmptyTitle>
            <EmptyDescription>
              {totalCardCount} cards in the deck, none due right now.
            </EmptyDescription>
          </>
        )}
      </EmptyHeader>
    </Empty>
  </div>
)

// ─── Pending ─────────────────────────────────────────────────────────────────

const ReviewPending = () => (
  <>
    <header className="flex items-center gap-3 border-b border-border/60 pb-4">
      <Skeleton className="size-8 rounded-md" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </header>
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-4">
      <Skeleton className="h-4 w-28" />
      <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-border/60 px-8 py-10">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
    </div>
    <div className="mt-auto border-t border-border/60 px-4 py-4 opacity-40">
      <div className="mx-auto grid max-w-xl grid-cols-3 gap-3">
        <Skeleton className="h-12 rounded-md sm:h-14" />
        <Skeleton className="h-12 rounded-md sm:h-14" />
        <Skeleton className="h-12 rounded-md sm:h-14" />
      </div>
    </div>
  </>
)

// ─── Keyboard helpers ────────────────────────────────────────────────────────

const isFormElement = (el: HTMLElement) => {
  const tag = el?.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}

const handleSpaceKey = (
  isRevealed: boolean,
  setIsRevealed: (v: boolean) => void,
  rate: (r: "good") => void
) => {
  if (!isRevealed) {
    setIsRevealed(true)
  } else {
    rate("good")
  }
}

const handleNumberKey = (key: string, rate: (r: Rating) => void) => {
  const rating = ratingKeyMap[key]
  if (rating) rate(rating)
}

// ─── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/_app/study/review")({
  loader: () => getReviewData(),
  pendingComponent: ReviewPending,
  pendingMs: 0,
  component: ReviewPage,
})
