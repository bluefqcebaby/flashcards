import { createServerFn } from "@tanstack/react-start"
import { and, eq, ne } from "drizzle-orm"

import {
  type FlashcardDraftRecord,
  flashcardDrafts,
} from "@/features/cards/model/flashcard-draft-schema"
import { db } from "@/lib/server/db"
import { authMiddleware } from "@/lib/server/server-fn-middleware"
import { getFlashcardDraftById } from "@/routes/_app/add-card/-api/queries"
import {
  draftHasGeneratedCard,
  persistedFlashcardDraftSchema,
  runDraftGenerationInputSchema,
} from "@/routes/_app/add-card/-model/add-card-types"
import { generateFlashcardDraft } from "@/routes/_app/add-card/-server/generate-flashcard-draft"

async function getOwnedDraft(userId: string, draftId: string) {
  const [draft] = await db
    .select()
    .from(flashcardDrafts)
    .where(
      and(eq(flashcardDrafts.id, draftId), eq(flashcardDrafts.userId, userId))
    )
    .limit(1)

  return draft ?? null
}

async function getLatestDraftOrThrow(userId: string, draftId: string) {
  const latestDraft = await getFlashcardDraftById(userId, draftId)

  if (!latestDraft) {
    throw new Error("Draft not found after generation.")
  }

  return persistedFlashcardDraftSchema.parse(latestDraft)
}

async function markDraftPending(input: {
  draftId: string
  normalizedNotes: string | null
  pendingUpdatedAt: Date
  userId: string
}) {
  const [pendingDraft] = await db
    .update(flashcardDrafts)
    .set({
      status: "pending",
      regenerationNotes: input.normalizedNotes,
      errorMessage: null,
      updatedAt: input.pendingUpdatedAt,
    })
    .where(
      and(
        eq(flashcardDrafts.id, input.draftId),
        eq(flashcardDrafts.userId, input.userId),
        ne(flashcardDrafts.status, "saved")
      )
    )
    .returning({ id: flashcardDrafts.id })

  return Boolean(pendingDraft)
}

async function saveGeneratedDraft(input: {
  draftId: string
  generatedDraft: Awaited<ReturnType<typeof generateFlashcardDraft>>
  normalizedNotes: string | null
  pendingUpdatedAt: Date
  userId: string
}) {
  const [savedDraft] = await db
    .update(flashcardDrafts)
    .set({
      status: "ready",
      regenerationNotes: input.normalizedNotes,
      expression: input.generatedDraft.expression,
      expressionType: input.generatedDraft.expressionType,
      translation: input.generatedDraft.translation,
      examples: input.generatedDraft.examples,
      notes: input.generatedDraft.notes,
      pronunciation: input.generatedDraft.pronunciation,
      errorMessage: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(flashcardDrafts.id, input.draftId),
        eq(flashcardDrafts.userId, input.userId),
        eq(flashcardDrafts.updatedAt, input.pendingUpdatedAt)
      )
    )
    .returning()

  return savedDraft ? persistedFlashcardDraftSchema.parse(savedDraft) : null
}

async function saveFailedDraft(input: {
  draftId: string
  error: unknown
  existingDraft: FlashcardDraftRecord
  normalizedNotes: string | null
  pendingUpdatedAt: Date
  userId: string
}) {
  const hasPreviousResult = draftHasGeneratedCard(input.existingDraft)
  const [failedDraft] = await db
    .update(flashcardDrafts)
    .set({
      status: "failed",
      regenerationNotes: input.normalizedNotes,
      expression: hasPreviousResult ? input.existingDraft.expression : null,
      expressionType: hasPreviousResult
        ? input.existingDraft.expressionType
        : null,
      translation: hasPreviousResult ? input.existingDraft.translation : null,
      examples: hasPreviousResult ? input.existingDraft.examples : null,
      notes: hasPreviousResult ? input.existingDraft.notes : null,
      pronunciation: hasPreviousResult
        ? input.existingDraft.pronunciation
        : null,
      errorMessage:
        input.error instanceof Error
          ? input.error.message
          : "Could not generate this draft.",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(flashcardDrafts.id, input.draftId),
        eq(flashcardDrafts.userId, input.userId),
        eq(flashcardDrafts.updatedAt, input.pendingUpdatedAt)
      )
    )
    .returning()

  return failedDraft ? persistedFlashcardDraftSchema.parse(failedDraft) : null
}

export const runCardDraftGeneration = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(runDraftGenerationInputSchema)
  .handler(async ({ context, data }) => {
    const userId = context.session.user.id
    const normalizedNotes = data.regenerationNotes?.trim() || null
    const pendingUpdatedAt = new Date()
    const existingDraft = await getOwnedDraft(userId, data.draftId)

    if (!existingDraft) {
      throw new Error("Draft not found.")
    }

    const didMarkPending = await markDraftPending({
      draftId: data.draftId,
      normalizedNotes,
      pendingUpdatedAt,
      userId,
    })

    if (!didMarkPending) {
      return getLatestDraftOrThrow(userId, data.draftId)
    }

    try {
      const generatedDraft = await generateFlashcardDraft(userId, {
        inputMode: existingDraft.inputMode,
        regenerationNotes: normalizedNotes,
        seedExpression: existingDraft.seedExpression,
      })

      const savedDraft = await saveGeneratedDraft({
        draftId: data.draftId,
        generatedDraft,
        normalizedNotes,
        pendingUpdatedAt,
        userId,
      })

      if (savedDraft) {
        return savedDraft
      }

      return getLatestDraftOrThrow(userId, data.draftId)
    } catch (error) {
      const failedDraft = await saveFailedDraft({
        draftId: data.draftId,
        error,
        existingDraft,
        normalizedNotes,
        pendingUpdatedAt,
        userId,
      })

      if (failedDraft) {
        return failedDraft
      }

      return getLatestDraftOrThrow(userId, data.draftId)
    }
  })
