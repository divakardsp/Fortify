CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(322) NOT NULL,
	"website_url" varchar NOT NULL,
	"redirect_url" varchar NOT NULL,
	"client_secret" varchar(128),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "clients_name_unique" UNIQUE("name"),
	CONSTRAINT "clients_email_unique" UNIQUE("email"),
	CONSTRAINT "clients_website_url_unique" UNIQUE("website_url"),
	CONSTRAINT "clients_redirect_url_unique" UNIQUE("redirect_url"),
	CONSTRAINT "clients_client_secret_unique" UNIQUE("client_secret")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(322) NOT NULL,
	"password" varchar,
	"is_verified" boolean DEFAULT false NOT NULL,
	"code" varchar(10),
	"code_expires" timestamp DEFAULT now(),
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
