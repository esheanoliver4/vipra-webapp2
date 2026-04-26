# Supabase Setup - Quick Reference

## 5-Minute Setup Guide

### 1. Create Supabase Project (2 min)
```
1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in details:
   - Name: VipraPariwaar
   - Password: Your_Strong_Password_123
   - Region: Closest to you
4. Wait for initialization
```

### 2. Get API Keys (1 min)
```
1. Click Settings → API
2. Copy:
   NEXT_PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
```

### 3. Create .env.local (1 min)
```bash
# Create file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

### 4. Run Migration (1 min)
```
1. Go to Supabase → SQL Editor
2. Copy content from: scripts/supabase-complete-migration.sql
3. Paste into SQL Editor
4. Click Run
5. Wait for "Query executed successfully"
```

---

## Database Schema

### Core Tables
| Table | Purpose |
|-------|---------|
| users | User profiles and data |
| profile_images | Multiple profile pictures per user |
| approval_logs | Admin approval history |
| likes | User interactions (swipes) |
| connections | Match connections |
| messages | Chat messages |
| kundlis | Astrological data |
| referrals | Referral system |
| rewards | Reward points |

### CMS Tables
| Table | Purpose |
|-------|---------|
| blog_posts | Blog articles |
| events | Community events |
| success_stories | User success stories |

---

## Environment Variables Explained

```env
# Required - from Supabase API Settings
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional - for email notifications
EMAIL_SERVICE=gmail|sendgrid|aws-ses
EMAIL_USER=your@email.com
EMAIL_PASSWORD=app-password

# Required for development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Data Fields

### Users Table
- `id` - UUID primary key
- `email` - Unique email address
- `first_name`, `last_name` - Name
- `gender`, `age` - Demographics
- `location_city`, `location_state` - Location
- `role` - 'user' or 'admin'
- `approval_status` - pending/approved/rejected
- `is_verified` - Email verified
- `is_premium` - Premium subscriber

---

## Admin Operations

### Find Admin User
```sql
SELECT * FROM users WHERE role = 'admin';
```

### Create Admin User
```sql
INSERT INTO users (email, first_name, last_name, role, is_verified, is_approved, approval_status)
VALUES ('admin@example.com', 'Admin', 'User', 'admin', true, true, 'approved');
```

### Approve User
```sql
UPDATE users 
SET approval_status = 'approved', is_approved = true
WHERE id = 'user-uuid-here';
```

### View Approval Logs
```sql
SELECT * FROM approval_logs ORDER BY created_at DESC;
```

---

## API Endpoints

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/[id]/approve` - Approve user
- `PATCH /api/admin/users/[id]/reject` - Reject user

### Users
- `GET /api/users/role` - Get user role
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

---

## Testing

### Test Supabase Connection
```bash
# Check if environment variables are set
echo $NEXT_PUBLIC_SUPABASE_URL

# Start app
npm run dev

# Open browser console (F12)
# Should NOT show Supabase errors
```

### Test Admin Login
1. Go to http://localhost:3000/admin/login
2. Enter admin email
3. Enter admin password
4. Should redirect to /admin/dashboard

### Test User Registration
1. Go to http://localhost:3000/register
2. Fill in form
3. Submit
4. Check admin dashboard - new user appears as "pending"

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# View environment variables
env | grep SUPABASE

# Test Supabase connection
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/users?limit=1
```

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Env vars not loading | Delete .next folder, restart server |
| Connection refused | Check internet, verify Supabase URL |
| Invalid API key | Copy keys again carefully, avoid spaces |
| Tables not visible | Run migration again, check for SQL errors |
| Login fails | Verify admin user exists, check email |
| API returns 401 | Check API key, verify RLS policies |

---

## File Locations

```
project-root/
├── .env.local (CREATE THIS)
├── .env.local.example (TEMPLATE)
├── scripts/
│   └── supabase-complete-migration.sql (RUN THIS)
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── dashboard/page.tsx
│   │   └── api/
│   │       ├── admin/
│   │       └── users/
│   └── components/
│       ├── Navbar.tsx
│       └── admin/
│           └── UserManagementDashboard.tsx
└── prisma/
    └── schema.prisma
```

---

## Next Steps

- [ ] Create Supabase project
- [ ] Get API keys
- [ ] Create .env.local file
- [ ] Run database migration
- [ ] Start application
- [ ] Test admin login
- [ ] Create test user
- [ ] Test approval workflow
- [ ] Deploy to production

---

**Status**: Ready for Setup ✅

