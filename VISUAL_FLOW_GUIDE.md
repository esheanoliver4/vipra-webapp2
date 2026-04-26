# Visual Flow Guide - Feature Navigation

A comprehensive guide showing how users navigate through all new features.

---

## User Feature Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     VIPRAPARIWAAR DASHBOARD                     │
│                     (Authenticated User)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
              ┌──────────┬────────┬──────────┐
              │ Profile  │ Referral│ Explore │
              │  Edit    │ & Earn │ Content │
              └────┬─────┴───┬────┴────┬─────┘
                   │         │        │
        ┌──────────┘         │        └──────────────┐
        │                    │                       │
        ▼                    ▼                       ▼
    ┌────────────┐    ┌────────────────┐     ┌──────────────┐
    │ Family     │    │ Referral       │     │ Blog/News/  │
    │ Tree       │    │ Dashboard      │     │ Events      │
    │ Section    │    │                │     │             │
    └────────────┘    └────────────────┘     └──────────────┘
```

---

## Family Tree User Flow

```
START: User in Edit Profile
       │
       ▼
┌─────────────────────────────────────┐
│ Scroll to "Family Tree" Section     │
│ See existing family members (if any)│
└─────────────────────┬───────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │  View   │  │  Edit   │  │ Delete  │
    │ Members │  │ Details │  │ Member  │
    └────┬────┘  └────┬────┘  └────┬────┘
         │             │            │
         ▼             ▼            ▼
    Click on        Click Edit    Click Trash
    Member Card     Icon          Icon
         │             │            │
         └─────────────┴─────┬──────┘
                             │
                      ▼
              ┌──────────────────────┐
              │ Dialog Form Opens    │
              │ • Fill Details       │
              │ • Select Relation    │
              │ • Add Info           │
              └──────────┬───────────┘
                         │
                    ┌────┴────┐
                    │          │
                    ▼          ▼
              ┌─────────┐ ┌─────────┐
              │  Save   │ │ Cancel  │
              │ Member  │ │ Changes │
              └────┬────┘ └─────────┘
                   │
                   ▼
           Updated in Real-Time
                   │
                   ▼
         Show Success Toast
         "Member Added/Updated!"
```

---

## Referral Program User Flow

```
START: Dashboard
       │
       ▼
┌──────────────────────────────────────┐
│ Click "Refer & Earn" / Go to /referral│
└──────────────┬───────────────────────┘
               │
               ▼
        ┌─────────────────────────────┐
        │  Referral Dashboard Loads   │
        │  Shows:                     │
        │  • Referral Code (VIPRA...)  │
        │  • Stats (Referrals, Earnings)
        │  • Share Options            │
        └────────┬────────────────────┘
                 │
     ┌───────────┼───────────────────┬──────────┐
     │           │                   │          │
     ▼           ▼                   ▼          ▼
  ┌────────┐ ┌─────────┐    ┌──────────┐  ┌─────────┐
  │ Copy   │ │ Share   │    │  Email   │  │ Social  │
  │ Code   │ │ Link    │    │ Friends  │  │ Media   │
  └────┬───┘ └────┬────┘    └────┬─────┘  └────┬────┘
       │          │              │             │
       │          │              │             │
       ▼          ▼              ▼             ▼
    Copy to   Copy URL to   Friend's     Share on
    Clipboard Clipboard    Email Opens   Twitter/FB
       │          │              │             │
       └──────────┼──────────────┴─────────────┘
                  │
                  ▼
         Friend Gets Referral
         Code/Link
                  │
                  ▼
         Friend Signs Up
         Using Code
                  │
                  ▼
         ┌──────────────────────────┐
         │ Friend Completes        │
         │ Registration & Verification
         └────────┬─────────────────┘
                  │
                  ▼
         ┌──────────────────────────┐
         │ You Earn ₹500 Reward    │
         │ Status: Completed       │
         └────────┬─────────────────┘
                  │
                  ▼
         ┌──────────────────────────┐
         │ Reward in "Pending"      │
         │ See in Your Dashboard    │
         └────────┬─────────────────┘
                  │
                  ▼
         ┌──────────────────────────┐
         │ Click "Redeem Rewards"   │
         │ Choose Method:           │
         │ • Bank Transfer          │
         │ • Wallet                 │
         │ • Voucher                │
         └────────┬─────────────────┘
                  │
                  ▼
         Confirm Transaction
                  │
                  ▼
         Processing (5-7 days)
                  │
                  ▼
         ✓ Funds Received
```

---

## Admin Blog Management Flow

```
START: Admin at /admin
       │
       ▼
┌─────────────────────────────────────┐
│ Dashboard with Multiple Tabs        │
│ • Dashboard                         │
│ • Users    ← Current                │
│ • Blog     ← Select this             │
│ • Stories                           │
│ • Content  (Events & News)          │
└────────────┬────────────────────────┘
             │
             ▼
      ┌─────────────────────────────┐
      │ Click "Blog" Tab            │
      └────────┬────────────────────┘
               │
               ▼
      ┌─────────────────────────────┐
      │ Blog Management Interface   │
      │ Shows:                      │
      │ • Existing Posts Table      │
      │ • "New Post" Button         │
      └────────┬────────────────────┘
               │
         ┌─────┴──────┬──────────────┬─────────┐
         │            │              │         │
         ▼            ▼              ▼         ▼
    ┌────────┐   ┌────────┐   ┌────────┐  ┌──────┐
    │Create  │   │ Edit   │   │Delete  │  │Toggle│
    │New     │   │Existing│   │Post    │  │Publish
    │Post    │   │Post    │   │        │  │      │
    └────┬───┘   └────┬───┘   └────┬───┘  └───┬──┘
         │            │            │          │
         ▼            ▼            ▼          ▼
    Dialog Opens   Dialog Opens  Delete     Publish/
    with Form      with Prefilled Toast     Unpublish
         │            │            │          │
         ▼            ▼            ▼          ▼
    ┌──────────────────────────────────────┐
    │ Form Fields:                         │
    │ • Title *                            │
    │ • Slug                               │
    │ • Author                             │
    │ • Image URL                          │
    │ • Excerpt                            │
    │ • Content *                          │
    │ ☐ Publish Immediately                │
    │                                      │
    │ [Create/Update Post] [Cancel]        │
    └──────────────────────────────────────┘
         │
         ▼
    Save to Database
         │
         ▼
    Show Success Toast
    "Blog post created/updated!"
```

---

## Admin Success Stories Flow

```
START: Admin Dashboard
       │
       ▼
Click "Stories" Tab
       │
       ▼
┌──────────────────────────────────────┐
│ Success Stories Management           │
│ Shows:                               │
│ • Stories Table with:                │
│   - Couple Name                      │
│   - Story Title                      │
│   - Status (Published/Draft)         │
│   - Views                            │
│   - Actions (Edit/Feature/Publish)   │
│ • "New Story" Button                 │
└──────────┬───────────────────────────┘
           │
           ▼
   ┌──────────────────────────────────┐
   │ Click "New Story" Button         │
   └─────────┬────────────────────────┘
             │
             ▼
   ┌──────────────────────────────────┐
   │ Dialog Form Opens with:          │
   │ • Story Title                    │
   │ • Couple Name                    │
   │ • Couple Photo URL               │
   │ • Match Date                     │
   │ • Wedding Date                   │
   │ • Description                    │
   │ • Full Story Content             │
   │ ☐ Publish                        │
   │ ☐ Feature on Homepage            │
   │                                  │
   │ [Create Story] [Cancel]          │
   └──────────┬────────────────────────┘
              │
              ▼
       Save Story
              │
              ▼
       Show Table with
       New Story Added
              │
              ▼
       Use Action Buttons:
       │ Edit | ★ Feature | Publish |
```

---

## Admin Events & News Flow

```
START: Admin Dashboard
       │
       ▼
Click "Content" Tab
       │
       ▼
┌────────────────────────────────────┐
│ Two Sub-tabs:                      │
│ • Events                           │
│ • News                             │
└─────────┬────────────────────────┘
          │
   ┌──────┴──────┐
   │             │
   ▼             ▼
EVENTS          NEWS
   │             │
   ▼             ▼
┌─────────┐   ┌─────────┐
│Click    │   │Click    │
│"New     │   │"New     │
│Event"   │   │Article" │
└────┬────┘   └────┬────┘
     │             │
     ▼             ▼
EVENTS FORM    NEWS FORM
┌────────────────┐ ┌──────────────────┐
│• Title *       │ │• Title *         │
│• Description * │ │• Content *       │
│• Event Date *  │ │• Image URL       │
│• Location *    │ │☐ Publish         │
│• Image URL     │ │☐ Feature         │
│• Registration  │ │                  │
│  Link          │ │[Create]  [Cancel]│
│☐ Publish       │ │                  │
│                │ │                  │
│[Create] [Cancel] └──────────────────┘
└────────────────┘
     │                    │
     └────────┬───────────┘
              │
              ▼
      Both saved to Database
              │
              ▼
      Displayed in respective
      Event/News listings
              │
              ▼
      Manage with:
      Edit | Publish/Hide | Delete
```

---

## Content Access Flow (Public Users)

```
User on Homepage
      │
      ▼
┌──────────────────────────────────────┐
│ Navigation Menu Shows:               │
│ • Blog                               │
│ • Events                             │
│ • News                               │
│ • Success Stories                    │
└───┬──────────┬──────────┬────────┬───┘
    │          │          │        │
    ▼          ▼          ▼        ▼
  BLOG       EVENTS     NEWS    STORIES
    │          │          │        │
    ▼          ▼          ▼        ▼
┌─────────┐ ┌────────┐ ┌──────┐ ┌──────┐
│Posts    │ │Events  │ │News  │ │Couple│
│List     │ │List    │ │List  │ │Stories
│View/    │ │View/   │ │View/ │ │View  │
│Share    │ │Register│ │Share │ │Share │
└─────────┘ └────────┘ └──────┘ └──────┘
```

---

## Dashboard Sidebar Navigation

```
┌──────────────────────────┐
│  VIPRAPARIWAAR           │
│  Logged in: [User Name]  │
├──────────────────────────┤
│                          │
│ 🏠 Dashboard             │
│ 👤 My Profile            │
│ ✎️  Edit Profile          │
│ 🔍 Browse Profiles       │
│ 💌 Messages              │
│ 🤝 Connections           │
│ 🎁 Refer & Earn ⭐NEW     │
│ 👨‍👩‍👧‍👦 Family Tree ⭐NEW      │
│ 📰 Blog ⭐NEW             │
│ 🎉 Events ⭐NEW           │
│ 📰 News ⭐NEW             │
│ 🏆 Success Stories ⭐NEW  │
│ ⚙️  Settings              │
│ 🔐 Account Security      │
│ ℹ️  Help & Support        │
│ 🚪 Logout                │
│                          │
└──────────────────────────┘
```

---

## Admin Dashboard Tabs

```
┌────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD                                    │
│  You have admin access                             │
├────────────────────────────────────────────────────┤
│ [Dashboard] [Users] [Blog] [Stories] [Content]    │
├────────────────────────────────────────────────────┤
│                                                    │
│  Active Tab Content Displays Here:                 │
│  • Statistics                                      │
│  • Tables with Data                               │
│  • Management Forms                               │
│  • Action Buttons                                 │
│                                                    │
├────────────────────────────────────────────────────┤
│ Last Updated: March 15, 2024                      │
└────────────────────────────────────────────────────┘
```

---

## Responsive Design Breakpoints

### Desktop (1024px+)
```
┌─────────────────────────────────────┐
│    Navigation (Full Width)          │
├──────────────┬──────────────────────┤
│  Sidebar     │  Main Content Area   │
│  Navigation  │                      │
│              │  • Full Tables       │
│  • Menu      │  • All Features      │
│  • Profile   │  • Forms             │
│  • Settings  │  • Graphics          │
│              │                      │
└──────────────┴──────────────────────┘
```

### Tablet (768px - 1024px)
```
┌─────────────────────────┐
│  Mobile Menu (Hamburger)│
├─────────────────────────┤
│ Main Content Area       │
│ (Optimized Layout)      │
│                         │
│ • Stacked Forms        │
│ • Single Column Tables │
│ • Touch-friendly       │
│                         │
└─────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│ ☰ Menu | Search │
├──────────────────┤
│ Full Width       │
│ Content          │
│                  │
│ • Large Buttons  │
│ • Stacked Layout │
│ • Touch Optimized│
│                  │
│ Swipe for More   │
└──────────────────┘
```

---

## Color Scheme

### Primary Colors
```
Primary:     Blue/Purple (#3B82F6)
Secondary:   Teal (#06B6D4)
Accent:      Orange (#F97316)
Success:     Green (#22C55E)
Warning:     Yellow (#FBBF24)
Error:       Red (#EF4444)
```

### Component Colors
```
Blog Posts:      Blue (#3B82F6)
Success Stories: Purple (#A855F7)
Events:          Orange (#F97316)
News:            Green (#22C55E)
Referral:        Teal (#06B6D4)
Warnings:        Red (#EF4444)
```

---

## Animation States

### Loading
```
[⟳ Loading Dashboard...]  (Spinner animation)
```

### Hover Effects
```
Before: Card (flat)
After:  Card (shadow + scale up 2%)
```

### Success Toast
```
✓ Blog post created successfully!
(Appears for 3 seconds, then fades)
```

### Dialog Animations
```
Dialog Enters:  Fade in + Slide down
Dialog Exits:   Fade out + Slide up
```

---

## Key User Interactions

### Click Actions
- ✓ One-click copy for referral codes
- ✓ Single-click share to social media
- ✓ Quick toggle for publish/draft
- ✓ One-click feature/unfeature stories

### Form Validations
- Shows red outline if required field empty
- Real-time character count for text areas
- Auto-slug generation for blog titles
- Email format validation for invites

### Notifications
- Success: Green toast with checkmark
- Error: Red toast with alert
- Info: Blue toast with info icon
- Warning: Yellow toast with caution icon

---

**Last Updated**: March 2024  
**Status**: Complete & Ready for User Testing
