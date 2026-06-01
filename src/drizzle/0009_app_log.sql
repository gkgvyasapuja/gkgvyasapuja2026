CREATE TABLE "app_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_type" varchar(64) NOT NULL,
	"duration_ms" integer NOT NULL,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "app_log_log_type_created_at_idx" ON "app_log" USING btree ("log_type", "created_at");
