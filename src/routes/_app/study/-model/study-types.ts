import type { ExpressionType } from "@/features/cards/model/contracts"
import type { FlashcardRecord } from "@/features/cards/model/flashcard-schema"

export type StudyRouteData = {
  currentCard: FlashcardRecord | null
  dueCardCount: number
  totalCardCount: number
  randomCards: FlashcardRecord[]
}

export type StudyCardFormValues = {
  expression: string
  expressionType: ExpressionType
  translation: string
  exampleOneTarget: string
  exampleOneBase: string
  exampleTwoTarget: string
  exampleTwoBase: string
  notes: string
  pronunciation: string
}

export const studyCardFormDefaults: StudyCardFormValues = {
  expression: "",
  expressionType: "word",
  translation: "",
  exampleOneTarget: "",
  exampleOneBase: "",
  exampleTwoTarget: "",
  exampleTwoBase: "",
  notes: "",
  pronunciation: "",
}

export const expressionTypeOptions: Array<{
  value: ExpressionType
  label: string
}> = [
  {
    value: "word",
    label: "Word",
  },
  {
    value: "phrase",
    label: "Phrase",
  },
]
