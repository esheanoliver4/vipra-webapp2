-- Create SubscriptionPlan table
CREATE TABLE IF NOT EXISTS "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "billing_period" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS "SubscriptionPlan_is_active_idx" ON "SubscriptionPlan"("is_active");

-- Insert default plans
INSERT INTO "SubscriptionPlan" ("id", "name", "description", "price", "billing_period", "features", "connection_limit", "is_popular", "is_active", "order", "updated_at")
VALUES 
(gen_random_uuid()::text, 'Free', 'Get started', 0, 'forever', '["Create your profile", "Browse profiles (limited)", "Send 5 connection requests", "View basic info", "Save favorites", "Family tree section"]'::jsonb, 5, false, true, 0, now()),
(gen_random_uuid()::text, 'Premium Monthly', 'Most popular', 499, 'monthly', '["Everything in Free", "Unlimited connection requests", "See who visited your profile", "Message unlimited matches", "Advanced search filters", "Profile analytics", "Kundli matching", "Priority visibility", "Block & report features"]'::jsonb, 9999, true, true, 1, now()),
(gen_random_uuid()::text, 'Premium Quarterly', 'Save 20%', 1299, 'quarterly', '["Everything in Monthly", "20% savings", "Exclusive member events", "Personal matchmaker consultation", "Verified badge", "Featured profile placement"]'::jsonb, 9999, false, true, 2, now()),
(gen_random_uuid()::text, 'Premium Annual', 'Save 40%', 3999, 'annual', '["Everything in Quarterly", "40% savings", "Monthly profile boost", "24/7 priority support", "Family review access", "VIP treatment"]'::jsonb, 9999, false, true, 3, now());
