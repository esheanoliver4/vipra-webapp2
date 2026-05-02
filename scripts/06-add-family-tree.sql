-- Create FamilyMember table
CREATE TABLE IF NOT EXISTS "FamilyMember" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "occupation" TEXT,
    "is_alive" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "FamilyMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE "FamilyMember" ENABLE ROW LEVEL SECURITY;

-- Policies for FamilyMember
CREATE POLICY "Public Read Family Members" 
ON "FamilyMember" FOR SELECT 
USING ( true );

CREATE POLICY "Users can manage their own family members" 
ON "FamilyMember" FOR ALL 
TO authenticated
USING (
  user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  )
)
WITH CHECK (
  user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  )
);
