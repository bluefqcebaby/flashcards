import { relations } from "drizzle-orm"
import { text, timestamp, pgTable } from "drizzle-orm/pg-core"
import { user } from "@/db/auth-schema"

export const userPreferences = pgTable("user_preferences", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  learningLanguageCode: text("learning_language_code").notNull(),
  learningLanguageName: text("learning_language_name").notNull(),
  baseLanguageCode: text("base_language_code").notNull(),
  baseLanguageName: text("base_language_name").notNull(),
  onboardingCompletedAt: timestamp("onboarding_completed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(user, {
    fields: [userPreferences.userId],
    references: [user.id],
  }),
}))

export type UserPreferencesRecord = typeof userPreferences.$inferSelect
