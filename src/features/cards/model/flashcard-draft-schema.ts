import { relations, sql } from "drizzle-orm"
import {
  check,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { user } from "@/db/auth-schema"
import type {
  ExpressionType,
  FlashcardExample,
} from "@/features/cards/model/contracts"

export const flashcardDraftInputModeEnum = pgEnum(
  "flashcard_draft_input_mode",
  ["learning", "base"]
)
export const flashcardDraftStatusEnum = pgEnum("flashcard_draft_status", [
  "pending",
  "ready",
  "failed",
  "saved",
])

export type FlashcardDraftInputMode =
  (typeof flashcardDraftInputModeEnum.enumValues)[number]
export type FlashcardDraftStatus =
  (typeof flashcardDraftStatusEnum.enumValues)[number]

export const flashcardDrafts = pgTable(
  "flashcard_drafts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: flashcardDraftStatusEnum("status").notNull(),
    seedExpression: text("seed_expression").notNull(),
    inputMode: flashcardDraftInputModeEnum("input_mode").notNull(),
    regenerationNotes: text("regeneration_notes"),
    expression: text("expression"),
    expressionType: text("expression_type").$type<ExpressionType>(),
    translation: text("translation"),
    examples: jsonb("examples").$type<FlashcardExample[]>(),
    notes: text("notes"),
    pronunciation: text("pronunciation"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      "flashcard_drafts_generated_content_check",
      sql`(${table.status} not in ('ready', 'saved')) or (${table.expression} is not null and ${table.expressionType} is not null and ${table.translation} is not null and ${table.examples} is not null)`
    ),
    check(
      "flashcard_drafts_failed_error_check",
      sql`(${table.status} <> 'failed') or ${table.errorMessage} is not null`
    ),
    index("flashcard_drafts_user_id_idx").on(table.userId),
    index("flashcard_drafts_user_status_created_idx").on(
      table.userId,
      table.status,
      table.createdAt
    ),
  ]
)

export const flashcardDraftsRelations = relations(
  flashcardDrafts,
  ({ one }) => ({
    user: one(user, {
      fields: [flashcardDrafts.userId],
      references: [user.id],
    }),
  })
)

export type FlashcardDraftRecord = typeof flashcardDrafts.$inferSelect
