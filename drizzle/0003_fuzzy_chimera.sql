CREATE TABLE "flashcard_drafts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" text NOT NULL,
	"seed_expression" text NOT NULL,
	"input_mode" text NOT NULL,
	"regeneration_notes" text,
	"expression" text,
	"expression_type" text,
	"translation" text,
	"examples" jsonb,
	"notes" text,
	"pronunciation" text,
	"part_of_speech" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flashcard_drafts" ADD CONSTRAINT "flashcard_drafts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "flashcard_drafts_user_id_idx" ON "flashcard_drafts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "flashcard_drafts_user_status_created_idx" ON "flashcard_drafts" USING btree ("user_id","status","created_at");