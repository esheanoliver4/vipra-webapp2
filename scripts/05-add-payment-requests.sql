-- Create PlatformSettings table
CREATE TABLE IF NOT EXISTS "PlatformSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "qr_code_url" TEXT,
    "upipay_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

-- Create PaymentRequest table
CREATE TABLE IF NOT EXISTS "PaymentRequest" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentRequest_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint on transaction_id
CREATE UNIQUE INDEX IF NOT EXISTS "PaymentRequest_transaction_id_key" ON "PaymentRequest"("transaction_id");

-- Initialize default settings
INSERT INTO "PlatformSettings" ("id", "qr_code_url", "upipay_id")
VALUES ('default', '/qr-placeholder.png', 'admin@upi')
ON CONFLICT ("id") DO NOTHING;
