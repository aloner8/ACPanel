-- Add fields on existing package structure
ALTER TABLE "AppPackage"
ADD COLUMN IF NOT EXISTS "engine" TEXT,
ADD COLUMN IF NOT EXISTS "config" JSONB;

-- Undo temporary packets structure
DROP TABLE IF EXISTS "public"."packets";
