import { useState, useTransition } from "react"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import { generateCardDraft } from "@/routes/_app/add-card/-api/generate-card-draft"
import { saveGeneratedCard } from "@/routes/_app/add-card/-api/save-generated-card"
import type { GeneratedFlashcardDraft } from "@/routes/_app/add-card/-model/add-card-types"

export function useAddCardFlow() {
  const router = useRouter()
  const requestDraft = useServerFn(generateCardDraft)
  const submitDraft = useServerFn(saveGeneratedCard)

  const [draft, setDraft] = useState<GeneratedFlashcardDraft | null>(null)
  const [draftSource, setDraftSource] = useState("")
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isGenerating, startGenerating] = useTransition()
  const [isSaving, startSaving] = useTransition()

  const form = useForm({
    defaultValues: {
      expression: "",
    },
    onSubmit: async ({ value }) => {
      const seedExpression = value.expression.trim()

      setGenerationError(null)
      setSaveError(null)
      setSuccessMessage(null)

      startGenerating(async () => {
        try {
          const nextDraft = await requestDraft({
            data: {
              seedExpression,
            },
          })

          setDraft(nextDraft)
          setDraftSource(seedExpression)
          setDetailsVisible(false)
        } catch (error) {
          setDraft(null)
          setDraftSource("")
          setGenerationError(
            error instanceof Error
              ? error.message
              : "Could not generate the flashcard."
          )
        }
      })
    },
  })

  const expressionMeta = form.getFieldMeta("expression")
  const showExpressionError = Boolean(
    (expressionMeta?.isTouched || form.state.submissionAttempts > 0) &&
      expressionMeta?.errors.length
  )
  const expressionError = showExpressionError
    ? String(expressionMeta?.errors[0])
    : null

  const currentExpression = form.state.values.expression.trim()
  const draftIsStale = Boolean(draft && draftSource !== currentExpression)

  const clearFeedbackMessages = () => {
    setSaveError(null)
    setSuccessMessage(null)
  }

  const handleGenerate = async () => {
    await form.handleSubmit()
  }

  const handleSave = () => {
    if (!draft || draftIsStale) {
      return
    }

    setSaveError(null)
    setSuccessMessage(null)

    startSaving(async () => {
      try {
        const savedCard = await submitDraft({
          data: draft,
        })

        form.reset()
        setDraft(null)
        setDraftSource("")
        setDetailsVisible(false)
        setGenerationError(null)
        setSuccessMessage(`Saved "${savedCard.expression}" to your study deck.`)

        await router.invalidate()
      } catch (error) {
        setSaveError(
          error instanceof Error ? error.message : "Could not save the card."
        )
      }
    })
  }

  return {
    form,
    draft,
    draftIsStale,
    detailsVisible,
    expression: form.state.values.expression,
    expressionError,
    generationError,
    isGenerating,
    isSaving,
    saveError,
    successMessage,
    clearFeedbackMessages,
    handleGenerate,
    handleSave,
    toggleDetails: () => setDetailsVisible((current) => !current),
  }
}

export type UseAddCardFlowResult = ReturnType<typeof useAddCardFlow>
