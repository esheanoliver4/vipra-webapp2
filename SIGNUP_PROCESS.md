# VipraPariwaar Signup Process Documentation

## Overview
The signup process is a comprehensive 5-step form designed to collect all necessary information for creating a Brahmin matrimonial profile.

## Signup Steps

### Step 1: Create Your Account
Collects basic authentication information:
- **Full Name** (minimum 2 characters)
- **Email Address** (valid email format)
- **Password** (strong password requirements):
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (!@#$%^&*)
- **Confirm Password** (must match password)

### Step 2: Personal Information
Gathers personal details:
- **Gender** (Male/Female)
- **Date of Birth** (YYYY-MM-DD format)
  - Must be valid date (no Feb 30th, etc.)
  - Cannot be in the future
  - Must be reasonable age (< 120 years)
- **Profile Is For** (self, sister, daughter, brother, son, friend, relative, other)

### Step 3: Brahmin Community Details
Community-specific information:
- **Rishi Gotra** (selected from 150+ options)
  - Common gotras prioritized: Vashistha, Kashyapa, Gautama, Bharadwaja, Vishvamitra, Atri, Bhrigu
- **Currently Practiced Gotra** (text input)
- **Religion** (text input, typically "Hinduism")
- **Caste** (text input, typically "Brahmin")

### Step 4: Birth Details
Astrological and location information:
- **City** (residence city)
- **Time of Birth** (HH:MM format for Kundli matching)
- **Place of Birth** (birth city/town)

### Step 5: Family Information
Family and professional details:
- **Father's Name** (required)
- **Mother's Name** (required)
- **Parents' Contact Number** (required)
- **Education** (optional, e.g., B.Tech, M.Com)
- **Profession** (optional, e.g., Software Engineer)
- **Terms & Conditions** (must agree to complete registration)

## Optional Fields (Can be filled later)
- Company Working At
- Mother Tongue
- Marital Status
- Hobbies & Interests
- School Name
- College Name

## Registration API

### Endpoint
```
POST /api/auth/register
```

### Request Body
All fields from the 5-step form are sent as JSON.

### Response
Success (201):
```json
{
  "message": "Registration successful!",
  "user": { "id": "...", "email": "..." },
  "profile": { "id": "...", "full_name": "..." }
}
```

Error (400):
```json
{
  "message": "Error description"
}
```

## Validation

### Password Strength Indicator
Real-time visual feedback as user types:
- ✓ At least 8 characters
- ✓ One uppercase letter
- ✓ One lowercase letter
- ✓ One number
- ✓ One special character

### Date Validation
- Regex: `^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
- Checks for actual valid dates
- Prevents future dates
- Validates age limits (18-120 years old)

### Email Validation
- Standard email format validation
- Checks for duplicate registrations

## Database Schema

User profiles are stored in the `profiles` table with fields:
- `id` (UUID, from auth.users)
- `email` (unique)
- `full_name`
- `gender`
- `date_of_birth`
- `gotra`
- `current_practiced_gotra`
- `religion`
- `caste`
- `city`
- `time_of_birth`
- `place_of_birth`
- `father_name`
- `mother_name`
- `parents_contact_number`
- `education`
- `profession`
- `company_working_at`
- `mother_tongue`
- `marital_status`
- `hobbies`
- `is_verified` (boolean, default: false)
- `subscription_status` (default: 'free')
- `created_at` (timestamp)

## User Experience Features

1. **Progress Bar** - Visual indication of completion (5 steps)
2. **Step Validation** - Each step validates before allowing next step
3. **Back Button** - Can navigate back to previous steps
4. **Password Strength Indicator** - Real-time feedback on password quality
5. **Error Messages** - Clear validation messages for each field
6. **Loading State** - Shows loading indicator during submission
7. **Responsive Design** - Works on all screen sizes

## After Registration

1. User is created in Supabase Auth
2. Profile is created in the profiles table
3. User receives confirmation to check email
4. Redirects to login page
5. User can log in with email and password
6. Can complete profile later with photos, bio, etc.

## Security

- Passwords are hashed by Supabase Auth
- Email verification can be enabled
- Service role key used for admin operations
- Input validation on both client and server
- CORS protection via API routes
