import { useState } from "react"
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCards,
  IconCheck,
  IconEye,
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

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <IconFlame className="size-4" />
        <span>{dueCardCount} remaining</span>
      </div>

      {/* Flashcard */}
      <div className="flex w-full max-w-xl flex-col gap-6">
        {/* Expression display */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card px-8 py-10 shadow-xs">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary">{card.expressionType}</Badge>
            {card.pronunciation ? (
              <Badge variant="outline">{card.pronunciation}</Badge>
            ) : null}
          </div>

          <p className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {card.expression}
          </p>
        </div>

        {/* Reveal / Answer */}
        {!isRevealed ? (
          <div className="flex justify-center">
            <Button
              className="px-8"
              onClick={() => setIsRevealed(true)}
              size="lg"
            >
              <IconEye data-icon="inline-start" />
              Reveal
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Translation */}
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border/40 bg-card/50 px-6 py-5">
              <p className="text-center text-xl font-medium sm:text-2xl">
                {card.translation}
              </p>
              {card.notes ? (
                <p className="text-center text-sm text-muted-foreground">
                  {card.notes}
                </p>
              ) : null}
            </div>

            {/* Examples */}
            <div className="grid gap-3 sm:grid-cols-2">
              {card.examples.map((example) => (
                <div
                  key={`${example.targetText}-${example.baseText}`}
                  className="rounded-lg border border-border/40 px-4 py-3"
                >
                  <p className="text-sm font-medium">{example.targetText}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {example.baseText}
                  </p>
                </div>
              ))}
            </div>

            {/* Error */}
            <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
              {(reviewError) =>
                reviewError ? (
                  <Alert variant="destructive">
                    <IconAlertCircle />
                    <AlertTitle>Could not save the rating</AlertTitle>
                    <AlertDescription>
                      {String(reviewError)}
                    </AlertDescription>
                  </Alert>
                ) : null
              }
            </form.Subscribe>

            {/* Rating buttons */}
            <form.Field name="rating">
              {(field) => (
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isRating) => (
                    <div className="grid grid-cols-3 gap-3">
                      <RatingButton
                        disabled={isRating}
                        label="Again"
                        variant="destructive"
                        icon={<IconReload className="size-5" />}
                        onClick={() => {
                          field.handleChange("again")
                          void form.handleSubmit()
                        }}
                        isLoading={isRating}
                      />
                      <RatingButton
                        disabled={isRating}
                        label="Hard"
                        variant="outline"
                        icon={<IconReload className="size-5" />}
                        onClick={() => {
                          field.handleChange("hard")
                          void form.handleSubmit()
                        }}
                        isLoading={isRating}
                      />
                      <RatingButton
                        disabled={isRating}
                        label="Good"
                        variant="default"
                        icon={<IconCheck className="size-5" />}
                        onClick={() => {
                          field.handleChange("good")
                          void form.handleSubmit()
                        }}
                        isLoading={isRating}
                      />
                    </div>
                  )}
                </form.Subscribe>
              )}
            </form.Field>
          </div>
        )}
      </div>
    </div>
  )
}

type RatingButtonProps = {
  disabled: boolean
  label: string
  variant: "destructive" | "outline" | "default"
  icon: React.ReactNode
  onClick: () => void
  isLoading: boolean
}

const RatingButton = ({
  disabled,
  label,
  variant,
  icon,
  onClick,
  isLoading,
}: RatingButtonProps) => (
  <Button
    className="h-12 flex-col gap-0.5 text-xs sm:h-14 sm:text-sm"
    disabled={disabled}
    onClick={onClick}
    variant={variant}
  >
    {isLoading ? <Spinner className="size-5" /> : icon}
    {label}
  </Button>
)

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

const ReviewPending = () => (
  <>
    <header className="flex items-center gap-3 border-b border-border/60 pb-4">
      <Skeleton className="size-8 rounded-md" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </header>
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-4">
      <Skeleton className="h-4 w-28" />
      <div className="flex w-full max-w-xl flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-border/60 px-8 py-10">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-11 w-32 rounded-md" />
      </div>
    </div>
  </>
)

export const Route = createFileRoute("/_app/study/review")({
  loader: () => getReviewData(),
  pendingComponent: ReviewPending,
  pendingMs: 0,
  component: ReviewPage,
})
