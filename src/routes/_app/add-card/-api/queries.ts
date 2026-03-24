import { and, desc, eq, lt, ne } from "drizzle-orm"

import { flashcardDrafts } from "@/features/cards/model/flashcard-draft-schema"
import { db } from "@/lib/server/db"

const STALE_PENDING_DRAFT_MS = 90_000
const STALE_PENDING_DRAFT_MESSAGE = "Generation timed out. Try regenerate."

const draftSelection = {
  id: flashcardDrafts.id,
  userId: flashcardDrafts.userId,
  status: flashcardDrafts.status,
  seedExpression: flashcardDrafts.seedExpression,
  inputMode: flashcardDrafts.inputMode,
  regenerationNotes: flashcardDrafts.regenerationNotes,
  expression: flashcardDrafts.expression,
  expressionType: flashcardDrafts.expressionType,
  translation: flashcardDrafts.translation,
  examples: flashcardDrafts.examples,
  notes: flashcardDrafts.notes,
  pronunciation: flashcardDrafts.pronunciation,
  errorMessage: flashcardDrafts.errorMessage,
  createdAt: flashcardDrafts.createdAt,
  updatedAt: flashcardDrafts.updatedAt,
} as const

async function recoverStalePendingDrafts(userId: string) {
  const staleBefore = new Date(Date.now() - STALE_PENDING_DRAFT_MS)

  await db
    .update(flashcardDrafts)
    .set({
      status: "failed",
      errorMessage: STALE_PENDING_DRAFT_MESSAGE,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(flashcardDrafts.userId, userId),
        eq(flashcardDrafts.status, "pending"),
        lt(flashcardDrafts.updatedAt, staleBefore)
      )
    )
}

export async function getActiveFlashcardDrafts(userId: string) {
  await recoverStalePendingDrafts(userId)

  return db
    .select(draftSelection)
    .from(flashcardDrafts)
    .where(
      and(
        eq(flashcardDrafts.userId, userId),
        ne(flashcardDrafts.status, "saved")
      )
    )
    .orderBy(desc(flashcardDrafts.createdAt))
}

export async function getFlashcardDraftById(userId: string, draftId: string) {
  await recoverStalePendingDrafts(userId)

  const [draft] = await db
    .select(draftSelection)
    .from(flashcardDrafts)
    .where(
      and(eq(flashcardDrafts.userId, userId), eq(flashcardDrafts.id, draftId))
    )
    .limit(1)

  return draft ?? null
}
