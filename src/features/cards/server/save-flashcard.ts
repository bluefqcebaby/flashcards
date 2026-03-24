import type { CreateFlashcardInput } from "@/features/cards/model/contracts"
import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"

type SaveFlashcardInput = CreateFlashcardInput & {
  userId: string
}

export async function saveFlashcard({
  userId,
  expression,
  expressionType,
  translation,
  examples,
  notes,
  pronunciation,
}: SaveFlashcardInput) {
  const now = new Date()
  const [savedCard] = await db
    .insert(flashcards)
    .values({
      id: crypto.randomUUID(),
      userId,
      expression,
      expressionType,
      translation,
      examples,
      notes: notes?.trim() || null,
      pronunciation: pronunciation?.trim() || null,
      dueAt: now,
      lastReviewedAt: null,
      reviewCount: 0,
      lapseCount: 0,
      intervalDays: 0,
      lastRating: null,
      updatedAt: now,
    })
    .returning({
      id: flashcards.id,
      expression: flashcards.expression,
    })

  return savedCard
}
