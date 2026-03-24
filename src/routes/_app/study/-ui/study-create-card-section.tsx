import { IconAlertCircle, IconSparkles } from "@tabler/icons-react"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { createStudyCard } from "@/routes/_app/study/-api/create-study-card"
import {
  expressionTypeOptions,
  studyCardFormDefaults,
} from "@/routes/_app/study/-model/study-types"

export const StudyCreateCardSection = () => {
  const form = useStudyCardForm()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build a card and study it right away</CardTitle>
        <CardDescription>
          Add a card manually, then review it in the simplest reveal flow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="study-card-form"
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <StudyInputField
              form={form}
              label="Expression"
              name="expression"
              placeholder="quiero aprender"
              requiredMessage="Add the word or phrase you want to study."
            />

            <form.Field name="expressionType">
              {(field) => (
                <FieldSet>
                  <FieldLegend>Card type</FieldLegend>
                  <div className="flex flex-wrap gap-2">
                    {expressionTypeOptions.map((option) => (
                      <Button
                        key={option.value}
                        onClick={() => field.handleChange(option.value)}
                        type="button"
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
                  <FieldDescription>
                    Is this mainly one word or a short phrase?
                  </FieldDescription>
                </FieldSet>
              )}
            </form.Field>

            <StudyInputField
              form={form}
              label="Translation"
              name="translation"
              placeholder="I want to learn"
              requiredMessage="Add the main translation."
            />

            <Separator />

            <div className="grid gap-4 lg:grid-cols-2">
              <StudyExampleFields
                baseFieldName="exampleOneBase"
                form={form}
                targetFieldName="exampleOneTarget"
                title="Example 1"
              />
              <StudyExampleFields
                baseFieldName="exampleTwoBase"
                form={form}
                targetFieldName="exampleTwoTarget"
                title="Example 2"
              />
            </div>

            <Separator />

            <StudyInputField
              form={form}
              label="Pronunciation"
              name="pronunciation"
              placeholder="keh-roh ah-pren-dehr"
            />
            <StudyTextareaField
              form={form}
              label="Notes"
              name="notes"
              placeholder="Used for stating an intention."
            />
          </FieldGroup>
        </form>

        <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
          {(submitError) =>
            submitError ? (
              <Alert className="mt-6" variant="destructive">
                <IconAlertCircle />
                <AlertTitle>Could not add the card</AlertTitle>
                <AlertDescription>{String(submitError)}</AlertDescription>
              </Alert>
            ) : null
          }
        </form.Subscribe>
      </CardContent>
      <CardFooter className="justify-end">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isSubmitting}
              form="study-card-form"
              type="submit"
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <IconSparkles data-icon="inline-start" />
              )}
              Add card
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  )
}

const useStudyCardForm = () => {
  const router = useRouter()
  const submitCard = useServerFn(createStudyCard)

  return useForm({
    defaultValues: studyCardFormDefaults,
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await submitCard({
            data: {
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
              notes: value.notes,
              pronunciation: value.pronunciation,
            },
          })

          return undefined
        } catch (error) {
          return error instanceof Error
            ? error.message
            : "Could not add the card."
        }
      },
    },
    onSubmit: async ({ formApi }) => {
      formApi.reset()
      await router.invalidate()
    },
  })
}

type StudyCardFormApi = ReturnType<typeof useStudyCardForm>

type StudyExampleFieldsProps = {
  baseFieldName: "exampleOneBase" | "exampleTwoBase"
  form: StudyCardFormApi
  targetFieldName: "exampleOneTarget" | "exampleTwoTarget"
  title: string
}

const StudyExampleFields = ({
  baseFieldName,
  form,
  targetFieldName,
  title,
}: StudyExampleFieldsProps) => {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          One example in the learning language and one matching translation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <StudyTextareaField
            form={form}
            label="Learning language"
            name={targetFieldName}
            placeholder="Ella practica todos los dias."
            requiredMessage="Add the example in the learning language."
          />
          <StudyTextareaField
            form={form}
            label="Base language"
            name={baseFieldName}
            placeholder="She practices every day."
            requiredMessage="Add the example translation."
          />
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

type StudyInputFieldProps = {
  form: StudyCardFormApi
  label: string
  name: "expression" | "translation" | "pronunciation"
  placeholder: string
  requiredMessage?: string
}

const StudyInputField = ({
  form,
  label,
  name,
  placeholder,
  requiredMessage,
}: StudyInputFieldProps) => {
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
              placeholder={placeholder}
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

type StudyTextareaFieldProps = {
  form: StudyCardFormApi
  label: string
  name:
    | "exampleOneTarget"
    | "exampleOneBase"
    | "exampleTwoTarget"
    | "exampleTwoBase"
    | "notes"
  placeholder: string
  requiredMessage?: string
}

const StudyTextareaField = ({
  form,
  label,
  name,
  placeholder,
  requiredMessage,
}: StudyTextareaFieldProps) => {
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
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder={placeholder}
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
  if (!requiredMessage) {
    return undefined
  }

  return {
    onChange: ({ value }: { value: string }) =>
      value.trim() ? undefined : requiredMessage,
  }
}
