# CSS Utilities and Animation Reference

## Quick Start - Common Patterns

### Hero Section
```html
<div class="min-h-screen bg-gradient-to-b from-red-50 to-pink-50">
  <h1 class="text-gradient-red-pink text-5xl font-bold animate-fadeInDown">
    Your Title
  </h1>
  <p class="text-gray-600 animate-slideInUp">Subtitle</p>
</div>
```

### Card Component
```html
<div class="card-gradient-light rounded-2xl shadow-xl p-6 animate-scaleIn hover-lift">
  <h2 class="text-gradient-red-pink text-2xl font-bold">Title</h2>
  <p class="text-gray-600 mt-2">Content</p>
</div>
```

### CTA Button
```html
<button class="btn-gradient-primary text-lg font-bold hover-lift hover-glow-red">
  Click Me
</button>
```

### List with Stagger Animation
```html
<div class="space-y-4">
  <div class="animate-slideInUp stagger-100">Item 1</div>
  <div class="animate-slideInUp stagger-200">Item 2</div>
  <div class="animate-slideInUp stagger-300">Item 3</div>
</div>
```

---

## All Available Classes

### Background Gradients
| Class | Purpose |
|-------|---------|
| `.bg-gradient-red-pink` | Main red to pink gradient |
| `.bg-gradient-red-pink-dark` | Dark red to dark pink |
| `.bg-gradient-rose-pink` | Light rose to light pink |
| `.bg-gradient-pink-rose` | Pink to rose gradient |

### Text Gradients
| Class | Purpose |
|-------|---------|
| `.text-gradient-red-pink` | Red-pink text gradient |

### Button Styles
| Class | Purpose |
|-------|---------|
| `.btn-gradient-primary` | Primary gradient button |
| `.btn-secondary` | White with red border |
| `.btn-accent` | Pink gradient button |

### Card Styles
| Class | Purpose |
|-------|---------|
| `.card-gradient-light` | Light rose-pink card |
| `.card-elevated` | White card with elevation |

### Animations (Entrance)
| Class | Duration | Effect |
|-------|----------|--------|
| `.animate-fadeInDown` | 0.6s | Fade + slide down |
| `.animate-fadeInUp` | 0.6s | Fade + slide up |
| `.animate-slideInUp` | 0.6s | Slide from bottom |
| `.animate-slideInDown` | 0.6s | Slide from top |
| `.animate-slideInLeft` | 0.6s | Slide from left |
| `.animate-slideInRight` | 0.6s | Slide from right |
| `.animate-scaleIn` | 0.5s | Scale up entrance |
| `.animate-bounceIn` | 0.7s | Bounce entrance |

### Animations (Continuous)
| Class | Duration | Effect |
|-------|----------|--------|
| `.animate-heartBeat` | 1.3s | Pulse heart effect |
| `.animate-pulseGlow` | 2s | Pulsing glow |
| `.animate-gradientFlow` | 3s | Gradient shift |
| `.animate-spin-slow` | 3s | Slow rotation |

### Hover Effects
| Class | Effect |
|-------|--------|
| `.hover-lift` | Lifts 4px + shadow |
| `.hover-scale` | Scales to 105% |
| `.hover-glow-red` | Red box shadow |

### Stagger Delays
| Class | Delay |
|-------|-------|
| `.stagger-100` | 0.1s |
| `.stagger-200` | 0.2s |
| `.stagger-300` | 0.3s |
| `.stagger-400` | 0.4s |
| `.stagger-500` | 0.5s |

---

## Responsive Classes (Tailwind)

### Display
```html
<!-- Hide on mobile, show on tablet+ -->
<div class="hidden md:flex">...</div>

<!-- Show on mobile, hide on tablet+ -->
<div class="md:hidden">...</div>
```

### Spacing
```html
<!-- Responsive padding -->
<div class="px-4 sm:px-6 lg:px-8">...</div>
<div class="py-6 sm:py-8 lg:py-12">...</div>

<!-- Responsive margin -->
<div class="mb-4 sm:mb-6 lg:mb-8">...</div>
```

### Typography
```html
<!-- Responsive text size -->
<h1 class="text-3xl sm:text-4xl md:text-5xl">...</h1>
<p class="text-sm sm:text-base md:text-lg">...</p>
```

### Grid Layouts
```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Items -->
</div>

<!-- 2 columns on mobile, 3 on tablet -->
<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
  <!-- Items -->
</div>
```

---

## Tailwind Breakpoints

| Breakpoint | Screen Size | Class Prefix |
|-----------|-------------|--------------|
| Default | < 640px | (no prefix) |
| `sm` | ≥ 640px | `sm:` |
| `md` | ≥ 768px | `md:` |
| `lg` | ≥ 1024px | `lg:` |
| `xl` | ≥ 1280px | `xl:` |
| `2xl` | ≥ 1536px | `2xl:` |

---

## Color Palette

### Primary Colors
- Red: `#EF4444` (text-red-500)
- Red Dark: `#DC2626` (text-red-600)
- Pink: `#EC4899` (text-pink-500)
- Pink Dark: `#BE185D` (text-pink-800)

### Light Backgrounds
- Rose 50: `#FEE2E2`
- Pink 50: `#FCE7F3`

### Neutrals
- Gray 50: `#F9FAFB`
- Gray 100: `#F3F4F6`
- Gray 600: `#4B5563`
- White: `#FFFFFF`

---

## Animation Timing

### Standard Durations
- Fast: 0.3s (interactions)
- Medium: 0.5s - 0.6s (entrances)
- Slow: 1.3s - 3s (continuous)

### Easing Functions
- `ease-out`: Start fast, end slow (entrances)
- `ease-in-out`: Balanced (continuous)
- `ease-linear`: Constant speed (rotations)

---

## Layout Patterns

### Full-Width Page
```html
<div class="min-h-screen bg-gradient-to-b from-red-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  <div class="max-w-4xl mx-auto">
    <!-- Content -->
  </div>
</div>
```

### Responsive Container
```html
<div class="max-w-2xl mx-auto px-4">
  <!-- Content centered and responsive -->
</div>
```

### Two-Column Layout
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### Three-Column Layout
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## Performance Tips

1. **Use CSS animations for simple effects** - Faster than JavaScript
2. **Limit animations on mobile** - Reduce motion for battery life
3. **Debounce scroll events** - Prevents excessive re-renders
4. **Use `will-change` sparingly** - Only on frequently animated elements
5. **Prefers-reduced-motion** - Respect user accessibility settings

---

## Mobile-First Best Practices

1. **Start with single column** (mobile)
2. **Add columns at tablet breakpoint** (`sm:` or `md:`)
3. **Optimize for desktop** (`lg:` and `xl:`)
4. **Touch targets minimum 44x44px**
5. **Use larger text on mobile** - Start bigger, reduce on desktop if needed
6. **Full-width cards** with horizontal padding
7. **Vertical spacing** for mobile (stacked layout)
8. **Animations** should be 0.3-0.6s on mobile

---

## Common Component Patterns

### Featured Card
```html
<div class="card-gradient-light border-0 rounded-2xl shadow-xl p-6 hover-lift">
  <h3 class="text-2xl font-bold text-gradient-red-pink mb-4">Title</h3>
  <p class="text-gray-600 mb-6">Description</p>
  <button class="btn-gradient-primary w-full">Action</button>
</div>
```

### Gradient Header
```html
<div class="bg-gradient-red-pink text-white rounded-t-2xl py-8 px-6">
  <h1 class="text-3xl font-bold">Title</h1>
  <p class="text-white/90 mt-2">Subtitle</p>
</div>
```

### Loading State
```html
<div class="animate-spin">
  <div class="w-12 h-12 rounded-full bg-gradient-red-pink opacity-30 animate-pulse"></div>
</div>
```

### Success Message
```html
<div class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
  <p class="text-green-700 font-semibold">Success!</p>
</div>
```

### Error Message
```html
<div class="bg-red-50 border-2 border-red-200 rounded-lg p-4">
  <p class="text-red-700 font-semibold">Error occurred</p>
</div>
```

---

## Testing Responsive Design

### Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or custom size
4. Test at different breakpoints

### Real Devices
- Test on actual mobile (iOS/Android)
- Check orientation changes
- Verify touch interactions
- Monitor performance

### Common Viewport Sizes
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1440px, 1920px

---

## Browser Compatibility

### Modern Browsers (Full Support)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### CSS Features Used
- CSS Gradients ✓
- CSS Grid ✓
- CSS Flexbox ✓
- CSS Animations ✓
- CSS Variables ✓
- CSS Transitions ✓

---

## Customization

### Change Primary Color
Edit `/src/app/globals.css`:
```css
--red-primary: #YOUR_COLOR;
--pink-accent: #YOUR_COLOR;
```

### Add New Animation
```css
@keyframes myAnimation {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-myAnimation {
  animation: myAnimation 0.5s ease-out forwards;
}
```

### Create New Gradient
```css
.bg-gradient-custom {
  background: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

---

## Support & Documentation

- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Responsive Design**: https://www.smashingmagazine.com/mobile-first-css

---

Generated: 2026-04-24
Last Updated: Design and CSS Updates v1.0
