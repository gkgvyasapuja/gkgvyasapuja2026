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
ALTER TABLE "book" ADD COLUMN "is_visible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "offering" ADD COLUMN "note" text;--> statement-breakpoint
ALTER TABLE "offering" ADD COLUMN "marked_edited_at" timestamp;--> statement-breakpoint
ALTER TABLE "offering" ADD COLUMN "marked_edited_by_role" varchar(32);--> statement-breakpoint
ALTER TABLE "offering" ADD COLUMN "marked_edited_by_maintainer_id" uuid;--> statement-breakpoint
ALTER TABLE "offering" ADD CONSTRAINT "offering_marked_edited_by_maintainer_id_maintainer_id_fk" FOREIGN KEY ("marked_edited_by_maintainer_id") REFERENCES "public"."maintainer"("id") ON DELETE set null ON UPDATE no action;