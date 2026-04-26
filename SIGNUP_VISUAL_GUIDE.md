# VipraPariwaar Signup - Visual & Feature Guide

## Signup Form Flow

```
START (Landing Page)
  ↓
[Sign Up Button] → /register
  ↓
╔════════════════════════════════════════╗
║  VipraPariwaar Signup - Step 1 of 5   ║
║                                        ║
║  Progress Bar: ████░░░░░░              ║
║                                        ║
║  Create Your Account                   ║
║  ─────────────────────                 ║
║  Full Name *        [___________]      ║
║  Email *            [___________]      ║
║  Password *         [___________] 👁️  ║
║  Confirm Password * [___________] 👁️  ║
║                                        ║
║  Password Strength:                    ║
║  ✓ At least 8 characters               ║
║  ✓ One uppercase letter                ║
║  ✓ One lowercase letter                ║
║  ✓ One number                          ║
║  ✓ One special character               ║
║                                        ║
║              [← Back] [Next →]         ║
╚════════════════════════════════════════╝
  ↓
╔════════════════════════════════════════╗
║  VipraPariwaar Signup - Step 2 of 5   ║
║                                        ║
║  Progress Bar: ████████░░░░░░░         ║
║                                        ║
║  Personal Information                  ║
║  ──────────────────────                ║
║  Gender *           [Male ▼]           ║
║  Date of Birth *    [____-__-__]       ║
║  Profile Is For *   [Self ▼]           ║
║                                        ║
║              [← Back] [Next →]         ║
╚════════════════════════════════════════╝
  ↓
╔════════════════════════════════════════╗
║  VipraPariwaar Signup - Step 3 of 5   ║
║                                        ║
║  Progress Bar: ████████████░░░░░░      ║
║                                        ║
║  Brahmin Community Details             ║
║  ──────────────────────────            ║
║  Rishi Gotra *      [Vashistha ▼]      ║
║  Practiced Gotra *  [___________]      ║
║  Religion *         [Hinduism  ]       ║
║  Caste *            [Brahmin   ]       ║
║                                        ║
║              [← Back] [Next →]         ║
╚════════════════════════════════════════╝
  ↓
╔════════════════════════════════════════╗
║  VipraPariwaar Signup - Step 4 of 5   ║
║                                        ║
║  Progress Bar: ████████████████░░░░░░  ║
║                                        ║
║  Birth Details                         ║
║  ──────────────                        ║
║  City *             [___________]      ║
║  Time of Birth *    [__:__]            ║
║  Place of Birth *   [___________]      ║
║                                        ║
║              [← Back] [Next →]         ║
╚════════════════════════════════════════╝
  ↓
╔════════════════════════════════════════╗
║  VipraPariwaar Signup - Step 5 of 5   ║
║                                        ║
║  Progress Bar: ████████████████████    ║
║                                        ║
║  Family Information                    ║
║  ──────────────────                    ║
║  Father's Name *    [___________]      ║
║  Mother's Name *    [___________]      ║
║  Contact Number *   [___________]      ║
║  Education         [___________]      ║
║  Profession        [___________]      ║
║                                        ║
║  ☐ I agree to terms & conditions      ║
║                                        ║
║  [← Back] [Complete Registration]    ║
╚════════════════════════════════════════╝
  ↓
[Processing...] 🔄
  ↓
✅ Success! Redirecting to Login...
  ↓
/login page
```

## Feature Highlights

### 1. Progress Indicator
- Visual progress bar showing current step (1-5)
- Shows "Step X of 5" text
- Users know exactly where they are in the process

### 2. Navigation
- **Next Button**: Validates current step, then advances
- **Back Button**: Navigate back to previous steps (changes text on step 1)
- **Complete Registration**: Final submission button on step 5

### 3. Password Strength Visual
```
As you type:
typing: "Pass"      → All ✗ (too short, no uppercase already there, etc.)
typing: "Password"  → ✓ uppercase, ✓ lowercase, ✗ number, ✗ special
typing: "Pass1@"    → ✓ uppercase, ✓ lowercase, ✓ number, ✓ special, ✓ length (8+)
```

### 4. Validation Feedback
- Real-time field validation
- Error messages appear below each invalid field
- Red text: "Field Name is required" or specific validation message
- Green checkmarks on password strength

### 5. Form State Management
- Disabled inputs during submission
- Loading spinner during API call
- Prevents double submissions

## Data Entry Examples

### Step 1 Example
```
Full Name: Rajesh Kumar Sharma
Email: rajesh.sharma@gmail.com
Password: SecurePass123!@
Confirm: SecurePass123!@
```

### Step 2 Example
```
Gender: Male
Date of Birth: 1995-08-15
Profile Is For: Myself
```

### Step 3 Example
```
Rishi Gotra: Vashistha
Practiced Gotra: Vashistha
Religion: Hinduism
Caste: Brahmin
```

### Step 4 Example
```
City: Bangalore
Time of Birth: 14:30
Place of Birth: Delhi
```

### Step 5 Example
```
Father's Name: Shri Rajendra Kumar Sharma
Mother's Name: Smt. Anita Sharma
Contact Number: +91-9876543210
Education: B.Tech (Computer Science)
Profession: Senior Software Engineer
```

## Error Examples

### Missing Required Field
```
Full Name *  [          ]
❌ Name must be at least 2 characters
```

### Invalid Email
```
Email *  [invalid.email]
❌ Please enter a valid email address
```

### Weak Password
```
Password Strength:
❌ At least 8 characters (only 5)
❌ One uppercase letter (none)
✓ One lowercase letter
❌ One number (none)
❌ One special character (none)
```

### Mismatched Passwords
```
Confirm Password *  [___________]
❌ Passwords don't match
```

### Invalid Date
```
Date of Birth *  [2025-05-20]
❌ Date of birth cannot be in the future
```

## API Response Examples

### Success (201)
```json
{
  "message": "Registration successful!",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "rajesh.sharma@gmail.com"
  },
  "profile": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "full_name": "Rajesh Kumar Sharma",
    "gender": "male",
    "gotra": "Vashistha"
  }
}
```

### Error (400)
```json
{
  "message": "Email already registered"
}
```

or

```json
{
  "message": "Password must contain at least one special character"
}
```

## Mobile Responsive Design

### Mobile View
- Single column layout
- Larger touch targets for inputs
- Full-width buttons
- Stackable progress bar
- Touch-friendly eye icon for password visibility
- Dropdown menus fully accessible

### Tablet View
- 2-column form grid where appropriate
- Better spacing
- Optimized for landscape orientation

### Desktop View
- Form card centered on page
- Max-width container
- Gradient background
- Side-by-side buttons
- Full decorative elements

## Accessibility Features

- Proper label associations with `htmlFor`
- ARIA labels on inputs
- Semantic HTML structure
- Color contrast compliance
- Keyboard navigation support
- Error message associations
- Required field indicators (*)

## Performance

- Component lazy loads Gotras dropdown options
- Optimized form validation
- No unnecessary re-renders
- Fast password strength checking
- Efficient error message updates

## Security

- No sensitive data in logs
- Passwords never logged
- Server-side validation enforced
- HTTPS required for production
- No credentials stored in localStorage
- Clean redirects after success

## Next Steps After Signup

1. ✅ User registered in Supabase Auth
2. ✅ Profile created with all information
3. ↓ User receives verification email
4. ↓ User logs in with credentials
5. ↓ Complete profile (add photos, bio, preferences)
6. ↓ Browse other profiles
7. ↓ Send connection requests
8. ↓ Start conversations
