import { IconCheck, IconRefresh } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import type { GeneratedFlashcardDraft } from "@/routes/_app/add-card/-model/add-card-types"

type AddCardPreviewSectionProps = {
  detailsVisible: boolean
  draft: GeneratedFlashcardDraft
  draftIsStale: boolean
  isGenerating: boolean
  isSaving: boolean
  onRegenerate: () => void
  onSave: () => void
  onToggleDetails: () => void
}

export function AddCardPreviewSection({
  detailsVisible,
  draft,
  draftIsStale,
  isGenerating,
  isSaving,
  onRegenerate,
  onSave,
  onToggleDetails,
}: AddCardPreviewSectionProps) {
  return (
    <Card className="border-border/70 bg-card/95 shadow-lg shadow-black/10">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline">
              {draft.expressionType === "word" ? "Word" : "Phrase"}
            </Badge>
            <CardTitle className="text-3xl leading-none">
              {draft.expression}
            </CardTitle>
            {draft.pronunciation ? (
              <CardDescription className="text-base text-muted-foreground">
                {draft.pronunciation}
              </CardDescription>
            ) : null}
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-primary/80">
              Translation
            </p>
            <p className="text-lg font-medium text-foreground">
              {draft.translation}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        {draftIsStale ? (
          <Alert variant="destructive">
            <AlertTitle>Preview is out of date</AlertTitle>
            <AlertDescription>
              The input changed after generation. Regenerate before saving so
              the card matches the latest text.
            </AlertDescription>
          </Alert>
        ) : null}

        <GeneratedExamples draft={draft} />

        {detailsVisible ? <GeneratedDetails draft={draft} /> : null}
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-3">
        <Button onClick={onToggleDetails} type="button" variant="ghost">
          {detailsVisible ? "Hide details" : "Show details"}
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button
            disabled={isGenerating || isSaving}
            onClick={onRegenerate}
            type="button"
            variant="outline"
          >
            {isGenerating ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <IconRefresh data-icon="inline-start" />
            )}
            Regenerate
          </Button>
          <Button
            disabled={draftIsStale || isSaving || isGenerating}
            onClick={onSave}
            type="button"
          >
            {isSaving ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <IconCheck data-icon="inline-start" />
            )}
            Save card
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

type GeneratedCardPreviewDraft = Pick<
  GeneratedFlashcardDraft,
  "examples" | "notes" | "partOfSpeech"
>

type DetailRowProps = {
  label: string
  value: string
}

function GeneratedExamples({ draft }: { draft: GeneratedCardPreviewDraft }) {
  return (
    <div className="grid gap-3">
      {draft.examples.map((example) => (
        <div
          key={`${example.targetText}-${example.baseText}`}
          className="rounded-2xl border border-border/70 bg-background/45 px-4 py-4"
        >
          <p className="text-sm font-medium text-foreground">
            {example.targetText}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {example.baseText}
          </p>
        </div>
      ))}
    </div>
  )
}

function GeneratedDetails({ draft }: { draft: GeneratedCardPreviewDraft }) {
  const hasExtraDetail = Boolean(draft.partOfSpeech || draft.notes)

  return (
    <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/45 px-4 py-4 text-sm">
      {draft.partOfSpeech ? (
        <DetailRow label="Part of speech" value={draft.partOfSpeech} />
      ) : null}
      {draft.notes ? <DetailRow label="Detail" value={draft.notes} /> : null}
      {!hasExtraDetail ? (
        <p className="text-muted-foreground">
          No extra detail was needed for this expression.
        </p>
      ) : null}
    </div>
  )
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="grid gap-1">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}
