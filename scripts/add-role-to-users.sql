-- Add role column to users table if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Create an admin user (replace with your admin email and password)
-- This is for initial setup only
INSERT INTO users (id, email, name, role, password, dob, place_of_birth, gender, father_name, mother_name, profession, education, age, city, marital_status, mother_tongue, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'admin@viprepariwaar.com',
    'Admin User',
    'admin',
    crypt('admin@123', gen_salt('bf')),
    NOW()::DATE,
    'Admin City',
    'other',
    'Admin Father',
    'Admin Mother',
    'Admin',
    'Admin Education',
    30,
    'Admin City',
    'Single',
    'English',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@viprepariwaar.com');

-- Create approval_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS approval_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL, -- approved, rejected
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_approval_logs_user_id ON approval_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_logs_admin_id ON approval_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);
