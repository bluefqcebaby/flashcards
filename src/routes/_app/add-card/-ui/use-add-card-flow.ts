import { useEffect, useEffectEvent, useRef, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useServerFn } from "@tanstack/react-start"

import { createCardDraft } from "@/routes/_app/add-card/-api/create-card-draft"
import { dismissCardDraft } from "@/routes/_app/add-card/-api/dismiss-card-draft"
import { getCardDraft } from "@/routes/_app/add-card/-api/get-card-draft"
import { runCardDraftGeneration } from "@/routes/_app/add-card/-api/run-card-draft-generation"
import { saveCardDraft } from "@/routes/_app/add-card/-api/save-card-draft"
import type {
  AddCardDraftListItem,
  AddCardInputMode,
  FlashcardDraftStatus,
  PersistedFlashcardDraft,
} from "@/routes/_app/add-card/-model/add-card-types"

type AddCardFlowOptions = {
  initialDrafts: PersistedFlashcardDraft[]
}

export type DraftListItem = AddCardDraftListItem

function sortDraftsByCreatedAt(drafts: DraftListItem[]) {
  return [...drafts].sort(
    (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
  )
}

function mergeDraftsFromServer(
  currentDrafts: DraftListItem[],
  incomingDrafts: PersistedFlashcardDraft[],
  knownServerDraftIds: Set<string>
) {
  const mergedDrafts = new Map<string, DraftListItem>()

  for (const incomingDraft of incomingDrafts) {
    knownServerDraftIds.add(incomingDraft.id)
    mergedDrafts.set(incomingDraft.id, incomingDraft)
  }

  for (const draft of currentDrafts) {
    if (mergedDrafts.has(draft.id)) {
      continue
    }

    if (draft.isOptimistic || !knownServerDraftIds.has(draft.id)) {
      mergedDrafts.set(draft.id, draft)
    }
  }

  return sortDraftsByCreatedAt([...mergedDrafts.values()])
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmedValue = value?.trim()

  return trimmedValue ? trimmedValue : null
}

function createOptimisticDraft(input: {
  inputMode: AddCardInputMode
  seedExpression: string
}): AddCardDraftListItem {
  const now = new Date()

  return {
    id: `optimistic-${crypto.randomUUID()}`,
    userId: null,
    status: "pending",
    seedExpression: input.seedExpression,
    inputMode: input.inputMode,
    regenerationNotes: null,
    expression: null,
    expressionType: null,
    translation: null,
    examples: null,
    notes: null,
    pronunciation: null,
    errorMessage: null,
    createdAt: now,
    updatedAt: now,
    isOptimistic: true,
  }
}

function replaceDraft(
  drafts: DraftListItem[],
  draftId: string,
  nextDraft: DraftListItem
) {
  return drafts.map((draft) => (draft.id === draftId ? nextDraft : draft))
}

function markDraftStatus(
  drafts: DraftListItem[],
  draftId: string,
  nextStatus: FlashcardDraftStatus,
  errorMessage: string | null,
  regenerationNotes: string | null
) {
  return drafts.map((draft) =>
    draft.id === draftId
      ? {
          ...draft,
          errorMessage,
          regenerationNotes,
          status: nextStatus,
        }
      : draft
  )
}

function markDraftGenerationFailure(
  drafts: DraftListItem[],
  draftId: string,
  errorMessage: string,
  regenerationNotes: string | null
) {
  return drafts.map((draft) => {
    if (draft.id !== draftId) {
      return draft
    }

    return {
      ...draft,
      errorMessage,
      regenerationNotes,
      status: "failed" as FlashcardDraftStatus,
    }
  })
}

export function useAddCardFlow({ initialDrafts }: AddCardFlowOptions) {
  const requestDraftCreation = useServerFn(createCardDraft)
  const requestDraftDismiss = useServerFn(dismissCardDraft)
  const requestDraft = useServerFn(getCardDraft)
  const requestDraftGeneration = useServerFn(runCardDraftGeneration)
  const requestDraftSave = useServerFn(saveCardDraft)
  const generationInFlightIdsRef = useRef(new Set<string>())
  const knownServerDraftIdsRef = useRef(
    new Set(initialDrafts.map((draft) => draft.id))
  )

  const [drafts, setDrafts] = useState<DraftListItem[]>(initialDrafts)
  const [isCreatingDraft, setIsCreatingDraft] = useState(false)
  const [dismissingDraftIds, setDismissingDraftIds] = useState<string[]>([])
  const [savingDraftIds, setSavingDraftIds] = useState<string[]>([])
  const [dismissError, setDismissError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      expression: "",
      inputMode: "learning" as AddCardInputMode,
    },
    onSubmit: async ({ value }) => {
      const seedExpression = value.expression.trim()
      const optimisticDraft = createOptimisticDraft({
        inputMode: value.inputMode,
        seedExpression,
      })

      setSubmitError(null)
      setDismissError(null)
      setSaveError(null)
      setSuccessMessage(null)
      setDrafts((currentDrafts) => [optimisticDraft, ...currentDrafts])
      form.setFieldValue("expression", "")
      setIsCreatingDraft(true)

      try {
        const createdDraft = await requestDraftCreation({
          data: {
            inputMode: value.inputMode,
            seedExpression,
          },
        })

        setDrafts((currentDrafts) =>
          replaceDraft(currentDrafts, optimisticDraft.id, createdDraft)
        )

        void syncDraftGeneration(createdDraft.id, null, false)
      } catch (error) {
        setDrafts((currentDrafts) =>
          currentDrafts.filter((draft) => draft.id !== optimisticDraft.id)
        )
        form.setFieldValue("expression", seedExpression)
        setSubmitError(
          error instanceof Error ? error.message : "Could not create the draft."
        )
      } finally {
        setIsCreatingDraft(false)
      }
    },
  })

  useEffect(() => {
    setDrafts((currentDrafts) =>
      mergeDraftsFromServer(
        currentDrafts,
        initialDrafts,
        knownServerDraftIdsRef.current
      )
    )
  }, [initialDrafts])

  const reconcileDraftFromServer = async (draftId: string) => {
    try {
      const latestDraft = await requestDraft({
        data: { draftId },
      })

      if (!latestDraft) {
        return null
      }

      setDrafts((currentDrafts) =>
        replaceDraft(currentDrafts, draftId, latestDraft)
      )

      return latestDraft
    } catch {
      return null
    }
  }

  const syncDraftGeneration = async (
    draftId: string,
    regenerationNotes: string | null,
    shouldMarkPending = true
  ) => {
    if (generationInFlightIdsRef.current.has(draftId)) {
      return null
    }

    const normalizedNotes = normalizeOptionalText(regenerationNotes)
    generationInFlightIdsRef.current.add(draftId)

    if (shouldMarkPending) {
      setDrafts((currentDrafts) =>
        markDraftStatus(
          currentDrafts,
          draftId,
          "pending",
          null,
          normalizedNotes
        )
      )
    }

    try {
      const nextDraft = await requestDraftGeneration({
        data: {
          draftId,
          regenerationNotes: normalizedNotes,
        },
      })

      setDrafts((currentDrafts) =>
        replaceDraft(currentDrafts, draftId, nextDraft)
      )
      return nextDraft
    } catch (error) {
      const latestDraft = await reconcileDraftFromServer(draftId)

      if (latestDraft) {
        return latestDraft
      }

      const errorMessage =
        error instanceof Error ? error.message : "Could not confirm this draft."

      setDrafts((currentDrafts) =>
        markDraftGenerationFailure(
          currentDrafts,
          draftId,
          errorMessage,
          normalizedNotes
        )
      )
      setSubmitError(errorMessage)

      return null
    } finally {
      generationInFlightIdsRef.current.delete(draftId)
    }
  }

  const resumePendingDraft = useEffectEvent(
    (draftId: string, regenerationNotes: string | null) => {
      const currentDraft = drafts.find((draft) => draft.id === draftId)

      if (!currentDraft || currentDraft.status !== "pending") {
        return
      }

      void syncDraftGeneration(draftId, regenerationNotes, false)
    }
  )

  useEffect(() => {
    const pendingDrafts = initialDrafts.filter(
      (draft) => draft.status === "pending"
    )

    if (!pendingDrafts.length) {
      return
    }

    for (const draft of pendingDrafts) {
      resumePendingDraft(draft.id, draft.regenerationNotes)
    }
  }, [initialDrafts])

  const clearFeedbackMessages = () => {
    setDismissError(null)
    setSubmitError(null)
    setSaveError(null)
    setSuccessMessage(null)
  }

  const handleDismissDraft = async (draftId: string) => {
    const dismissedDraft = drafts.find((draft) => draft.id === draftId) ?? null

    if (!dismissedDraft) {
      return
    }

    setDismissError(null)
    setSaveError(null)
    setSuccessMessage(null)
    setDismissingDraftIds((currentIds) => [...currentIds, draftId])
    setDrafts((currentDrafts) =>
      currentDrafts.filter((draft) => draft.id !== draftId)
    )

    try {
      if (dismissedDraft.isOptimistic) {
        return
      }

      await requestDraftDismiss({
        data: { draftId },
      })
    } catch (error) {
      setDrafts((currentDrafts) =>
        sortDraftsByCreatedAt([...currentDrafts, dismissedDraft])
      )
      setDismissError(
        error instanceof Error ? error.message : "Could not dismiss this draft."
      )
    } finally {
      setDismissingDraftIds((currentIds) =>
        currentIds.filter((id) => id !== draftId)
      )
    }
  }

  const handleSaveDraft = async (draftId: string) => {
    setDismissError(null)
    setSaveError(null)
    setSuccessMessage(null)
    setSavingDraftIds((currentIds) => [...currentIds, draftId])

    try {
      const savedCard = await requestDraftSave({
        data: { draftId },
      })

      setDrafts((currentDrafts) =>
        currentDrafts.filter((draft) => draft.id !== draftId)
      )
      setSuccessMessage(`Saved "${savedCard.expression}".`)
    } catch (error) {
      const latestDraft = await reconcileDraftFromServer(draftId)

      if (latestDraft?.status === "saved") {
        setDrafts((currentDrafts) =>
          currentDrafts.filter((draft) => draft.id !== draftId)
        )
        setSuccessMessage("Card saved.")
        return
      }

      setSaveError(
        error instanceof Error ? error.message : "Could not save this draft."
      )
    } finally {
      setSavingDraftIds((currentIds) =>
        currentIds.filter((id) => id !== draftId)
      )
    }
  }

  return {
    drafts,
    dismissError,
    dismissingDraftIds,
    form,
    isCreatingDraft,
    saveError,
    savingDraftIds,
    submitError,
    successMessage,
    clearFeedbackMessages,
    handleDismissDraft,
    handleGenerateDraft: syncDraftGeneration,
    handleSaveDraft,
  }
}

export type UseAddCardFlowResult = ReturnType<typeof useAddCardFlow>
