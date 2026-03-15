CREATE TABLE "user_preferences" (
	"user_id" text PRIMARY KEY NOT NULL,
	"learning_language_code" text NOT NULL,
	"learning_language_name" text NOT NULL,
	"base_language_code" text NOT NULL,
	"base_language_name" text NOT NULL,
	"onboarding_completed_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;