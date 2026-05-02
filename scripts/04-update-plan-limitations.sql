-- Update SubscriptionPlan table with connection_limit
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "connection_limit" INTEGER DEFAULT 0;

-- Update User table with tracking fields
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "premium_plan_id" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "connections_sent_count" INTEGER DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_reset_date" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing users to have the Free plan if they don't have one
-- Note: This assumes you have already seeded the SubscriptionPlan table
DO $$
DECLARE
    free_plan_id TEXT;
BEGIN
    SELECT id INTO free_plan_id FROM "SubscriptionPlan" WHERE price = 0 AND name = 'Free' LIMIT 1;
    
    IF free_plan_id IS NOT NULL THEN
        UPDATE "users" 
        SET "premium_plan_id" = free_plan_id, "premium_plan" = 'Free' 
        WHERE "premium_plan_id" IS NULL;
    END IF;
END $$;

-- Update the Connection limits in SubscriptionPlan (Run the seed script again after this)
UPDATE "SubscriptionPlan" SET "connection_limit" = 5 WHERE "name" = 'Free';
UPDATE "SubscriptionPlan" SET "connection_limit" = 9999 WHERE "name" LIKE 'Premium%';
