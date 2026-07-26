CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(322) NOT NULL,
	"password" varchar,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_token" varchar,
	"verification_token_expires" timestamp with time zone,
	"refresh_token" varchar,
	"refresh_token_expires" timestamp with time zone,
	"reset_password_token" varchar,
	"reset_password_expires" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "code";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "code_expires";