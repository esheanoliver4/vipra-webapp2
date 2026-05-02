-- Current Database Schema Dump (Generated from Live DB)

-- Table: users
-- Columns: id, auth_id, email, first_name, last_name, date_of_birth, gender, gender_locked, location_city, location_state, profession, education, short_bio, bio, profile_image_url, role, is_verified, is_premium, premium_plan, approval_status, is_approved, approval_notes, approved_by, approval_requested_at, approved_at, father_name, mother_name, company_working_at, school_name, college_name, hobbies, fav_things, siblings, parents_contact_number, marital_status, mother_tongue, age, nri, disability, payment_id, payment_status, status, deactivated_at, created_at, updated_at, premium_plan_id, connections_sent_count, last_reset_date

-- Table: kundlis
-- Columns: id, user_id, birth_date, birth_time, birth_place, rashi, nakshatra, gotra, created_at, updated_at

-- Table: profile_images
-- Columns: id, user_id, image_url, order, is_primary, created_at, updated_at

-- Table: connections
-- Columns: [Empty table - could not determine structure via SELECT]

-- Table: messages
-- Columns: id, sender_id, receiver_id, content, is_read, created_at, updated_at

-- Table: SubscriptionPlan
-- Columns: id, name, description, price, billing_period, features, is_popular, is_active, order, created_at, updated_at, connection_limit

-- Table: PaymentRequest
-- Columns: id, user_id, plan_id, transaction_id, amount, status, created_at, updated_at

-- Table: FamilyMember
-- Columns: id, user_id, relationship, name, occupation, is_alive, created_at, updated_at

-- Table: BlogPost
-- Columns: id, title, slug, content, excerpt, featured_image, category_id, author_id, status, published_at, created_at, updated_at

-- Table: BlogCategory
-- Columns: id, name, slug, created_at, updated_at

-- Table: static_pages
-- Columns: id, title, slug, content, created_at, updated_at

-- Table: PlatformSettings
-- Columns: id, qr_code_url, upipay_id, updated_at

-- Table: referrals
-- Columns: [Empty table - could not determine structure via SELECT]

-- Table: rewards
-- Columns: [Empty table - could not determine structure via SELECT]

