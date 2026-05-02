-- Create BlogCategory table
CREATE TABLE IF NOT EXISTS "BlogCategory" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create BlogPost table
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featured_image" TEXT,
    "category_id" UUID REFERENCES "BlogCategory"("id") ON DELETE SET NULL,
    "author_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "status" TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'published'
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;

-- Policies for BlogCategory
CREATE POLICY "Public Read Categories" ON "BlogCategory" FOR SELECT USING (true);
CREATE POLICY "Admin Manage Categories" ON "BlogCategory" FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));

-- Policies for BlogPost
CREATE POLICY "Public Read Published Posts" ON "BlogPost" FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admin Read All Posts" ON "BlogPost" FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin Manage Posts" ON "BlogPost" FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));

-- Initial Categories
INSERT INTO "BlogCategory" (name, slug) VALUES 
('Wedding Tips', 'wedding-tips'),
('Success Stories', 'success-stories'),
('Relationship Advice', 'relationship-advice'),
('Community News', 'community-news')
ON CONFLICT (name) DO NOTHING;
