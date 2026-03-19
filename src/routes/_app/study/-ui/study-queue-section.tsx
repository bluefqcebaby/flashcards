import { useState } from "react"
import {
  IconAlertCircle,
  IconBooks,
  IconCards,
  IconCheck,
  IconReload,
} from "@tabler/icons-react"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import type {
  RateStudyCardInput,
  StudyRating,
} from "@/features/cards/model/contracts"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"
import { rateStudyCard } from "@/routes/_app/study/-api/rate-study-card"

type StudyQueueSectionProps = {
  currentCard: FlashcardRecord | null
  dueCardCount: number
  totalCardCount: number
}

const ratingOptions: Array<{
  value: StudyRating
  label: string
  variant: "destructive" | "outline" | "default"
}> = [
  { value: "again", label: "Again", variant: "destructive" },
  { value: "hard", label: "Hard", variant: "outline" },
  { value: "good", label: "Good", variant: "default" },
]

const getStudyQueueFormDefaults = (cardId: string): RateStudyCardInput => ({
  cardId,
  rating: "good",
})

export const StudyQueueSection = ({
  currentCard,
  dueCardCount,
  totalCardCount,
}: StudyQueueSectionProps) => {
  const router = useRouter()
  const [isRevealed, setIsRevealed] = useState(false)
  const submitRating = useServerFn(rateStudyCard)
  const form = useForm({
    defaultValues: getStudyQueueFormDefaults(currentCard?.id ?? ""),
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (!currentCard) {
          return "Card not found."
        }

        try {
          await submitRating({
            data: value as RateStudyCardInput,
          })

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
    <Card>
      <CardHeader>
        <CardTitle>Study queue</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{totalCardCount} total</Badge>
          <Badge variant="outline">{dueCardCount} due now</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentCard ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{currentCard.expressionType}</Badge>
              {currentCard.partOfSpeech ? (
                <Badge variant="outline">{currentCard.partOfSpeech}</Badge>
              ) : null}
              {currentCard.pronunciation ? (
                <Badge variant="outline">{currentCard.pronunciation}</Badge>
              ) : null}
            </div>

            <div className="rounded-xl border border-border/70 bg-background/40 p-6">
              <p className="text-3xl font-semibold tracking-tight">
                {currentCard.expression}
              </p>
            </div>

            {!isRevealed ? (
              <Button className="w-fit" onClick={() => setIsRevealed(true)}>
                <IconBooks data-icon="inline-start" />
                Reveal answer
              </Button>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Translation
                  </p>
                  <p className="text-xl font-medium">
                    {currentCard.translation}
                  </p>
                  {currentCard.notes ? (
                    <p className="text-sm text-muted-foreground">
                      {currentCard.notes}
                    </p>
                  ) : null}
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Examples
                  </p>
                  {currentCard.examples.map((example) => (
                    <div
                      key={`${example.targetText}-${example.baseText}`}
                      className="rounded-lg border border-border/60 bg-background/30 p-4"
                    >
                      <p className="font-medium">{example.targetText}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {example.baseText}
                      </p>
                    </div>
                  ))}
                </div>

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

                <form.Field name="rating">
                  {(field) => (
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                      {(isRating) => (
                        <div className="flex flex-wrap gap-2">
                          {ratingOptions.map((option) => (
                            <Button
                              key={option.value}
                              disabled={isRating}
                              onClick={() => {
                                field.handleChange(option.value)
                                void form.handleSubmit()
                              }}
                              variant={option.variant}
                            >
                              {isRating ? (
                                <Spinner data-icon="inline-start" />
                              ) : option.value === "good" ? (
                                <IconCheck data-icon="inline-start" />
                              ) : (
                                <IconReload data-icon="inline-start" />
                              )}
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </form.Subscribe>
                  )}
                </form.Field>
              </div>
            )}
          </div>
        ) : totalCardCount === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconCards />
              </EmptyMedia>
              <EmptyTitle>No cards yet</EmptyTitle>
              <EmptyDescription>
                Add your first card above and it will land in the study queue
                immediately.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconCheck />
              </EmptyMedia>
              <EmptyTitle>Nothing due right now</EmptyTitle>
              <EmptyDescription>
                You still have {totalCardCount} cards in the system, but none of
                them are ready for review at this moment.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              Add another card above or wait for the next due review.
            </EmptyContent>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
