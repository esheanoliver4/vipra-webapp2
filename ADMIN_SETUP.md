# Admin System Setup Guide

## Overview
This guide explains how to set up and use the admin dashboard for managing user approvals.

## Database Setup

### 1. Run Migration Script
Execute the SQL migration to add role field and create admin user:

```bash
# Connect to your database and run:
psql -U postgres -d your_db < scripts/add-role-to-users.sql
```

This will:
- Add `role` column to users table
- Create approval_logs table
- Add initial admin user (email: admin@viprepariwaar.com)

### 2. Update Admin Credentials
Replace the admin email and password in the script before running:
```sql
INSERT INTO users (...) VALUES (
  ...,
  'your-admin@email.com',  -- Change this
  'YourAdminPassword',      -- Change this
  ...
);
```

## Login

### Admin Portal
- URL: `/admin/login`
- Email: admin@viprepariwaar.com (or your custom email)
- Password: Set in migration script

### User Dashboard
- URL: `/dashboard`
- For regular users after approval

## Admin Dashboard Features

### 1. User Management
- View all registered users
- Filter by status: Pending, Approved, Rejected
- Search by name or email
- View user details

### 2. Approval System
- View pending approval requests
- Approve user profiles
- Reject with optional notes
- Track approval history

### 3. Statistics
- Total users
- Pending approvals
- Approved users
- Rejected users

## User Approval Workflow

1. User registers and fills profile
2. User uploads identity documents
3. User requests approval via dashboard
4. Admin sees request in dashboard
5. Admin reviews user profile and documents
6. Admin approves or rejects
7. User receives notification

## Database Schema

### Users Table Changes
```sql
role VARCHAR(50) DEFAULT 'user'  -- 'user' or 'admin'
```

### New Tables
- `approval_logs` - Tracks all approval/rejection actions

## API Endpoints

### Admin Authentication
- `POST /api/admin/login` - Admin login

### User Management
- `GET /api/admin/users` - List all users (admin only)
- `PATCH /api/admin/users/[id]/approve` - Approve user
- `PATCH /api/admin/users/[id]/reject` - Reject user

### User Role
- `GET /api/users/role?email=user@email.com` - Get user role

## Security Features

1. **Role-Based Access Control**
   - Only users with role='admin' can access admin features
   - Protected API endpoints verify admin role

2. **Authentication**
   - Supabase Auth for secure login
   - Session management

3. **Audit Trail**
   - approval_logs table tracks all actions
   - Records admin ID, timestamp, and action

## Navigation

### Regular User Menu (Desktop)
- Browse
- Dashboard
- Edit Profile
- Connections
- Messages
- Settings
- Logout

### Admin User Menu (Desktop)
- All regular user menu items
- Admin Dashboard (shield icon)

## Troubleshooting

### Login Not Working
1. Verify admin user exists in database
2. Check email matches exactly
3. Verify password in migration script

### Can't See Admin Dashboard
1. Check user role is set to 'admin'
2. Reload page after login
3. Clear browser cache

### Approval Not Updating
1. Check database connectivity
2. Verify user ID exists
3. Check browser console for errors

## Next Steps

1. Run migration script
2. Create admin account
3. Navigate to `/admin/login`
4. Login with admin credentials
5. Access dashboard at `/admin/dashboard`
6. Start approving users!

