-- Create Blog table
CREATE TABLE IF NOT EXISTS "Blog" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_blog_published" ON "Blog"(published);
CREATE INDEX IF NOT EXISTS "idx_blog_created_at" ON "Blog"(created_at);

-- Create SuccessStory table
CREATE TABLE IF NOT EXISTS "SuccessStory" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  couple_name TEXT NOT NULL,
  couple_image TEXT,
  story_content TEXT NOT NULL,
  match_date TIMESTAMP,
  wedding_date TIMESTAMP,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_success_published" ON "SuccessStory"(published);
CREATE INDEX IF NOT EXISTS "idx_success_featured" ON "SuccessStory"(featured);
CREATE INDEX IF NOT EXISTS "idx_success_created_at" ON "SuccessStory"(created_at);

-- Create Event table
CREATE TABLE IF NOT EXISTS "Event" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  event_date TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  registration_link TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_event_published" ON "Event"(published);
CREATE INDEX IF NOT EXISTS "idx_event_date" ON "Event"(event_date);

-- Create News table
CREATE TABLE IF NOT EXISTS "News" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_news_published" ON "News"(published);
CREATE INDEX IF NOT EXISTS "idx_news_featured" ON "News"(featured);
CREATE INDEX IF NOT EXISTS "idx_news_created_at" ON "News"(created_at);

-- Create Referral table
CREATE TABLE IF NOT EXISTS "Referral" (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  referee_id TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  commission FLOAT DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_referral_referrer" ON "Referral"(referrer_id);
CREATE INDEX IF NOT EXISTS "idx_referral_referee" ON "Referral"(referee_id);
CREATE INDEX IF NOT EXISTS "idx_referral_status" ON "Referral"(status);

-- Create Reward table
CREATE TABLE IF NOT EXISTS "Reward" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  referral_id TEXT,
  amount FLOAT NOT NULL,
  reward_type TEXT NOT NULL,
  description TEXT,
  redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_reward_user" ON "Reward"(user_id);
CREATE INDEX IF NOT EXISTS "idx_reward_redeemed" ON "Reward"(redeemed);
