import { useEffect, useState } from "react"
import {
  IconArrowsShuffle,
  IconBooks,
  IconCards,
  IconCheck,
  IconPlayerTrackNext,
} from "@tabler/icons-react"

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
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"

type StudyRandomSectionProps = {
  randomCards: FlashcardRecord[]
}

export const StudyRandomSection = ({
  randomCards,
}: StudyRandomSectionProps) => {
  const [shuffledCards, setShuffledCards] = useState<FlashcardRecord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    setShuffledCards(shuffleCards(randomCards))
    setCurrentIndex(0)
    setIsRevealed(false)
  }, [randomCards])

  const currentCard = shuffledCards[currentIndex] ?? null
  const cardsRemaining = Math.max(shuffledCards.length - currentIndex - 1, 0)
  const isDeckComplete = shuffledCards.length > 0 && currentCard === null

  const handleShuffleAgain = () => {
    setShuffledCards(shuffleCards(randomCards))
    setCurrentIndex(0)
    setIsRevealed(false)
  }

  const handleNextCard = () => {
    setCurrentIndex((index) => index + 1)
    setIsRevealed(false)
  }

  return (
    <Card className="border-primary/20 bg-card/95">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <CardTitle>Random study</CardTitle>
            <CardDescription>
              Practice any card in a shuffled order, even when nothing is due
              for review.
            </CardDescription>
          </div>
          <Button
            disabled={randomCards.length < 2}
            onClick={handleShuffleAgain}
            type="button"
            variant="outline"
          >
            <IconArrowsShuffle data-icon="inline-start" />
            Shuffle again
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{randomCards.length} cards ready</Badge>
          {currentCard ? (
            <>
              <Badge variant="outline">
                {currentIndex + 1} / {shuffledCards.length}
              </Badge>
              <Badge variant="outline">{cardsRemaining} left</Badge>
            </>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        {randomCards.length === 0 ? (
          <RandomStudyEmptyState />
        ) : currentCard ? (
          <RandomStudyCardView
            card={currentCard}
            cardsRemaining={cardsRemaining}
            isRevealed={isRevealed}
            onNextCard={handleNextCard}
            onReveal={() => setIsRevealed(true)}
            onShuffleAgain={handleShuffleAgain}
          />
        ) : isDeckComplete ? (
          <RandomStudyCompleteState onShuffleAgain={handleShuffleAgain} />
        ) : null}
      </CardContent>
    </Card>
  )
}

type RandomStudyCardViewProps = {
  card: FlashcardRecord
  cardsRemaining: number
  isRevealed: boolean
  onNextCard: () => void
  onReveal: () => void
  onShuffleAgain: () => void
}

const RandomStudyCardView = ({
  card,
  cardsRemaining,
  isRevealed,
  onNextCard,
  onReveal,
  onShuffleAgain,
}: RandomStudyCardViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{card.expressionType}</Badge>
        {card.pronunciation ? (
          <Badge variant="outline">{card.pronunciation}</Badge>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/12 via-background/90 to-background p-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--color-primary)_18%,transparent)_0%,transparent_70%)] opacity-90" />
        <p className="relative text-3xl font-semibold tracking-tight">
          {card.expression}
        </p>
      </div>

      {!isRevealed ? (
        <Button className="w-fit" onClick={onReveal}>
          <IconBooks data-icon="inline-start" />
          Reveal answer
        </Button>
      ) : (
        <RandomStudyAnswerView
          card={card}
          cardsRemaining={cardsRemaining}
          onNextCard={onNextCard}
          onShuffleAgain={onShuffleAgain}
        />
      )}
    </div>
  )
}

type RandomStudyAnswerViewProps = {
  card: FlashcardRecord
  cardsRemaining: number
  onNextCard: () => void
  onShuffleAgain: () => void
}

const RandomStudyAnswerView = ({
  card,
  cardsRemaining,
  onNextCard,
  onShuffleAgain,
}: RandomStudyAnswerViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Translation
          </p>
          <p className="text-xl font-medium">{card.translation}</p>
          {card.notes ? (
            <p className="text-sm text-muted-foreground">{card.notes}</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Memory cue
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Say the expression out loud once, then try to recall the translation
            before moving on.
          </p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Examples</p>
        {card.examples.map((example) => (
          <div
            key={`${example.targetText}-${example.baseText}`}
            className="rounded-xl border border-border/60 bg-background/30 p-4"
          >
            <p className="font-medium">{example.targetText}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {example.baseText}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onNextCard} type="button">
          <IconPlayerTrackNext data-icon="inline-start" />
          {cardsRemaining > 0 ? "Next card" : "Finish this shuffle"}
        </Button>
        <Button onClick={onShuffleAgain} type="button" variant="outline">
          <IconArrowsShuffle data-icon="inline-start" />
          New random order
        </Button>
      </div>
    </div>
  )
}

const RandomStudyEmptyState = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCards />
        </EmptyMedia>
        <EmptyTitle>No cards to shuffle yet</EmptyTitle>
        <EmptyDescription>
          Add your first card above and this practice deck will be ready
          instantly.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

type RandomStudyCompleteStateProps = {
  onShuffleAgain: () => void
}

const RandomStudyCompleteState = ({
  onShuffleAgain,
}: RandomStudyCompleteStateProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCheck />
        </EmptyMedia>
        <EmptyTitle>Shuffle complete</EmptyTitle>
        <EmptyDescription>
          You went through the full random deck. Start a fresh shuffle any time
          for another quick study pass.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onShuffleAgain} type="button">
          <IconArrowsShuffle data-icon="inline-start" />
          Start another shuffle
        </Button>
      </EmptyContent>
    </Empty>
  )
}

const shuffleCards = (cards: FlashcardRecord[]) => {
  const nextCards = [...cards]

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentCard = nextCards[index]
    nextCards[index] = nextCards[randomIndex]
    nextCards[randomIndex] = currentCard
  }

  return nextCards
}
