import { useCallback, useEffect, useState } from "react"
import {
  IconArrowLeft,
  IconArrowsShuffle,
  IconCards,
  IconCheck,
  IconPlayerTrackNext,
} from "@tabler/icons-react"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"
import { getAllCards } from "@/routes/_app/study/-api/get-all-cards"
import { StudyFlashcard } from "@/routes/_app/study/-ui/study-flashcard"

// ─── Page ────────────────────────────────────────────────────────────────────

const ShufflePage = () => {
  const allCards = Route.useLoaderData()

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/study">
            <Button variant="ghost" size="icon-sm">
              <IconArrowLeft />
            </Button>
          </Link>
          <p className="text-xl font-semibold tracking-tight">Shuffle</p>
          <Badge variant="secondary">{allCards.length} cards</Badge>
        </div>
      </header>

      {allCards.length === 0 ? (
        <ShuffleEmpty />
      ) : (
        <ShuffleDeck cards={allCards} />
      )}
    </>
  )
}

// ─── Shuffle Deck ────────────────────────────────────────────────────────────

const ShuffleDeck = ({ cards }: { cards: FlashcardRecord[] }) => {
  const [shuffled, setShuffled] = useState(() => shuffleArray(cards))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  const currentCard = shuffled[currentIndex] ?? null
  const total = shuffled.length
  const isDone = currentIndex >= total

  const reshuffle = useCallback(() => {
    setShuffled(shuffleArray(cards))
    setCurrentIndex(0)
    setIsRevealed(false)
  }, [cards])

  const nextCard = useCallback(() => {
    setCurrentIndex((i) => i + 1)
    setIsRevealed(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFormElement(e.target as HTMLElement)) return

      if (e.key === " ") {
        e.preventDefault()
        handleSpaceKey(isDone, isRevealed, reshuffle, setIsRevealed, nextCard)
      } else if (e.key === "ArrowRight" && isRevealed) {
        nextCard()
      }
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isRevealed, isDone, nextCard, reshuffle])

  if (isDone) {
    return <ShuffleComplete onReshuffle={reshuffle} />
  }

  if (!currentCard) return null

  return (
    <div className="flex flex-1 flex-col">
      {/* Card area */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-4">
        {/* Progress */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {currentIndex + 1} / {total}
          </span>
        </div>

        <StudyFlashcard
          card={currentCard}
          isRevealed={isRevealed}
          onReveal={() => setIsRevealed(true)}
        />
      </div>

      {/* Sticky footer */}
      <div
        className={`sticky bottom-0 mt-auto border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur transition-opacity duration-200 ${
          isRevealed ? "opacity-100" : "pointer-events-none opacity-40"
        }`}
        aria-disabled={!isRevealed}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <Button disabled={!isRevealed} onClick={reshuffle} variant="outline">
            <IconArrowsShuffle data-icon="inline-start" />
            Reshuffle
          </Button>
          <Button disabled={!isRevealed} onClick={nextCard}>
            <IconPlayerTrackNext data-icon="inline-start" />
            {currentIndex + 1 < total ? "Next" : "Finish"}
            <kbd className="ml-1 hidden text-[10px] opacity-50 sm:inline">
              Space
            </kbd>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Empty / Complete ────────────────────────────────────────────────────────

const ShuffleEmpty = () => (
  <div className="flex flex-1 items-center justify-center py-12">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCards />
        </EmptyMedia>
        <EmptyTitle>No cards yet</EmptyTitle>
        <EmptyDescription>
          Create cards first, then come back to shuffle.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
)

const ShuffleComplete = ({ onReshuffle }: { onReshuffle: () => void }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCheck />
        </EmptyMedia>
        <EmptyTitle>Deck complete</EmptyTitle>
        <EmptyDescription>
          You went through all the cards. Shuffle again?
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onReshuffle}>
          <IconArrowsShuffle data-icon="inline-start" />
          Shuffle again
        </Button>
      </EmptyContent>
    </Empty>
  </div>
)

// ─── Pending ─────────────────────────────────────────────────────────────────

const ShufflePending = () => (
  <>
    <header className="flex items-center gap-3 border-b border-border/60 pb-4">
      <Skeleton className="size-8 rounded-md" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </header>
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-4">
      <Skeleton className="h-4 w-16" />
      <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-border/60 px-8 py-10">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
    </div>
    <div className="mt-auto border-t border-border/60 px-4 py-4 opacity-40">
      <div className="mx-auto flex max-w-xl justify-between gap-3">
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  </>
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const shuffleArray = (cards: FlashcardRecord[]) => {
  const arr = [...cards]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

// ─── Keyboard helpers ────────────────────────────────────────────────────────

const isFormElement = (el: HTMLElement) => {
  const tag = el?.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}

const handleSpaceKey = (
  isDone: boolean,
  isRevealed: boolean,
  reshuffle: () => void,
  setIsRevealed: (v: boolean) => void,
  nextCard: () => void
) => {
  if (isDone) {
    reshuffle()
  } else if (!isRevealed) {
    setIsRevealed(true)
  } else {
    nextCard()
  }
}

// ─── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/_app/study/shuffle")({
  loader: () => getAllCards(),
  pendingComponent: ShufflePending,
  pendingMs: 0,
  component: ShufflePage,
})
