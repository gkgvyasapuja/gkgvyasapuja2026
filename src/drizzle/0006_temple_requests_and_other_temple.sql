CREATE TABLE "temple_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_id" uuid NOT NULL,
	"state_id" uuid NOT NULL,
	"city_id" uuid NOT NULL,
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"approved_temple_id" uuid,
	"reviewed_at" timestamp,
	"reviewer_role" varchar(32),
	"reviewer_maintainer_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "temple_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "other_temple_name" varchar(255);--> statement-breakpoint
ALTER TABLE "temple_request" ADD CONSTRAINT "temple_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_request" ADD CONSTRAINT "temple_request_approved_temple_id_temple_id_fk" FOREIGN KEY ("approved_temple_id") REFERENCES "public"."temple"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temple_request" ADD CONSTRAINT "temple_request_reviewer_maintainer_id_maintainer_id_fk" FOREIGN KEY ("reviewer_maintainer_id") REFERENCES "public"."maintainer"("id") ON DELETE set null ON UPDATE no action;