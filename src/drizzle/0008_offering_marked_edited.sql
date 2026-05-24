ALTER TABLE "offering" ADD COLUMN "marked_edited_at" timestamp;--> statement-breakpoint
ALTER TABLE "offering" ADD COLUMN "marked_edited_by_role" varchar(32);--> statement-breakpoint
ALTER TABLE "offering" ADD COLUMN "marked_edited_by_maintainer_id" uuid;--> statement-breakpoint
ALTER TABLE "offering" ADD CONSTRAINT "offering_marked_edited_by_maintainer_id_maintainer_id_fk" FOREIGN KEY ("marked_edited_by_maintainer_id") REFERENCES "public"."maintainer"("id") ON DELETE set null ON UPDATE no action;
