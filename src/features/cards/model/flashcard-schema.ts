import { relations } from "drizzle-orm"
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { user } from "@/db/auth-schema"
import type {
  ExpressionType,
  FlashcardExample,
  StudyRating,
} from "@/features/cards/model/contracts"

export const flashcards = pgTable(
  "flashcards",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expression: text("expression").notNull(),
    expressionType: text("expression_type").$type<ExpressionType>().notNull(),
    translation: text("translation").notNull(),
    examples: jsonb("examples").$type<FlashcardExample[]>().notNull(),
    notes: text("notes"),
    pronunciation: text("pronunciation"),
    dueAt: timestamp("due_at").notNull(),
    lastReviewedAt: timestamp("last_reviewed_at"),
    reviewCount: integer("review_count").default(0).notNull(),
    lapseCount: integer("lapse_count").default(0).notNull(),
    intervalDays: integer("interval_days").default(0).notNull(),
    lastRating: text("last_rating").$type<StudyRating>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("flashcards_user_id_idx").on(table.userId),
    index("flashcards_user_due_at_idx").on(table.userId, table.dueAt),
  ]
)

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  user: one(user, {
    fields: [flashcards.userId],
    references: [user.id],
  }),
}))

export type FlashcardRecord = typeof flashcards.$inferSelect
