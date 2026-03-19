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
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { ViewerPreferences } from "@/features/viewer/model/contracts"
import { formatLanguagePair } from "@/features/viewer/model/contracts"
import type { UseAddCardFlowResult } from "@/routes/_app/add-card/-ui/use-add-card-flow"

type AddCardInputSectionProps = {
  clearFeedbackMessages: UseAddCardFlowResult["clearFeedbackMessages"]
  form: UseAddCardFlowResult["form"]
  isGenerating: boolean
  isSaving: boolean
  preferences: ViewerPreferences
}

export function AddCardInputSection({
  clearFeedbackMessages,
  form,
  isGenerating,
  isSaving,
  preferences,
}: AddCardInputSectionProps) {
  return (
    <Card className="border-primary/15 bg-card/90 shadow-lg shadow-black/10">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">AI creation</Badge>
          <span className="text-sm text-muted-foreground">
            {formatLanguagePair(preferences)}
          </span>
        </div>
        <CardTitle className="text-2xl">
          Add one expression, let AI build the card
        </CardTitle>
        <CardDescription>
          Enter one word or phrase. The app will normalize it, translate it, add
          pronunciation, and prepare two short examples before you save.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
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
                  <FieldLabel htmlFor={field.name}>Word or phrase</FieldLabel>
                  <div className="flex flex-col gap-3 sm:flex-row">
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
                      placeholder="გამარჯობა, quiero aprender, bonjour"
                      value={field.state.value}
                    />
                    <Button
                      className="h-12 px-6"
                      disabled={isGenerating || isSaving}
                      type="submit"
                    >
                      {isGenerating ? (
                        <Spinner data-icon="inline-start" />
                      ) : (
                        <IconSparkles data-icon="inline-start" />
                      )}
                      Generate
                    </Button>
                  </div>
                  <FieldDescription>
                    Hidden context: {preferences.learningLanguageName} into{" "}
                    {preferences.baseLanguageName}.
                  </FieldDescription>
                  {showError ? (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  ) : null}
                </Field>
              )
            }}
          </form.Field>
        </form>
      </CardContent>
    </Card>
  )
}
