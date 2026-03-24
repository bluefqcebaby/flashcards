import { useEffect, useState } from "react"
import {
  IconCheck,
  IconChevronDown,
  IconRefresh,
  IconSparkles,
  IconX,
} from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { ViewerPreferences } from "@/features/viewer/model/contracts"
import { cn } from "@/lib/utils"
import {
  type AddCardDraftListItem,
  draftHasGeneratedCard,
} from "@/routes/_app/add-card/-model/add-card-types"

type AddCardPreviewSectionProps = {
  drafts: AddCardDraftListItem[]
  dismissingDraftIds: string[]
  onDismissDraft: (draftId: string) => Promise<unknown>
  onGenerateDraft: (
    draftId: string,
    regenerationNotes: string | null
  ) => Promise<unknown>
  onSaveDraft: (draftId: string) => Promise<unknown>
  preferences: ViewerPreferences
  savingDraftIds: string[]
}

function getInputModeLabel(
  draft: AddCardDraftListItem,
  preferences: ViewerPreferences
) {
  return draft.inputMode === "base"
    ? "Any language"
    : preferences.learningLanguageName
}

function buildMiniExplanation(draft: AddCardDraftListItem) {
  if (draft.notes) {
    return draft.notes
  }

  return draft.pronunciation ?? ""
}

function buildSummaryLine(draft: AddCardDraftListItem) {
  if (draft.status === "pending") {
    return "Generating draft..."
  }

  if (draft.errorMessage) {
    return draft.errorMessage
  }

  return buildMiniExplanation(draft) || "Tap to view examples and details"
}

function isDetailRow(
  value: {
    label: string
    value: string
  } | null
): value is {
  label: string
  value: string
} {
  return value !== null
}

export function AddCardPreviewSection({
  drafts,
  dismissingDraftIds,
  onDismissDraft,
  onGenerateDraft,
  onSaveDraft,
  preferences,
  savingDraftIds,
}: AddCardPreviewSectionProps) {
  if (!drafts.length) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <Card className="border-border/70 bg-card/90 shadow-lg shadow-black/10">
          <CardContent className="p-0">
            <Empty className="border-0 p-8 sm:p-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconSparkles />
                </EmptyMedia>
                <EmptyTitle>Drafts will appear here</EmptyTitle>
                <EmptyDescription>
                  Add a word or meaning on the left.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain pr-2 p-1">
        {drafts.map((draft) => (
          <DraftCard
            draft={draft}
            isDismissing={dismissingDraftIds.includes(draft.id)}
            isSaving={savingDraftIds.includes(draft.id)}
            key={draft.id}
            onDismissDraft={onDismissDraft}
            onGenerateDraft={onGenerateDraft}
            onSaveDraft={onSaveDraft}
            preferences={preferences}
          />
        ))}
      </div>
    </div>
  )
}

function DraftCard({
  draft,
  isDismissing,
  isSaving,
  onDismissDraft,
  onGenerateDraft,
  onSaveDraft,
  preferences,
}: {
  draft: AddCardDraftListItem
  isDismissing: boolean
  isSaving: boolean
  onDismissDraft: AddCardPreviewSectionProps["onDismissDraft"]
  onGenerateDraft: AddCardPreviewSectionProps["onGenerateDraft"]
  onSaveDraft: AddCardPreviewSectionProps["onSaveDraft"]
  preferences: ViewerPreferences
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [regenerationNotes, setRegenerationNotes] = useState(
    draft.regenerationNotes ?? ""
  )

  useEffect(() => {
    setRegenerationNotes(draft.regenerationNotes ?? "")
  }, [draft.regenerationNotes])

  useEffect(() => {
    if (draft.status === "failed") {
      setIsOpen(true)
    }
  }, [draft.status])

  const isPending = draft.status === "pending"
  const hasGeneratedCard = draftHasGeneratedCard(draft)
  const canSave = hasGeneratedCard && !isPending
  const showRegenerationInput = draft.status === "failed" || hasGeneratedCard
  const summaryLabel = buildSummaryLine(draft)

  return (
    <Collapsible onOpenChange={setIsOpen} open={isOpen}>
      <Card
        className="group/draft gap-0 overflow-hidden border-border/70 bg-card/95 py-0 shadow-sm shadow-black/5"
        size="sm"
      >
        <div className="relative p-px">
          <CollapsibleTrigger className="block w-full text-left">
            <CardContent className="rounded-[11px] px-4 py-3 pr-14 pb-12">
              <div className="flex items-start gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="h-5 px-2 text-[10px]" variant="secondary">
                      {getInputModeLabel(draft, preferences)}
                    </Badge>
                    <Badge className="h-5 px-2 text-[10px]" variant="outline">
                      {formatDraftStatus(draft.status)}
                    </Badge>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {hasGeneratedCard
                        ? draft.expression
                        : draft.seedExpression}
                    </p>
                    {hasGeneratedCard ? (
                      <>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          →
                        </span>
                        <p className="truncate text-sm font-medium text-primary">
                          {draft.translation}
                        </p>
                      </>
                    ) : null}
                  </div>

                  <p className="truncate text-xs text-muted-foreground">
                    {summaryLabel}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 pt-0.5">
                  {isPending ? (
                    <Spinner className="size-4 text-muted-foreground" />
                  ) : null}
                  <IconChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleTrigger>

          {!isOpen ? (
            <DraftCardSummaryActions
              canSave={canSave}
              draftId={draft.id}
              isDismissing={isDismissing}
              isPending={isPending}
              isSaving={isSaving}
              onDismissDraft={onDismissDraft}
              onSaveDraft={onSaveDraft}
            />
          ) : null}
        </div>

        <CollapsibleContent className="border-t border-border/60">
          <CardContent className="flex flex-col gap-4 px-4 py-4">
            {draft.errorMessage ? (
              <Alert variant="destructive">
                <AlertTitle>Generation failed</AlertTitle>
                <AlertDescription>{draft.errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {isPending ? <DraftPendingState draft={draft} /> : null}

            {hasGeneratedCard ? <ExpandedDraftDetails draft={draft} /> : null}

            <DraftCardActions
              canSave={canSave}
              draftId={draft.id}
              isDismissing={isDismissing}
              isPending={isPending}
              isSaving={isSaving}
              onDismissDraft={onDismissDraft}
              onGenerateDraft={onGenerateDraft}
              onSaveDraft={onSaveDraft}
              onUpdateRegenerationNotes={setRegenerationNotes}
              regenerationNotes={regenerationNotes}
              showRegenerationInput={showRegenerationInput}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

function DraftCardSummaryActions({
  canSave,
  draftId,
  isDismissing,
  isPending,
  isSaving,
  onDismissDraft,
  onSaveDraft,
}: {
  canSave: boolean
  draftId: string
  isDismissing: boolean
  isPending: boolean
  isSaving: boolean
  onDismissDraft: AddCardPreviewSectionProps["onDismissDraft"]
  onSaveDraft: AddCardPreviewSectionProps["onSaveDraft"]
}) {
  return (
    <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-md border border-border/70 bg-card/95 p-1 opacity-0 shadow-sm transition-opacity duration-150 group-hover/draft:opacity-100 group-focus-within/draft:opacity-100">
      {canSave ? (
        <Button
          aria-label="Save card"
          disabled={isDismissing || isPending || isSaving}
          onClick={() => void onSaveDraft(draftId)}
          size="icon-xs"
          title="Save card"
          type="button"
        >
          {isSaving ? <Spinner /> : <IconCheck />}
        </Button>
      ) : null}
      <Button
        aria-label="Dismiss draft"
        disabled={isDismissing || isSaving}
        onClick={() => void onDismissDraft(draftId)}
        size="icon-xs"
        title="Dismiss draft"
        type="button"
        variant="ghost"
      >
        {isDismissing ? <Spinner /> : <IconX />}
      </Button>
    </div>
  )
}

function ExpandedDraftDetails({
  draft,
}: {
  draft: AddCardDraftListItem & {
    examples: NonNullable<AddCardDraftListItem["examples"]>
  }
}) {
  const detailRows = [
    draft.pronunciation
      ? { label: "Pronunciation", value: draft.pronunciation }
      : null,
    draft.notes ? { label: "Usage", value: draft.notes } : null,
  ].filter(isDetailRow)

  return (
    <div className="grid gap-4">
      <section className="grid gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Examples
        </p>
        {draft.examples.map((example) => (
          <div
            className="rounded-lg border border-border/70 bg-background/45 px-3 py-2.5"
            key={`${example.targetText}-${example.baseText}`}
          >
            <p className="text-sm font-medium text-foreground">
              {example.targetText}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {example.baseText}
            </p>
          </div>
        ))}
      </section>

      {detailRows.length ? (
        <section className="grid gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Details
          </p>
          <div className="grid gap-2">
            {detailRows.map((detail) => (
              <div
                className="rounded-lg border border-border/70 bg-background/45 px-3 py-2.5"
                key={detail.label}
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {detail.label}
                </p>
                <p className="mt-1 text-sm text-foreground">{detail.value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function DraftCardActions({
  canSave,
  draftId,
  isDismissing,
  isPending,
  isSaving,
  onDismissDraft,
  onGenerateDraft,
  onSaveDraft,
  onUpdateRegenerationNotes,
  regenerationNotes,
  showRegenerationInput,
}: {
  canSave: boolean
  draftId: string
  isDismissing: boolean
  isPending: boolean
  isSaving: boolean
  onDismissDraft: AddCardPreviewSectionProps["onDismissDraft"]
  onGenerateDraft: AddCardPreviewSectionProps["onGenerateDraft"]
  onSaveDraft: AddCardPreviewSectionProps["onSaveDraft"]
  onUpdateRegenerationNotes: (value: string) => void
  regenerationNotes: string
  showRegenerationInput: boolean
}) {
  return (
    <div className="grid gap-3 border-t border-border/60 pt-4">
      {showRegenerationInput ? (
        <div className="grid gap-2 rounded-lg border border-border/70 bg-background/35 p-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <IconRefresh className="size-3.5" />
            Regenerate hint
          </div>
          <Textarea
            className="min-h-20 resize-y"
            onChange={(event) => onUpdateRegenerationNotes(event.target.value)}
            placeholder="Example: not the park, the bag they say at the checkout"
            value={regenerationNotes}
          />
          <p className="text-xs text-muted-foreground">
            This text is only used when you press regenerate.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          disabled={isDismissing || isSaving}
          onClick={() => void onDismissDraft(draftId)}
          size="sm"
          type="button"
          variant="ghost"
        >
          {isDismissing ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <IconX data-icon="inline-start" />
          )}
          Dismiss
        </Button>
        <Button
          disabled={isDismissing || isPending || isSaving}
          onClick={() => void onGenerateDraft(draftId, regenerationNotes)}
          size="sm"
          type="button"
          variant="outline"
        >
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <IconRefresh data-icon="inline-start" />
          )}
          Regenerate
        </Button>
        <Button
          disabled={!canSave || isDismissing || isPending || isSaving}
          onClick={() => void onSaveDraft(draftId)}
          size="sm"
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
    </div>
  )
}

function DraftPendingState({ draft }: { draft: AddCardDraftListItem }) {
  const hasGeneratedCard = draftHasGeneratedCard(draft)

  return (
    <div className="grid gap-3 rounded-lg border border-border/70 bg-background/45 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Spinner className="size-3.5 text-muted-foreground" />
          {hasGeneratedCard ? "Updating card" : "Generating card"}
        </div>
        <p className="text-xs text-muted-foreground">
          {hasGeneratedCard ? "Refining the result" : "A few seconds"}
        </p>
      </div>

      {hasGeneratedCard ? (
        <div className="rounded-md border border-border/70 bg-background/55 px-3 py-3">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {draft.expression}
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">→</span>
            <p className="truncate text-sm font-medium text-primary">
              {draft.translation}
            </p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Waiting on a refreshed version.
          </p>
        </div>
      ) : (
        <>
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-8 w-2/3 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <p className="text-xs text-muted-foreground">
            Reading the input and shaping the card.
          </p>
        </>
      )}
    </div>
  )
}

function formatDraftStatus(status: AddCardDraftListItem["status"]) {
  if (status === "pending") {
    return "Generating"
  }

  if (status === "failed") {
    return "Needs retry"
  }

  if (status === "saved") {
    return "Saved"
  }

  return "Ready"
}
