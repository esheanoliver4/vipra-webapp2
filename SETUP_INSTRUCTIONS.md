# VipraPariwar - Dating App Setup Guide

A premium matrimonial and dating platform for the Brahmin community with advanced features including Kundli Milan, admin approval system, and photo galleries.

## Features

✅ **User Authentication & Authorization**
- Secure registration and login with password reset
- Email verification
- Gender immutable after first selection

✅ **Admin Approval System**
- Pending profile review dashboard
- Email notifications to users on approval/rejection
- Admin notes for rejections

✅ **Dating Card System (Tinder-style)**
- Multiple photo gallery (up to 6 photos)
- Image carousel with navigation
- Short bio display on cards
- Like/Pass/Report actions

✅ **Profile Management**
- Comprehensive profile editing
- Multiple photo uploads with reordering
- Gender locking
- Professional and personal information

✅ **Kundli Milan**
- Astrological compatibility calculation
- Rashi and Nakshatra matching
- Compatibility scoring

✅ **Messaging & Connections**
- User connections management
- Direct messaging between matched users
- Conversation history

✅ **Admin Features**
- User approval dashboard
- Content moderation
- CMS for blogs, events, and success stories
- Referral tracking and rewards

## Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (free tier works)
- Gmail account for email notifications
- UploadThing account for image uploads (optional, can use Supabase Storage)

## Installation

### 1. Clone and Setup

```bash
git clone <repository-url>
cd viprapariwar
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required Variables:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (Gmail recommended)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="VipraPariwar <your-email@gmail.com>"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor and run the migration script:

```sql
-- Copy contents from scripts/03-add-approval-and-photos.sql
-- and paste into Supabase SQL editor
```

3. Enable Row Level Security (RLS) on tables if needed

#### Option B: Using Local PostgreSQL

```bash
# Make sure PostgreSQL is running
psql -U postgres -d viprapariwar < scripts/03-add-approval-and-photos.sql
```

### 4. Email Configuration

#### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (custom name)"
   - Copy the generated password
3. Use this password in `EMAIL_PASSWORD` environment variable

#### Alternative Email Services

- **SendGrid**: Update `src/lib/email-service.ts` to use SendGrid SDK
- **AWS SES**: Configure with AWS credentials
- **Resend**: Easy integration for transactional emails

### 5. File Uploads

#### Using UploadThing (Recommended)

1. Create account at https://uploadthing.com
2. Create an API key
3. Set `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`

#### Using Supabase Storage (Free Alternative)

Update `src/components/profile/EditProfileClient.tsx` to use Supabase Storage instead of UploadThing:

```typescript
// Use supabase.storage instead of uploadthing
```

### 6. Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Key File Locations

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, register, etc.)
│   ├── api/
│   │   ├── admin/        # Admin approval endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   └── profiles/     # Profile and image endpoints
│   ├── approval-pending/ # Pending approval page
│   ├── approval-rejected/# Rejected approval page
│   ├── browse/           # Card browsing page
│   ├── dashboard/        # User dashboard
│   ├── edit-profile/     # Profile editing
│   └── kundli-milan/     # Kundli Milan calculator
├── components/
│   ├── admin/           # Admin components
│   ├── auth/            # Auth forms
│   ├── cards/           # Dating card components
│   ├── profile/         # Profile components
│   └── landing/         # Landing page components
├── lib/
│   ├── email-service.ts # Email sending logic
│   ├── auth-client.ts   # Client-side auth
│   └── schemas.ts       # Validation schemas
└── middleware/
    └── approval.ts       # Approval middleware
```

## Database Schema

### User Table
- `id`: UUID primary key
- `email`: Unique email
- `gender`: Male/Female (immutable after selection)
- `gender_locked`: Boolean flag
- `is_approved`: Approval status
- `approval_status`: pending/approved/rejected
- Profile fields: profession, education, location, etc.

### ProfileImage Table
- `id`: UUID
- `user_id`: Reference to User
- `image_url`: S3/Supabase URL
- `order`: Display order (0-5)
- `is_primary`: Primary image flag

### ApprovalLog Table
- `id`: UUID
- `user_id`: Reference to User
- `admin_id`: Admin who approved
- `status`: submitted/approved/rejected
- `notes`: Admin notes
- `created_at`: Timestamp

### Like Table
- `id`: UUID
- `user_id`: Who liked
- `liked_user_id`: Who was liked
- `action`: like/pass/report
- Created at timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Request password reset
- `PUT /api/auth/reset-password` - Update password

### Profiles
- `GET /api/profiles/user` - Get current user profile
- `PUT /api/profiles/update` - Update profile
- `POST /api/profiles/images` - Upload image
- `DELETE /api/profiles/images/[id]` - Delete image
- `PATCH /api/profiles/images/[id]/primary` - Set primary image
- `PUT /api/profiles/images/reorder` - Reorder images

### Admin
- `GET /api/admin/approve-user` - Get pending users
- `POST /api/admin/approve-user` - Approve/reject user

## Customization

### Branding

Update colors in `tailwind.config.ts`:
```javascript
colors: {
  primary: '#c41e3a', // VipraPariwar red
  // ... other colors
}
```

### Email Templates

Edit `src/lib/email-service.ts` to customize email content

### Feature Flags

Add environment variables for feature toggles:
```env
NEXT_PUBLIC_ENABLE_REFERRAL=true
NEXT_PUBLIC_ENABLE_MESSAGING=true
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Self-Hosted

```bash
pnpm build
pnpm start
```

## Common Issues & Solutions

### "Email not sending"
- Verify Gmail App Password is correct
- Check firewall/network settings
- Enable "Less secure app access" (if not using App Password)

### "Images not uploading"
- Verify UploadThing credentials
- Check file size limits
- Ensure Supabase Storage has proper permissions

### "Users can't login"
- Check Supabase credentials
- Verify database connection
- Check user creation in profiles table

### "Approval emails not sent"
- Verify ADMIN_EMAIL is set
- Check email service configuration
- Review logs in email service

## Performance Optimization

- Enable image optimization with Next.js Image component
- Implement caching for profile browsing
- Use database indexes on frequently queried fields
- Implement pagination for user lists

## Security Best Practices

✅ Already implemented:
- Password hashing (Supabase Auth)
- CORS protection
- SQL injection prevention (parameterized queries)
- XSS protection (React escaping)
- Gender immutability after selection

⚠️ To add:
- Rate limiting on authentication endpoints
- File upload validation
- Content moderation filters
- Report/block user functionality
- Data encryption for sensitive fields

## Support & Contributing

For issues, feature requests, or contributions, please open an issue or pull request.

## License

Private - Proprietary code

## Next Steps

1. ✅ Complete initial setup
2. ✅ Run database migrations
3. ✅ Configure email service
4. ✅ Test registration and approval flow
5. ✅ Upload test images and verify gallery
6. ✅ Test Kundli Milan calculator
7. ✅ Deploy to Vercel

Happy coding! 🎉
