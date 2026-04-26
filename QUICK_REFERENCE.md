# Quick Reference Card - CSS & Design

## Copy-Paste Ready Code Snippets

### Hero Section
```jsx
<div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
  <div className="max-w-4xl mx-auto text-center animate-fadeInDown">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-red-pink mb-4">
      Amazing Title
    </h1>
    <p className="text-lg sm:text-xl text-gray-600 mb-8 animate-slideInUp">
      Subtitle goes here
    </p>
    <button className="btn-gradient-primary text-lg hover-lift">Get Started</button>
  </div>
</div>
```

### Feature Card Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {[1, 2, 3].map((i) => (
    <div key={i} className="card-gradient-light rounded-2xl shadow-xl p-6 hover-lift animate-scaleIn stagger-{i}00">
      <div className="w-12 h-12 bg-gradient-red-pink rounded-full mb-4"></div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Feature {i}</h3>
      <p className="text-gray-600">Description of feature here.</p>
    </div>
  ))}
</div>
```

### Animated List
```jsx
<div className="space-y-4">
  {items.map((item, i) => (
    <div key={i} className={`animate-slideInUp stagger-${(i+1)*100} bg-white rounded-lg p-4 border-l-4 border-gradient-red-pink hover-scale`}>
      <h4 className="font-bold text-gray-900">{item.title}</h4>
      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
    </div>
  ))}
</div>
```

### Form Input with Label
```jsx
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">Input Label</label>
  <input
    type="text"
    placeholder="Enter text..."
    className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all duration-300"
  />
</div>
```

### CTA Button Section
```jsx
<div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 sm:p-12 text-center border-2 border-red-200 animate-slideInUp">
  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
  <p className="text-gray-600 mb-6">Join thousands of happy users today.</p>
  <button className="btn-gradient-primary text-lg font-bold hover-glow-red">Sign Up Now</button>
</div>
```

### Responsive Navigation
```jsx
<nav className="bg-gradient-red-pink text-white sticky top-0 z-50 shadow-lg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
    <div className="text-xl sm:text-2xl font-bold">Logo</div>
    <div className="hidden md:flex gap-6">
      <a href="#" className="hover:text-white/80 transition-colors">Link 1</a>
      <a href="#" className="hover:text-white/80 transition-colors">Link 2</a>
    </div>
    <button className="btn-secondary md:hidden">Menu</button>
  </div>
</nav>
```

### Loading Spinner
```jsx
<div className="flex items-center justify-center h-screen">
  <div className="animate-spin">
    <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full"></div>
  </div>
</div>
```

### Success Message
```jsx
<div className="bg-green-50 border-l-4 border-green-500 p-4 rounded animate-slideInUp">
  <p className="text-green-700 font-semibold">✓ Success! Your changes have been saved.</p>
</div>
```

### Error Message
```jsx
<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-slideInUp">
  <p className="text-red-700 font-semibold">✗ Error! Please try again.</p>
</div>
```

---

## Color Swatches

```
Red Primary:     #EF4444 | text-red-500 | bg-red-500
Red Dark:        #DC2626 | text-red-600 | bg-red-600
Pink Accent:     #EC4899 | text-pink-500 | bg-pink-500
Pink Dark:       #BE185D | text-pink-800 | bg-pink-800
Light Rose:      #FEE2E2 | bg-rose-100
Light Pink:      #FCE7F3 | bg-pink-100
```

---

## Responsive Classes

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| `text-3xl` | `sm:text-4xl` | `md:text-5xl` |
| `px-4` | `sm:px-6` | `lg:px-8` |
| `py-6` | `sm:py-8` | `lg:py-12` |
| `grid-cols-1` | `sm:grid-cols-2` | `lg:grid-cols-3` |
| `gap-4` | `sm:gap-5` | `lg:gap-6` |
| `hidden` | `sm:block` | (show default) |

---

## Common Animations

| Use Case | Animation | Duration |
|----------|-----------|----------|
| Page load | `.animate-fadeInDown` | 0.6s |
| Form appear | `.animate-slideInUp` | 0.6s |
| Card hover | `.hover-lift` | 0.3s |
| Button click | `.animate-bounceIn` | 0.7s |
| Loading | `.animate-spin-slow` | 3s |
| Like button | `.animate-heartBeat` | 1.3s |

---

## Tailwind Breakpoints

```
Mobile:  < 640px     (default, no prefix)
Tablet:  640px       (sm:)
Desktop: 768px+      (md:)
Large:   1024px+     (lg:)
XL:      1280px+     (xl:)
2XL:     1536px+     (2xl:)
```

---

## Grid Patterns

### 2-Column (Toggle at tablet)
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>Col 1</div>
  <div>Col 2</div>
</div>
```

### 3-Column (Mobile to Desktop)
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Stacked (Full width)
```html
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## Common Patterns

### Container
```html
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  Content here
</div>
```

### Centered Content
```html
<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">Content</div>
</div>
```

### Card
```html
<div class="bg-white rounded-lg shadow-lg p-6 hover-lift">
  Content
</div>
```

### Section with Background
```html
<section class="bg-gradient-rose-pink py-12 sm:py-16 lg:py-20">
  <div class="max-w-4xl mx-auto px-4">
    Content
  </div>
</section>
```

---

## Button Variants

### Primary (Red-Pink)
```html
<button class="btn-gradient-primary">Click Me</button>
```

### Secondary (White with Border)
```html
<button class="btn-secondary">Secondary</button>
```

### Accent (Pink)
```html
<button class="btn-accent">Accent</button>
```

### With Hover Effect
```html
<button class="btn-gradient-primary hover-lift hover-glow-red">
  Click Me
</button>
```

---

## Text Styling

### Gradient Text
```html
<h1 class="text-gradient-red-pink text-4xl font-bold">
  Gradient Text
</h1>
```

### Large Heading (Responsive)
```html
<h1 class="text-3xl sm:text-4xl md:text-5xl font-bold">
  Responsive Heading
</h1>
```

### Body Text
```html
<p class="text-gray-600 leading-relaxed">
  Body text with good readability
</p>
```

---

## Mobile Tips

1. **Touch targets**: Minimum 44x44px
2. **Padding**: Use `px-4` on mobile, increase at tablet
3. **Grid**: Always start with `grid-cols-1`
4. **Text**: Smaller on mobile (`text-sm`), larger on desktop
5. **Images**: Responsive heights (`h-80 sm:h-96`)
6. **Gaps**: Smaller gaps on mobile (`gap-3 sm:gap-4`)

---

## Performance Notes

- ✅ CSS animations (faster)
- ✅ Transform properties (smooth)
- ✅ Opacity changes (lightweight)
- ❌ Width/height changes (slower)
- ❌ Left/right changes (slower)
- ❌ Box-shadow on hover (expensive)

---

## Testing Checklist

- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640-1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Check landscape mode
- [ ] Verify animations are smooth
- [ ] Test touch interactions
- [ ] Check loading time
- [ ] Verify accessibility

---

## Useful Tailwind Docs

- [Colors](https://tailwindcss.com/docs/colors)
- [Spacing](https://tailwindcss.com/docs/padding)
- [Typography](https://tailwindcss.com/docs/font-size)
- [Responsive](https://tailwindcss.com/docs/responsive-design)
- [Animations](https://tailwindcss.com/docs/animation)

---

**Version**: 1.0
**Last Updated**: April 24, 2026
**For More**: See DESIGN_AND_CSS_UPDATES.md
