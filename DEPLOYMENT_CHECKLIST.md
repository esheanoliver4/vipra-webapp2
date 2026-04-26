# Deployment Checklist - Admin Dashboard System

## Pre-Deployment

### Database
- [ ] PostgreSQL database is accessible
- [ ] Supabase project is configured
- [ ] Environment variables are set

### Dependencies
- [ ] All npm packages installed
- [ ] Supabase client initialized
- [ ] API routes configured

## Database Setup

### Step 1: Run Migration
```bash
# Execute the migration script to add role field and create admin user
psql -U postgres -d your_database < scripts/add-role-to-users.sql
```

Verify:
- [ ] `role` column added to `users` table
- [ ] `approval_logs` table created
- [ ] Indexes created
- [ ] Admin user created

### Step 2: Update Admin Credentials
Before running migration, edit `scripts/add-role-to-users.sql`:

```sql
INSERT INTO users (...) VALUES (
  ...,
  'your-admin-email@example.com',  -- Change this
  'your-secure-password',          -- Change this
  ...
);
```

- [ ] Admin email changed
- [ ] Admin password changed to strong password
- [ ] Verified syntax is correct

## Application Deployment

### Frontend
- [ ] All components compile without errors
- [ ] Navigation menu displays correctly
- [ ] Admin link appears for admin users
- [ ] Mobile menu works on small screens

### API Routes
- [ ] `/api/admin/login` responds correctly
- [ ] `/api/admin/users` returns user list
- [ ] `/api/admin/users/[id]/approve` works
- [ ] `/api/admin/users/[id]/reject` works
- [ ] `/api/users/role` returns correct role

### Pages
- [ ] `/admin/login` page loads
- [ ] `/admin/dashboard` page loads
- [ ] User can login with correct credentials
- [ ] Admin cannot access with wrong role

## Testing

### Admin Login
- [ ] Navigate to `/admin/login`
- [ ] Enter admin credentials
- [ ] Successfully logged in
- [ ] Redirected to `/admin/dashboard`

### Admin Dashboard
- [ ] All users display in table
- [ ] Search works (name/email)
- [ ] Filter works (status)
- [ ] Statistics show correct counts
- [ ] View icon shows user details
- [ ] Approve button works
- [ ] Reject button works
- [ ] Modal opens and closes

### User Experience
- [ ] Regular users cannot access `/admin/login`
- [ ] Regular users cannot access `/admin/dashboard`
- [ ] Navbar shows admin link for admin users
- [ ] Navbar doesn't show admin link for regular users
- [ ] Mobile menu adapts correctly

### Database
- [ ] Check approval_logs table has entries
- [ ] Verify approval status updated correctly
- [ ] Check role field is set properly

## Production Checklist

### Security
- [ ] Change default admin password
- [ ] Verify HTTPS is enabled
- [ ] Check CORS settings
- [ ] Review API authentication
- [ ] Enable rate limiting on APIs

### Monitoring
- [ ] Set up error logging (Sentry/etc)
- [ ] Monitor API performance
- [ ] Track database query performance
- [ ] Set up backup system

### Documentation
- [ ] Admin team trained on dashboard
- [ ] Support team has access to guides
- [ ] Backup of migration script
- [ ] Recovery procedures documented

### Database
- [ ] Backup database before migration
- [ ] Test migration on staging first
- [ ] Verify backup restoration works
- [ ] Monitor disk space

## Post-Deployment

### Day 1
- [ ] Monitor for errors
- [ ] Check user registrations
- [ ] Verify approvals working
- [ ] Test all dashboard features
- [ ] Review logs for issues

### Week 1
- [ ] Review approval workflow
- [ ] Gather admin feedback
- [ ] Check database performance
- [ ] Monitor API response times

### Month 1
- [ ] Review approval statistics
- [ ] Optimize slow queries
- [ ] Plan feature enhancements
- [ ] Update documentation

## Rollback Plan

If deployment has issues:

### Database Rollback
```bash
# Restore from backup
pg_restore -U postgres -d your_database < backup.sql
```

### Application Rollback
- Revert to previous deployment
- Clear browser cache
- Restart application server

## Key Contacts

- **Database Admin**: [Your Name]
- **Application Owner**: [Your Name]
- **Admin Coordinator**: [Your Name]

## Notes

Use this space for deployment notes:

```
- Deployment Date: _______________
- Deployed By: _______________
- Database Version: _______________
- Issues Encountered: _______________
- Resolution: _______________
```

---

**Status**: Ready for Deployment
**Created**: 2026-04-25
**Version**: 1.0
