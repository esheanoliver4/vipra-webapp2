# Supabase Setup Checklist

Complete this checklist as you set up Supabase for VipraPariwar.

## Pre-Setup

- [ ] Supabase account created (https://supabase.com)
- [ ] Node.js 18+ installed
- [ ] npm/pnpm installed
- [ ] Project cloned locally
- [ ] Terminal open in project directory

## Step 1: Create Supabase Project

- [ ] Logged into Supabase dashboard
- [ ] Clicked "New Project"
- [ ] Project Name: VipraPariwaar (or preferred name)
- [ ] Strong database password created
- [ ] Region selected (closest to users)
- [ ] Pricing plan selected (Free or Pro)
- [ ] Waited 2-3 minutes for initialization
- [ ] Project shows "Ready" status

## Step 2: Get API Keys

- [ ] Navigated to Settings → API
- [ ] Copied NEXT_PUBLIC_SUPABASE_URL
  ```
  Value: https://_____________.supabase.co
  ```
- [ ] Copied NEXT_PUBLIC_SUPABASE_ANON_KEY
  ```
  Value: eyJhbGc...
  ```
- [ ] Saved keys somewhere safe
- [ ] Verified keys are not empty

## Step 3: Create Environment File

- [ ] Created `.env.local` file in project root
- [ ] Added NEXT_PUBLIC_SUPABASE_URL
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Added NODE_ENV=development
- [ ] Added NEXT_PUBLIC_APP_URL=http://localhost:3000
- [ ] File has no extra spaces around `=`
- [ ] File is in `.gitignore` (not committed)

Example .env.local:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Run Database Migration

### Prepare Migration File
- [ ] Opened `scripts/supabase-complete-migration.sql`
- [ ] Verified file contains CREATE TABLE statements
- [ ] File has ~300 lines of SQL code

### Execute in Supabase
- [ ] Went to Supabase → SQL Editor
- [ ] Clicked "New Query"
- [ ] Copied entire content of migration file
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" button
- [ ] Waited for execution to complete
- [ ] Saw success message: "Query executed successfully"

### Verify Tables Created
- [ ] Went to Table Editor
- [ ] Expanded "public" schema
- [ ] Verified these tables exist:
  - [ ] users
  - [ ] profile_images
  - [ ] approval_logs
  - [ ] likes
  - [ ] connections
  - [ ] messages
  - [ ] kundlis
  - [ ] referrals
  - [ ] rewards
  - [ ] blog_posts
  - [ ] events
  - [ ] success_stories

## Step 5: Create Admin User

### Option A: Using SQL
- [ ] Went to SQL Editor
- [ ] Created new query
- [ ] Ran this SQL:
  ```sql
  INSERT INTO public.users (
    email, first_name, last_name, role, is_verified, 
    is_approved, approval_status
  ) VALUES (
    'your-admin@example.com',
    'Admin',
    'User',
    'admin',
    true,
    true,
    'approved'
  ) ON CONFLICT(email) DO NOTHING;
  ```
- [ ] Replaced email with actual admin email
- [ ] Clicked Run
- [ ] Saw success message

### Option B: Using Supabase Auth (Alternative)
- [ ] Went to Authentication → Users
- [ ] Clicked "Add User"
- [ ] Entered admin email
- [ ] Entered admin password
- [ ] Created user
- [ ] Verified user appears in users table
- [ ] Ran SQL to set role to 'admin'

### Verify Admin User
- [ ] Went to Table Editor → users
- [ ] Found admin user row
- [ ] Verified role = 'admin'
- [ ] Verified is_approved = true
- [ ] Verified approval_status = 'approved'

## Step 6: Test Connection

### Start Application
- [ ] Opened terminal in project root
- [ ] Installed dependencies: `npm install`
- [ ] Started dev server: `npm run dev`
- [ ] Waited for "ready - started server on"
- [ ] No error messages in terminal

### Test in Browser
- [ ] Opened http://localhost:3000
- [ ] Page loads without errors
- [ ] Opened browser DevTools (F12)
- [ ] Console tab shows no Supabase errors
- [ ] Network tab shows requests to supabase.co

### Test Admin Login
- [ ] Navigated to http://localhost:3000/admin/login
- [ ] Entered admin email from Step 5
- [ ] Entered admin password from Step 5
- [ ] Clicked "Sign In"
- [ ] Successfully logged in
- [ ] Redirected to /admin/dashboard
- [ ] Dashboard loads with user table
- [ ] Admin user appears in the table

### Test User Registration
- [ ] Navigated to http://localhost:3000/register
- [ ] Filled in registration form
- [ ] Created new user account
- [ ] Completed profile
- [ ] Clicked Save/Submit
- [ ] User created successfully
- [ ] Went back to Admin Dashboard
- [ ] New user appears in table with status "pending"
- [ ] Can approve/reject new user

## Step 7: Advanced Testing

### Database Connectivity
- [ ] Checked environment variables load:
  ```bash
  echo $NEXT_PUBLIC_SUPABASE_URL
  # Should output: https://xxxx.supabase.co
  ```

### API Endpoints
- [ ] Tested admin users endpoint:
  ```bash
  curl -H "Authorization: Bearer YOUR_ANON_KEY" \
    https://your-project.supabase.co/rest/v1/users?limit=1
  ```
- [ ] Got JSON response with users data

### Browser Console
- [ ] No "Supabase not configured" errors
- [ ] No "Invalid API key" errors
- [ ] No "Connection refused" errors
- [ ] No authentication errors

## Step 8: Production Preparation

- [ ] Database backups enabled in Supabase
- [ ] RLS policies reviewed and secure
- [ ] Indexes created for performance
- [ ] Default admin password changed
- [ ] Email notifications configured (optional)
- [ ] Stripe configured for payments (optional)

## Troubleshooting Done

If any errors occurred:
- [ ] Checked .env.local file format
- [ ] Verified no spaces around `=`
- [ ] Restarted dev server
- [ ] Cleared browser cache
- [ ] Verified Supabase project is active
- [ ] Checked internet connection
- [ ] Consulted SUPABASE_SETUP_GUIDE.md
- [ ] Reviewed console errors

## Success Indicators

Your setup is successful when:
- [ ] Environment variables are loaded
- [ ] Supabase connection works
- [ ] All tables are created
- [ ] Admin user can login
- [ ] Admin dashboard displays
- [ ] Users can register
- [ ] New users appear in admin dashboard
- [ ] Approval/rejection works
- [ ] No console errors in browser

## Next Steps

After completing this checklist:

1. **Configure Email Service** (optional)
   - [ ] Set up Gmail App Password or SendGrid
   - [ ] Update .env.local with email config
   - [ ] Test email sending

2. **Configure Storage** (optional)
   - [ ] Set up Supabase Storage for images
   - [ ] Configure upload/download endpoints
   - [ ] Test image uploads

3. **Deploy to Production**
   - [ ] Add environment variables to Vercel
   - [ ] Update Supabase project settings
   - [ ] Deploy application code
   - [ ] Test production deployment

4. **Monitor and Maintain**
   - [ ] Set up error logging (Sentry)
   - [ ] Monitor API performance
   - [ ] Review database metrics
   - [ ] Set up automated backups

---

## Files Created for Setup

```
scripts/
└── supabase-complete-migration.sql (303 lines - SQL migration)

Documentation/
├── SUPABASE_SETUP_GUIDE.md (detailed guide)
├── SUPABASE_QUICK_REFERENCE.md (quick reference)
└── SUPABASE_SETUP_CHECKLIST.md (this file)

Config/
├── .env.local.example (environment template)
└── .env.local (CREATE THIS - not in repo)
```

---

## Contact & Support

For issues:
1. Review SUPABASE_SETUP_GUIDE.md troubleshooting section
2. Check Supabase documentation: https://supabase.com/docs
3. Review console errors (F12)
4. Check .env.local format

---

**Checklist Version**: 1.0
**Last Updated**: 2026-04-25
**Status**: Ready for Setup

