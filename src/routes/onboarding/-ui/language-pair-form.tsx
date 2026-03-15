"use client"

import { useState } from "react"
import { IconArrowRight, IconLanguage, IconSparkles } from "@tabler/icons-react"
import { useForm } from "@tanstack/react-form"
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
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { saveViewerPreferences } from "@/routes/onboarding/-api/save-viewer-preferences"
import {
  formatLanguageLabel,
  type ViewerIdentity,
} from "@/routes/onboarding/-model/contracts"
import {
  getLanguageOption,
  getLanguageSearchLabel,
  languageCatalog,
} from "@/routes/onboarding/-model/languages"

type LanguagePairFormProps = {
  user: ViewerIdentity
}

export function LanguagePairForm({ user }: LanguagePairFormProps) {
  const submitPreferences = useServerFn(saveViewerPreferences)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      learningLanguageCode: "",
      baseLanguageCode: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      try {
        await submitPreferences({
          data: value,
        })
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Could not save your language pair."
        )
      }
    },
  })

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Set your language pair</CardTitle>
        <CardDescription>
          Hi {user.name.split(" ")[0] ?? user.name}. This is the only setup step
          for the MVP before we start building your learning flow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="language-pair-form"
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="learningLanguageCode"
              validators={{
                onChange: ({ value }) =>
                  value ? undefined : "Choose the language you want to learn.",
              }}
            >
              {(field) => {
                const selectedLanguage = getLanguageOption(field.state.value)
                const showError =
                  (field.state.meta.isTouched ||
                    form.state.submissionAttempts > 0) &&
                  field.state.meta.errors.length > 0

                return (
                  <Field data-invalid={showError || undefined}>
                    <FieldLabel htmlFor={field.name}>
                      Language you want to learn
                    </FieldLabel>
                    <Combobox
                      itemToStringLabel={getLanguageSearchLabel}
                      itemToStringValue={(item) => item.code}
                      items={languageCatalog}
                      onValueChange={(value) => {
                        field.handleChange(value?.code ?? "")
                      }}
                      value={selectedLanguage}
                    >
                      <ComboboxInput
                        aria-invalid={showError || undefined}
                        id={field.name}
                        name={field.name}
                        onBlur={() => field.handleBlur()}
                        placeholder="Choose a language"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No language found.</ComboboxEmpty>
                        <ComboboxList>
                          {(language) => (
                            <ComboboxItem key={language.code} value={language}>
                              <div className="flex min-w-0 flex-col">
                                <span>{language.name}</span>
                                <span className="text-muted-foreground">
                                  {formatLanguageLabel(language)}
                                </span>
                              </div>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldDescription>
                      Words, phrases, and examples will be generated in this
                      language first.
                    </FieldDescription>
                    {showError ? (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="baseLanguageCode"
              validators={{
                onChange: ({ value }) =>
                  value ? undefined : "Choose your base language.",
              }}
            >
              {(field) => {
                const selectedLanguage = getLanguageOption(field.state.value)
                const showError =
                  (field.state.meta.isTouched ||
                    form.state.submissionAttempts > 0) &&
                  field.state.meta.errors.length > 0

                return (
                  <Field data-invalid={showError || undefined}>
                    <FieldLabel htmlFor={field.name}>
                      Your base language
                    </FieldLabel>
                    <Combobox
                      itemToStringLabel={getLanguageSearchLabel}
                      itemToStringValue={(item) => item.code}
                      items={languageCatalog}
                      onValueChange={(value) => {
                        field.handleChange(value?.code ?? "")
                      }}
                      value={selectedLanguage}
                    >
                      <ComboboxInput
                        aria-invalid={showError || undefined}
                        id={field.name}
                        name={field.name}
                        onBlur={() => field.handleBlur()}
                        placeholder="Choose your base language"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No language found.</ComboboxEmpty>
                        <ComboboxList>
                          {(language) => (
                            <ComboboxItem key={language.code} value={language}>
                              <div className="flex min-w-0 flex-col">
                                <span>{language.name}</span>
                                <span className="text-muted-foreground">
                                  {formatLanguageLabel(language)}
                                </span>
                              </div>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldDescription>
                      This language will power translations and explanations in
                      the first version.
                    </FieldDescription>
                    {showError ? (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
        </form>

        {submitError ? (
          <Alert className="mt-6" variant="destructive">
            <IconSparkles />
            <AlertTitle>Could not save your onboarding</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
      <CardFooter className="justify-end">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isSubmitting}
              form="language-pair-form"
              type="submit"
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <IconLanguage data-icon="inline-start" />
              )}
              Continue
              <IconArrowRight data-icon="inline-end" />
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  )
}
