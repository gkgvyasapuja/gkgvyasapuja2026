CREATE TABLE "admin_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"s3_key" varchar(1024) NOT NULL,
	"public_url" varchar(2048) NOT NULL,
	"file_name" varchar(512) NOT NULL,
	"content_type" varchar(255),
	"created_at" timestamp DEFAULT now()
);
