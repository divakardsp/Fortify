ALTER TABLE "users" ADD COLUMN "code" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "code_expires" timestamp DEFAULT now();