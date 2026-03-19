import { and, asc, eq, lte } from "drizzle-orm"

import { flashcards } from "@/features/cards/model/flashcard-schema"
import { db } from "@/lib/server/db"

export async function getCurrentStudyCard(userId: string, now: Date) {
  const [card] = await db
    .select()
    .from(flashcards)
    .where(and(eq(flashcards.userId, userId), lte(flashcards.dueAt, now)))
    .orderBy(asc(flashcards.dueAt), asc(flashcards.createdAt))
    .limit(1)

  return card ?? null
}

export async function getDueStudyCardCount(userId: string, now: Date) {
  const dueCards = await db
    .select({ id: flashcards.id })
    .from(flashcards)
    .where(and(eq(flashcards.userId, userId), lte(flashcards.dueAt, now)))

  return dueCards.length
}

export async function getTotalStudyCardCount(userId: string) {
  const cards = await db
    .select({ id: flashcards.id })
    .from(flashcards)
    .where(eq(flashcards.userId, userId))

  return cards.length
}

export async function getRandomStudyCards(userId: string) {
  return db
    .select()
    .from(flashcards)
    .where(eq(flashcards.userId, userId))
    .orderBy(asc(flashcards.createdAt), asc(flashcards.id))
}
