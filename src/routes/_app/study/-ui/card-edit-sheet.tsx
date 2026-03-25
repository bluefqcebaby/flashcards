import { useState } from "react"
import { IconAlertCircle, IconTrash } from "@tabler/icons-react"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"
import { deleteCard } from "@/routes/_app/study/-api/delete-card"
import { updateCard } from "@/routes/_app/study/-api/update-card"
import { expressionTypeOptions } from "@/routes/_app/study/-model/study-types"

type CardEditSheetProps = {
  card: FlashcardRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CardEditSheet = ({
  card,
  open,
  onOpenChange,
}: CardEditSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto data-[side=right]:sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit card</SheetTitle>
          <SheetDescription className="sr-only">
            Edit flashcard details
          </SheetDescription>
        </SheetHeader>
        {card ? (
          <CardEditForm
            key={card.id}
            card={card}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

type CardEditFormProps = {
  card: FlashcardRecord
  onClose: () => void
}

const useCardEditForm = (card: FlashcardRecord, onClose: () => void) => {
  const router = useRouter()
  const submitUpdate = useServerFn(updateCard)

  return useForm({
    defaultValues: {
      expression: card.expression,
      expressionType: card.expressionType,
      translation: card.translation,
      exampleOneTarget: card.examples[0]?.targetText ?? "",
      exampleOneBase: card.examples[0]?.baseText ?? "",
      exampleTwoTarget: card.examples[1]?.targetText ?? "",
      exampleTwoBase: card.examples[1]?.baseText ?? "",
      notes: card.notes ?? "",
      pronunciation: card.pronunciation ?? "",
    },
    validators: {
      onSubmitAsync: async ({ value, formApi }) => {
        if (!formApi.state.isDirty) return undefined

        try {
          await submitUpdate({
            data: {
              id: card.id,
              expression: value.expression,
              expressionType: value.expressionType,
              translation: value.translation,
              examples: [
                {
                  targetText: value.exampleOneTarget,
                  baseText: value.exampleOneBase,
                },
                {
                  targetText: value.exampleTwoTarget,
                  baseText: value.exampleTwoBase,
                },
              ],
              notes: value.notes || undefined,
              pronunciation: value.pronunciation || undefined,
            },
          })

          return undefined
        } catch (error) {
          return error instanceof Error
            ? error.message
            : "Could not update the card."
        }
      },
    },
    onSubmit: async ({ formApi }) => {
      if (formApi.state.isDirty) {
        await router.invalidate()
      }
      onClose()
    },
  })
}

type EditFormApi = ReturnType<typeof useCardEditForm>

const CardEditForm = ({ card, onClose }: CardEditFormProps) => {
  const router = useRouter()
  const submitDelete = useServerFn(deleteCard)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const form = useCardEditForm(card, onClose)

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      await submitDelete({ data: { id: card.id } })
      await router.invalidate()
      onClose()
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete the card."
      )
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4">
        <form
          id="card-edit-form"
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <EditInputField
              form={form}
              label="Expression"
              name="expression"
              requiredMessage="Add the word or phrase."
            />

            <form.Field name="expressionType">
              {(field) => (
                <FieldSet>
                  <FieldLegend>Type</FieldLegend>
                  <div className="flex flex-wrap gap-2">
                    {expressionTypeOptions.map((option) => (
                      <Button
                        key={option.value}
                        onClick={() => field.handleChange(option.value)}
                        type="button"
                        size="sm"
                        variant={
                          field.state.value === option.value
                            ? "default"
                            : "outline"
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </FieldSet>
              )}
            </form.Field>

            <EditInputField
              form={form}
              label="Translation"
              name="translation"
              requiredMessage="Add the main translation."
            />

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Example 1</p>
                <EditTextareaField
                  form={form}
                  label="Learning language"
                  name="exampleOneTarget"
                  requiredMessage="Add the example."
                />
                <EditTextareaField
                  form={form}
                  label="Base language"
                  name="exampleOneBase"
                  requiredMessage="Add the translation."
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Example 2</p>
                <EditTextareaField
                  form={form}
                  label="Learning language"
                  name="exampleTwoTarget"
                  requiredMessage="Add the example."
                />
                <EditTextareaField
                  form={form}
                  label="Base language"
                  name="exampleTwoBase"
                  requiredMessage="Add the translation."
                />
              </div>
            </div>

            <Separator />

            <EditInputField
              form={form}
              label="Pronunciation"
              name="pronunciation"
            />
            <EditTextareaField form={form} label="Notes" name="notes" />
          </FieldGroup>
        </form>

        <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
          {(submitError) =>
            submitError ? (
              <Alert className="mt-4" variant="destructive">
                <IconAlertCircle />
                <AlertTitle>Could not save</AlertTitle>
                <AlertDescription>{String(submitError)}</AlertDescription>
              </Alert>
            ) : null
          }
        </form.Subscribe>

        {deleteError ? (
          <Alert className="mt-4" variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Could not delete</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        ) : null}
      </div>

      <SheetFooter className="flex-row justify-between border-t pt-4">
        <Button
          disabled={isDeleting}
          onClick={() => setShowDeleteConfirm(true)}
          size="sm"
          type="button"
          variant="destructive"
        >
          <IconTrash data-icon="inline-start" />
          Delete
        </Button>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isSubmitting}
              form="card-edit-form"
              size="sm"
              type="submit"
            >
              {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
              Save
            </Button>
          )}
        </form.Subscribe>
      </SheetFooter>

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete this card?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}

type EditInputFieldProps = {
  form: EditFormApi
  label: string
  name: "expression" | "translation" | "pronunciation"
  requiredMessage?: string
}

const EditInputField = ({
  form,
  label,
  name,
  requiredMessage,
}: EditInputFieldProps) => {
  return (
    <form.Field name={name} validators={getRequiredValidator(requiredMessage)}>
      {(field) => {
        const showError =
          (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
          field.state.meta.errors.length > 0

        return (
          <Field data-invalid={showError || undefined}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Input
              aria-invalid={showError || undefined}
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              value={field.state.value}
            />
            {showError ? (
              <FieldError>{field.state.meta.errors[0]}</FieldError>
            ) : null}
          </Field>
        )
      }}
    </form.Field>
  )
}

type EditTextareaFieldProps = {
  form: EditFormApi
  label: string
  name:
    | "exampleOneTarget"
    | "exampleOneBase"
    | "exampleTwoTarget"
    | "exampleTwoBase"
    | "notes"
  requiredMessage?: string
}

const EditTextareaField = ({
  form,
  label,
  name,
  requiredMessage,
}: EditTextareaFieldProps) => {
  return (
    <form.Field name={name} validators={getRequiredValidator(requiredMessage)}>
      {(field) => {
        const showError =
          (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
          field.state.meta.errors.length > 0

        return (
          <Field data-invalid={showError || undefined}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Textarea
              aria-invalid={showError || undefined}
              className="resize-none"
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              rows={2}
              value={field.state.value}
            />
            {showError ? (
              <FieldError>{field.state.meta.errors[0]}</FieldError>
            ) : null}
          </Field>
        )
      }}
    </form.Field>
  )
}

const getRequiredValidator = (requiredMessage?: string) => {
  if (!requiredMessage) return undefined

  return {
    onChange: ({ value }: { value: string }) =>
      value.trim() ? undefined : requiredMessage,
  }
}
