-- Add new columns to User table for approval system
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "gender_locked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "short_bio" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "is_approved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "approval_status" VARCHAR(50) NOT NULL DEFAULT 'pending';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "approval_notes" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "approved_by" VARCHAR(255);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "approval_requested_at" TIMESTAMP;
ALTER TABLE "User" RENAME COLUMN "status" TO "payment_status_old";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" VARCHAR(50) NOT NULL DEFAULT 'pending';

-- Create ProfileImage table
CREATE TABLE IF NOT EXISTS "ProfileImage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("user_id", "order"),
  CONSTRAINT "ProfileImage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "ProfileImage_user_id_idx" on "ProfileImage"("user_id");

-- Create ApprovalLog table
CREATE TABLE IF NOT EXISTS "ApprovalLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "admin_id" TEXT,
  "status" VARCHAR(50) NOT NULL,
  "notes" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApprovalLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "ApprovalLog_user_id_idx" on "ApprovalLog"("user_id");
CREATE INDEX IF NOT EXISTS "ApprovalLog_status_idx" on "ApprovalLog"("status");
CREATE INDEX IF NOT EXISTS "ApprovalLog_created_at_idx" on "ApprovalLog"("created_at");

-- Create Like table
CREATE TABLE IF NOT EXISTS "Like" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "liked_user_id" TEXT NOT NULL,
  "action" VARCHAR(50) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("user_id", "liked_user_id"),
  CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE,
  CONSTRAINT "Like_liked_user_id_fkey" FOREIGN KEY ("liked_user_id") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Like_user_id_idx" on "Like"("user_id");
CREATE INDEX IF NOT EXISTS "Like_liked_user_id_idx" on "Like"("liked_user_id");
CREATE INDEX IF NOT EXISTS "Like_action_idx" on "Like"("action");
