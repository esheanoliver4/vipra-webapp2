# VipraPariwaar - Matrimony Platform Setup Guide

## Project Overview

VipraPariwaar is a modern, elegant matrimony platform built specifically for the Brahmin community. It combines traditional matchmaking values with cutting-edge technology.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js Server Components & Actions
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Payments**: Stripe (subscription system)
- **File Storage**: Supabase Storage
- **Icons**: Lucide React

## Key Features

### 1. Authentication System
- User registration with email verification
- Secure login/logout
- Password reset functionality
- Role-based access control (Free/Silver/Gold members)

### 2. Profile Management
- Comprehensive profile creation with photos
- Edit profile information
- Profile visibility controls
- Bio data PDF download
- Family tree visualization

### 3. Discovery & Matching
- Advanced search with multiple filters (age, caste, city, education, etc.)
- Kundli Milan (astrological compatibility) calculator
- Profile browsing with photos
- Match recommendations

### 4. Connection System
- Send/receive connection requests
- Accept/reject connections
- Connection management dashboard
- Track mutual interests

### 5. Messaging
- Direct messaging between matched pairs
- Conversation history
- Message notifications

### 6. Subscription Plans
- **Free**: Limited connections, basic features
- **Silver**: Unlimited connections, priority visibility (1-3 months)
- **Gold**: Premium features, matchmaker support, priority support

### 7. Admin Dashboard
- User management
- Profile verification
- Subscription tracking
- Report management
- Content management

## File Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── admin/               # Admin dashboard
│   ├── browse/              # Browse profiles
│   ├── connections/         # Connection management
│   ├── dashboard/           # User dashboard
│   ├── edit-profile/        # Profile editing
│   ├── messages/            # Messaging
│   ├── pricing/             # Subscription pricing
│   ├── settings/            # User settings
│   ├── your-profile/        # View own profile
│   ├── kundli-milan/        # Kundli compatibility
│   ├── faq/                 # FAQ page
│   ├── about/               # About page
│   ├── api/                 # API routes
│   └── page.tsx             # Landing page
├── components/
│   ├── auth/                # Auth forms
│   ├── landing/             # Landing page sections
│   ├── dashboard/           # Dashboard components
│   ├── browse/              # Browse components
│   ├── profile/             # Profile components
│   ├── connections/         # Connection components
│   ├── messages/            # Messaging components
│   ├── pricing/             # Pricing components
│   ├── admin/               # Admin components
│   ├── kundli/              # Kundli components
│   ├── settings/            # Settings components
│   ├── Navbar.tsx           # Main navigation
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/            # Supabase utilities
│   ├── actions/             # Server actions
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── connections.ts
│   │   └── messaging.ts
│   └── utils.ts
├── app/
│   ├── globals.css          # Global styles with custom colors
│   └── layout.tsx           # Root layout
└── proxy.ts                 # Middleware configuration
```

## Color Scheme

- **Primary (Burgundy)**: #C97C7C (HSL: 9 71% 47%)
- **Secondary (Gold)**: #D4A574 (HSL: 28 72% 67%)
- **Cream**: #FAFBF9 (HSL: 0 0% 98%)
- **Dark Gray**: #2D3748 (HSL: 210 9% 18%)

These colors reflect elegance and tradition appropriate for a matrimonial platform.

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

# Other
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

The database schema is defined in `scripts/01-init-schema.sql`. Key tables:

- **profiles**: User profile information
- **connections**: Connection requests and status
- **messages**: Direct messages between users
- **subscriptions**: Subscription tracking
- **profile_images**: Multiple profile photos
- **admin_actions**: Admin moderation logs

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000`

## Key Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | Sign up |
| `/login` | Sign in |
| `/dashboard` | User dashboard |
| `/your-profile` | View own profile |
| `/edit-profile` | Edit profile |
| `/browse` | Browse matches |
| `/connections` | Connection management |
| `/messages` | Messaging |
| `/pricing` | Subscribe to plans |
| `/kundli-milan` | Compatibility calculator |
| `/admin` | Admin dashboard |
| `/settings` | User preferences |

## Modern Design Highlights

1. **Color Palette**: Burgundy + Gold theme reflecting tradition and elegance
2. **Typography**: Clean, readable fonts with proper hierarchy
3. **Components**: Responsive shadcn/ui components
4. **Dark Mode**: Full dark mode support with theme switcher
5. **Mobile First**: Fully optimized for all screen sizes
6. **Accessibility**: WCAG compliant with proper ARIA labels

## Features to Complete

- [ ] Complete Stripe payment integration
- [ ] Email notifications system
- [ ] Advanced search filters optimization
- [ ] Real-time messaging with WebSockets
- [ ] Admin reporting dashboard
- [ ] Success stories section
- [ ] Blog/resources section
- [ ] Mobile app (optional)

## Security Features

- Supabase Row Level Security (RLS) policies
- Secure authentication with JWT
- Password hashing with bcrypt
- HTTPS enforced in production
- SQL injection prevention via parameterized queries
- CSRF protection
- Rate limiting on API routes

## Performance Optimizations

- Server-side rendering for faster initial loads
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Caching strategies with Supabase
- Optimized database queries with proper indexing

## Support & Resources

- **Documentation**: Check `/faq` and `/about` pages
- **Contact**: support@viprapariwar.com
- **Support Dashboard**: Available in user settings

## Deployment

### To Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with `vercel deploy`

### To Other Platforms

Update `next.config.mjs` with platform-specific configurations.

## Future Enhancements

- AI-powered profile recommendations
- Video verification system
- Family approval workflow
- Success story marketplace
- Integration with marriage registration services
- Matchmaker portal
- Mobile apps (iOS/Android)

---

Built with ❤️ for the Brahmin community
