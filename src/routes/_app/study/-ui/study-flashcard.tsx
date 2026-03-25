import { IconChevronRight } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"

type StudyFlashcardProps = {
  card: FlashcardRecord
  isRevealed: boolean
  onReveal: () => void
}

export const StudyFlashcard = ({
  card,
  isRevealed,
  onReveal,
}: StudyFlashcardProps) => {
  return (
    <div
      className={`w-full max-w-xl rounded-2xl border bg-card px-8 py-10 shadow-xs transition-all duration-200 ${
        isRevealed
          ? "border-border/80 ring-1 ring-ring/10"
          : "cursor-pointer border-border/60 hover:border-border/80"
      }`}
      onClick={() => {
        if (!isRevealed) onReveal()
      }}
      onKeyDown={(e) => {
        if (!isRevealed && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onReveal()
        }
      }}
      role={isRevealed ? undefined : "button"}
      tabIndex={isRevealed ? undefined : 0}
    >
      {/* Front: expression + badges */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">{card.expressionType}</Badge>
          {card.pronunciation ? (
            <Badge variant="outline">{card.pronunciation}</Badge>
          ) : null}
        </div>

        <p className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          {card.expression}
        </p>

        {!isRevealed ? (
          <p className="mt-2 text-sm text-muted-foreground">Tap to reveal</p>
        ) : null}
      </div>

      {/* Back: translation + collapsible details */}
      {isRevealed ? (
        <div className="mt-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Separator />

          <div className="flex flex-col items-center gap-1">
            <p className="text-center text-xl font-medium sm:text-2xl">
              {card.translation}
            </p>
            {card.notes ? (
              <p className="text-center text-sm text-muted-foreground">
                {card.notes}
              </p>
            ) : null}
          </div>

          {card.examples.length > 0 ? (
            <Collapsible>
              <CollapsibleTrigger className="mx-auto flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&[data-panel-open]>svg]:rotate-90">
                <IconChevronRight className="size-4 transition-transform duration-200" />
                Details
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {card.examples.map((example) => (
                    <div
                      key={`${example.targetText}-${example.baseText}`}
                      className="rounded-lg border border-border/40 px-4 py-3"
                    >
                      <p className="text-sm font-medium">
                        {example.targetText}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {example.baseText}
                      </p>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
