# Admin Dashboard - Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Run Database Migration
```bash
# Execute the migration script
psql -U postgres -d your_database < scripts/add-role-to-users.sql
```

### 2. Access Admin Login
- URL: `http://localhost:3000/admin/login`
- Email: `admin@viprepariwaar.com`
- Password: `admin@123` (change in production!)

### 3. View Dashboard
- After login, redirect to: `/admin/dashboard`
- See all users and statistics

## 📊 Dashboard Features

| Feature | Location | Action |
|---------|----------|--------|
| **Search** | Top left | Type name or email |
| **Filter** | Top right | Select status |
| **View User** | Actions | Click eye icon |
| **Approve** | Actions | Click check mark |
| **Reject** | Actions | Click X mark |
| **Stats** | Top panel | See totals |

## 🔑 Key URLs

| URL | Purpose |
|-----|---------|
| `/admin/login` | Admin login page |
| `/admin/dashboard` | User management |
| `/dashboard` | User dashboard (regular users) |

## 👥 User Roles

| Role | Access |
|------|--------|
| `user` | Browse, Dashboard, Profile, Messages |
| `admin` | All of above + Admin Dashboard |

## 📝 Database Fields

**Users Table:**
- `role` - 'user' or 'admin' (new field)

**New Table - approval_logs:**
- `user_id` - User being approved
- `admin_id` - Admin making decision
- `status` - 'approved' or 'rejected'
- `notes` - Reason for rejection
- `created_at` - When action occurred

## 🔐 Security

✓ Role-based access control
✓ Supabase authentication
✓ Audit trail logging
✓ Admin verification on all endpoints

## 🐛 Troubleshooting

**Can't login?**
- Verify email exists in users table
- Check password matches migration script
- Clear browser cache

**Can't see users?**
- Verify database migration ran
- Check user role is 'admin'
- Check browser console for errors

**Dashboard blank?**
- Verify database has users
- Check network tab for API errors
- Try page refresh

## 📱 Mobile Access

- Admin dashboard works on mobile
- Menu adapts automatically
- All features available on mobile

## 🎯 Admin Approval Workflow

```
User Registers → User Fills Profile → User Requests Approval
    ↓
Admin Sees Pending Request in Dashboard
    ↓
Admin Reviews User Profile & Documents
    ↓
Admin Clicks Approve/Reject
    ↓
Approval Status Updated
    ↓
User Receives Notification
```

## 💡 Pro Tips

1. **Search First** - Use search to find specific users
2. **Filter Status** - View pending approvals only
3. **View Details** - Click eye icon to see full profile
4. **Bulk Actions** - Currently one at a time, plan for bulk later
5. **Check Logs** - Approval history in database

## 🔗 Related Files

- `ADMIN_SETUP.md` - Full setup guide
- `ADMIN_IMPLEMENTATION_SUMMARY.md` - Technical details
- `scripts/add-role-to-users.sql` - Database migration
- `src/components/admin/UserManagementDashboard.tsx` - Dashboard component
- `src/app/api/admin/` - API endpoints

## ⚡ Common Tasks

### Approve User
1. Go to Dashboard
2. Find user in table
3. Click approval button
4. User gets approved

### Reject User
1. Go to Dashboard
2. Find user in table
3. Click rejection button
4. User gets rejected (optional: add notes)

### View Statistics
- Dashboard shows real-time stats
- Total, Pending, Approved, Rejected counts
- Updates automatically

### Search Users
- Type name or email in search box
- Results filter in real-time
- Case-insensitive search

## 📞 Support

For detailed information:
- Read `ADMIN_SETUP.md`
- Check database schema
- Review API endpoints in code
- Check browser developer tools

---

**Status**: Ready to use
**Last Update**: 2026-04-25
