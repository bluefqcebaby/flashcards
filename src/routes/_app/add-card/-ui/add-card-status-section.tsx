import { IconCheck } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AddCardStatusSectionProps = {
  dismissError: string | null
  generationError: string | null
  saveError: string | null
  successMessage: string | null
}

export function AddCardStatusSection({
  dismissError,
  generationError,
  saveError,
  successMessage,
}: AddCardStatusSectionProps) {
  if (!(dismissError || generationError || saveError || successMessage)) {
    return null
  }

  return (
    <div className="grid gap-4">
      {dismissError ? (
        <Alert variant="destructive">
          <AlertTitle>Dismiss failed</AlertTitle>
          <AlertDescription>{dismissError}</AlertDescription>
        </Alert>
      ) : null}

      {generationError ? (
        <Alert variant="destructive">
          <AlertTitle>Generation failed</AlertTitle>
          <AlertDescription>{generationError}</AlertDescription>
        </Alert>
      ) : null}

      {saveError ? (
        <Alert variant="destructive">
          <AlertTitle>Save failed</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-50">
          <IconCheck />
          <AlertTitle>Card saved</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
