-- ============================================================================
-- SUPABASE COMPLETE MIGRATION SCRIPT
-- VipraPariwar Matrimonial Dating Platform
-- ============================================================================
-- Run this script in Supabase SQL Editor to create all tables and schema

-- ============================================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CREATE USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(50),
  gender_locked BOOLEAN DEFAULT FALSE,
  location_city VARCHAR(100),
  location_state VARCHAR(100),
  profession VARCHAR(100),
  education VARCHAR(100),
  short_bio TEXT,
  bio TEXT,
  profile_image_url VARCHAR(500),
  
  -- User Management
  role VARCHAR(50) DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_plan VARCHAR(50) DEFAULT 'free',
  
  -- Approval System
  approval_status VARCHAR(50) DEFAULT 'pending',
  is_approved BOOLEAN DEFAULT FALSE,
  approval_notes TEXT,
  approved_by UUID,
  approval_requested_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional Fields
  father_name VARCHAR(100),
  mother_name VARCHAR(100),
  company_working_at VARCHAR(150),
  school_name VARCHAR(150),
  college_name VARCHAR(150),
  hobbies TEXT,
  fav_things TEXT,
  siblings INT DEFAULT 0,
  parents_contact_number VARCHAR(20),
  marital_status VARCHAR(50),
  mother_tongue VARCHAR(50),
  age INT,
  nri VARCHAR(10),
  disability VARCHAR(10),
  payment_id VARCHAR(100),
  payment_status BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending',
  deactivated_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. CREATE PROFILE IMAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profile_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  "order" INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, "order")
);

-- ============================================================================
-- 4. CREATE APPROVAL LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.approval_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. CREATE LIKES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  liked_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action VARCHAR(50) DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, liked_user_id)
);

-- ============================================================================
-- 6. CREATE CONNECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sender_id, receiver_id)
);

-- ============================================================================
-- 7. CREATE MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. CREATE KUNDLI TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.kundlis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  birth_date DATE,
  birth_time TIME,
  birth_place VARCHAR(255),
  rashi VARCHAR(50),
  nakshatra VARCHAR(50),
  gotra VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 9. CREATE REFERRALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  referral_code VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. CREATE REWARDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2),
  reward_type VARCHAR(50),
  description TEXT,
  redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 11. CREATE BLOG POSTS TABLE (CMS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 12. CREATE EVENTS TABLE (CMS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 13. CREATE SUCCESS STORIES TABLE (CMS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  couple_names VARCHAR(255),
  meeting_date DATE,
  marriage_date DATE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 14. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_approval_status ON public.users(approval_status);
CREATE INDEX idx_users_created_at ON public.users(created_at);
CREATE INDEX idx_profile_images_user_id ON public.profile_images(user_id);
CREATE INDEX idx_approval_logs_user_id ON public.approval_logs(user_id);
CREATE INDEX idx_approval_logs_admin_id ON public.approval_logs(admin_id);
CREATE INDEX idx_approval_logs_status ON public.approval_logs(status);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_liked_user_id ON public.likes(liked_user_id);
CREATE INDEX idx_connections_sender_id ON public.connections(sender_id);
CREATE INDEX idx_connections_receiver_id ON public.connections(receiver_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_kundlis_user_id ON public.kundlis(user_id);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);

-- ============================================================================
-- 15. CREATE DEFAULT ADMIN USER
-- ============================================================================
-- NOTE: Change these credentials before production!
INSERT INTO public.users (
  email, first_name, last_name, role, is_verified, is_approved, approval_status
) VALUES (
  'admin@viprepariwaar.com',
  'Admin',
  'User',
  'admin',
  true,
  true,
  'approved'
) ON CONFLICT(email) DO NOTHING;

-- ============================================================================
-- 16. CREATE ROW LEVEL SECURITY POLICIES (Optional)
-- ============================================================================
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid()::text = id::text OR role = 'admin');

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Policy: Only admins can approve users
CREATE POLICY "Only admins can approve"
  ON public.users FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()::text) = 'admin'
  );

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables created successfully!
-- Next steps:
-- 1. Set environment variables in .env.local
-- 2. Start the application
-- 3. Test admin login at /admin/login
-- 4. Create users and test the approval workflow

