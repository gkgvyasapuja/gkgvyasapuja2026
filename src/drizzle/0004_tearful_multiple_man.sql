-- Offering HTML can exceed 10k chars (e.g. embedded images as base64 in converted docx).
ALTER TABLE "offering" ALTER COLUMN "offering" SET DATA TYPE text;
