import { IconSparkles } from "@tabler/icons-react"

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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { ViewerPreferences } from "@/features/viewer/model/contracts"
import type { AddCardInputMode } from "@/routes/_app/add-card/-model/add-card-types"
import type { UseAddCardFlowResult } from "@/routes/_app/add-card/-ui/use-add-card-flow"

type AddCardInputSectionProps = {
  clearFeedbackMessages: UseAddCardFlowResult["clearFeedbackMessages"]
  form: UseAddCardFlowResult["form"]
  isCreatingDraft: boolean
  preferences: ViewerPreferences
}

type InputModeCopy = {
  fieldLabel: string
  placeholder: string
}

function getInputModeCopy(
  inputMode: AddCardInputMode,
  preferences: ViewerPreferences
): InputModeCopy {
  if (inputMode === "base") {
    return {
      fieldLabel: "Meaning in any language",
      placeholder: "shopping bag, kassir, parque, receipt, park",
    }
  }

  return {
    fieldLabel: `Word or phrase in ${preferences.learningLanguageName}`,
    placeholder: "parki, gamarjoba, madloba",
  }
}

export function AddCardInputSection({
  clearFeedbackMessages,
  form,
  isCreatingDraft,
  preferences,
}: AddCardInputSectionProps) {
  const { inputMode } = form.state.values
  const copy = getInputModeCopy(inputMode, preferences)

  return (
    <Card className="border-primary/15 bg-card/90 shadow-lg shadow-black/10">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">AI creation</Badge>
        </div>
        <CardTitle className="text-2xl">New draft</CardTitle>
        <CardDescription>Add a word and keep going.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Input</FieldLegend>
              <form.Field name="inputMode">
                {(field) => (
                  <ToggleGroup
                    aria-label="Choose how to search for the draft"
                    className="w-full"
                    multiple={false}
                    onValueChange={(nextValue) => {
                      const [nextMode] = nextValue

                      if (!nextMode) {
                        return
                      }

                      field.handleChange(nextMode as AddCardInputMode)
                      clearFeedbackMessages()
                    }}
                    value={[field.state.value]}
                  >
                    <ToggleGroupItem className="flex-1" value="learning">
                      {preferences.learningLanguageName}
                    </ToggleGroupItem>
                    <ToggleGroupItem className="flex-1" value="base">
                      Any language
                    </ToggleGroupItem>
                  </ToggleGroup>
                )}
              </form.Field>
            </FieldSet>

            <form.Field
              name="expression"
              validators={{
                onSubmit: ({ value }) =>
                  value.trim()
                    ? undefined
                    : "Enter a word or phrase to generate a card.",
              }}
            >
              {(field) => {
                const showError =
                  (field.state.meta.isTouched ||
                    form.state.submissionAttempts > 0) &&
                  field.state.meta.errors.length > 0

                return (
                  <Field data-invalid={showError || undefined}>
                    <FieldLabel htmlFor={field.name}>
                      {copy.fieldLabel}
                    </FieldLabel>
                    <Input
                      aria-invalid={showError || undefined}
                      className="h-12 text-base"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.target.value)
                        clearFeedbackMessages()
                      }}
                      placeholder={copy.placeholder}
                      value={field.state.value}
                    />
                    {showError ? (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <Button
            className="h-12 w-full justify-center"
            disabled={isCreatingDraft}
            type="submit"
          >
            {isCreatingDraft ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <IconSparkles data-icon="inline-start" />
            )}
            Add draft
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
