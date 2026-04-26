# Supabase Setup & Migration Guide

Complete step-by-step guide to connect VipraPariwar to Supabase and run all migrations.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Get API Keys](#get-api-keys)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Run Database Migration](#run-database-migration)
6. [Create Admin User](#create-admin-user)
7. [Test Connection](#test-connection)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- [ ] Supabase account (free at https://supabase.com)
- [ ] Node.js 18+ installed
- [ ] npm or pnpm package manager
- [ ] Git installed
- [ ] This project cloned locally

---

## Create Supabase Project

### Step 1: Sign In to Supabase
1. Go to https://app.supabase.com
2. Sign in with your account (or create one)
3. Click "New Project"

### Step 2: Create New Project
- **Project Name**: VipraPariwaar (or your preferred name)
- **Database Password**: Create a strong password (save this!)
- **Region**: Choose closest to your users
- **Pricing Plan**: Free or Pro
- Click "Create new project"

Wait 2-3 minutes for the project to initialize...

### Step 3: Verify Project is Ready
- You'll see "Your project is ready!" message
- Project dashboard loads successfully

---

## Get API Keys

### Step 1: Navigate to API Settings
1. In Supabase Dashboard, go to **Settings** (bottom left)
2. Click on **API** tab
3. You'll see two important keys:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon Key)

### Step 2: Copy API Keys
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
```

Save these keys somewhere safe!

---

## Configure Environment Variables

### Step 1: Create .env.local File
In your project root directory, create a new file called `.env.local`:

```bash
# Linux/Mac
touch .env.local

# Windows
type nul > .env.local
```

### Step 2: Add Environment Variables
Open `.env.local` and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Email Service (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace:
- `https://your-project-id.supabase.co` with your actual URL
- `your-anon-key-here` with your actual Anon Key
- `your-email@gmail.com` with your email (optional for notifications)

### Step 3: Verify Variables
Run this to test:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
# Should output: https://xxxx.supabase.co
```

---

## Run Database Migration

### Step 1: Open Supabase SQL Editor
1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2: Copy Migration SQL
1. Open file: `scripts/supabase-complete-migration.sql`
2. Copy ALL the content
3. Paste into Supabase SQL Editor

### Step 3: Execute Migration
1. Click **Run** button (or Ctrl+Enter)
2. Wait for execution to complete
3. You should see success message: "Query executed successfully"

### What Was Created?
- [ ] Users table (main user data)
- [ ] Profile images table (multiple photos)
- [ ] Approval logs table (audit trail)
- [ ] Likes/Connections/Messages tables
- [ ] Kundli table (astrology)
- [ ] Referral and Rewards tables
- [ ] Blog, Events, Success Stories (CMS)
- [ ] Indexes (for performance)
- [ ] Admin user account
- [ ] Row Level Security policies

### Step 4: Verify Tables
1. Go to **Table Editor** in Supabase
2. Expand "public" schema
3. Verify all tables are there:
   - users
   - profile_images
   - approval_logs
   - messages
   - connections
   - kundlis
   - referrals
   - rewards
   - blog_posts
   - events
   - success_stories

---

## Create Admin User

### Option 1: Using SQL (Recommended)
1. Go to **SQL Editor**
2. Run this query:

```sql
-- Create or update admin user
INSERT INTO public.users (
  email, 
  first_name, 
  last_name, 
  role, 
  is_verified, 
  is_approved, 
  approval_status
) VALUES (
  'your-admin-email@example.com',
  'Admin',
  'User',
  'admin',
  true,
  true,
  'approved'
) ON CONFLICT(email) DO NOTHING;
```

Replace `your-admin-email@example.com` with your actual email.

### Option 2: Using Supabase Auth
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. User will appear in users table

Then update role via SQL:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## Test Connection

### Step 1: Start Application
```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

### Step 2: Test Supabase Connection
Visit: http://localhost:3000

You should see:
- [ ] App loads without errors
- [ ] Navigation displays correctly
- [ ] Navbar renders

### Step 3: Test Admin Login
1. Go to http://localhost:3000/admin/login
2. Enter your admin email
3. Enter admin password
4. Click "Sign In"

Expected result:
- [ ] Login succeeds
- [ ] Redirected to /admin/dashboard
- [ ] Admin dashboard loads with user list

### Step 4: Test User Operations
1. Go to http://localhost:3000/register
2. Create a new user account
3. Complete profile
4. Go back to Admin Dashboard
5. New user appears as "pending"

---

## Configuration Verification Checklist

Run these commands to verify setup:

```bash
# Check if environment variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
# Should output: https://xxxx.supabase.co

# Check if Supabase client initializes
node -e "const { createClient } = require('@supabase/supabase-js'); console.log('Client created')"
# Should output: Client created

# Start the app and check browser console
npm run dev
# Open browser DevTools → Console (F12)
# Should NOT show errors about Supabase
```

---

## Troubleshooting

### Problem: Environment Variables Not Loading

**Solution:**
1. Delete `.next` folder: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Verify .env.local has no spaces around `=`

### Problem: Connection Refused

**Solution:**
1. Verify Supabase URL is correct
2. Check internet connection
3. Verify Supabase project is active
4. Check if project was deleted

### Problem: "Invalid API key"

**Solution:**
1. Go to Supabase Settings → API
2. Copy keys again (avoid copying extra spaces)
3. Paste into .env.local
4. Restart dev server

### Problem: Tables Not Visible

**Solution:**
1. Verify migration SQL ran successfully
2. Check for errors in SQL execution
3. Try running migration again
4. Clear browser cache and refresh

### Problem: Admin Login Fails

**Solution:**
1. Verify admin user was created:
```sql
SELECT email, role FROM public.users WHERE role = 'admin';
```
2. Ensure email matches in login
3. Check if password is correct
4. Create new admin user if needed

### Problem: "User not found" Error

**Solution:**
1. Check if user table is empty
2. Try creating a test user manually
3. Verify users table has data:
```sql
SELECT COUNT(*) FROM public.users;
```

### Problem: API Endpoints Return 401

**Solution:**
1. Verify Supabase connection is working
2. Check authentication token is valid
3. Ensure RLS policies allow access
4. Test with curl:
```bash
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/users?limit=1
```

---

## Next Steps After Setup

1. **Configure Email Service** (optional)
   - Set up Gmail or SendGrid for notifications
   - Update EMAIL_SERVICE in .env.local

2. **Upload Profile Pictures**
   - Set up Supabase Storage for images
   - Update image upload endpoints

3. **Configure Stripe** (optional)
   - For premium subscriptions
   - Update payment endpoints

4. **Deploy to Production**
   - Add environment variables to Vercel
   - Deploy code to Vercel
   - Update Supabase project settings

5. **Set Up Backups**
   - Enable automated backups in Supabase
   - Configure backup retention

---

## Useful Supabase Links

- [Supabase Documentation](https://supabase.com/docs)
- [SQL Reference](https://supabase.com/docs/reference/sql)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Authentication](https://supabase.com/docs/guides/auth)
- [Database](https://supabase.com/docs/guides/database)

---

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review Supabase documentation
3. Check browser console for error messages
4. Verify all environment variables are set
5. Ensure database migration ran successfully

---

**Setup Complete!** ✅

Your VipraPariwar application is now connected to Supabase and ready to use.

