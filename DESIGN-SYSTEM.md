# Design System - فروشگاه مایسا 🎨

## 🎨 رنگ‌ها (Colors)

### Primary Colors
```css
primary: #FF4444        /* قرمز اصلی */
primary-dark: #CC0000   /* قرمز تیره */
primary-light: #FF6666  /* قرمز روشن */
```

### Secondary Colors
```css
secondary: #1a1a1a      /* مشکی */
secondary-light: #333333 /* خاکستری تیره */
```

### Neutral Colors
```css
white: #FFFFFF
gray-50: #F9FAFB
gray-100: #F3F4F6
gray-200: #E5E7EB
gray-300: #D1D5DB
gray-400: #9CA3AF
gray-500: #6B7280
gray-600: #4B5563
gray-700: #374151
gray-800: #1F2937
gray-900: #111827
black: #000000
```

### Status Colors
```css
success: #10B981   /* سبز */
error: #EF4444     /* قرمز */
warning: #F59E0B   /* نارنجی */
info: #3B82F6      /* آبی */
```

---

## 📝 تایپوگرافی (Typography)

### Font Family
```css
font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
```

### Font Sizes
```css
text-xs: 0.75rem    /* 12px */
text-sm: 0.875rem   /* 14px */
text-base: 1rem     /* 16px */
text-lg: 1.125rem   /* 18px */
text-xl: 1.25rem    /* 20px */
text-2xl: 1.5rem    /* 24px */
text-3xl: 1.875rem  /* 30px */
text-4xl: 2.25rem   /* 36px */
text-5xl: 3rem      /* 48px */
text-6xl: 3.75rem   /* 60px */
```

### Font Weights
```css
font-normal: 400
font-semibold: 600
font-bold: 700
```

---

## 🔘 دکمه‌ها (Buttons)

### Primary Button
```tsx
className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark hover:scale-105 transition-all duration-200 shadow-lg"
```

### Secondary Button
```tsx
className="border border-gray-300 text-secondary px-6 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
```

### Icon Button
```tsx
className="bg-primary text-white p-2.5 rounded-full hover:bg-primary-dark hover:scale-110 transition-all duration-200 shadow-md"
```

### Disabled State
```tsx
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## 📦 کارت‌ها (Cards)

### Product Card
```tsx
className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-primary/20"
```

### Content Card
```tsx
className="bg-white rounded-lg shadow-md p-6"
```

### Featured Card
```tsx
className="bg-white rounded-lg shadow-lg p-8 border-2 border-primary"
```

---

## 📥 فرم‌ها (Forms)

### Input Field
```tsx
className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
```

### Textarea
```tsx
className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
rows={4}
```

### Select
```tsx
className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
```

### Label
```tsx
className="block text-sm font-semibold mb-2"
```

---

## 🏷️ بج‌ها (Badges)

### Discount Badge
```tsx
className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
```

### Category Badge
```tsx
className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold"
```

### Status Badge
```tsx
className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold"
```

---

## 🔗 لینک‌ها (Links)

### Text Link
```tsx
className="text-primary hover:underline transition-colors"
```

### Button Link
```tsx
className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
```

### Nav Link
```tsx
className="text-secondary hover:text-primary transition-colors font-medium"
```

---

## 🖼️ تصاویر (Images)

### Product Image
```tsx
<Image
  src={src}
  alt={alt}
  fill
  className="object-cover group-hover:scale-105 transition-transform duration-500"
/>
```

### Hero Image
```tsx
<Image
  src={src}
  alt={alt}
  fill
  className="object-cover brightness-75"
  priority
/>
```

---

## 📏 فاصله‌گذاری (Spacing)

### Padding
```css
p-2: 0.5rem   /* 8px */
p-4: 1rem     /* 16px */
p-6: 1.5rem   /* 24px */
p-8: 2rem     /* 32px */
p-12: 3rem    /* 48px */
```

### Margin
```css
m-2: 0.5rem   /* 8px */
m-4: 1rem     /* 16px */
m-6: 1.5rem   /* 24px */
m-8: 2rem     /* 32px */
m-12: 3rem    /* 48px */
```

### Gap
```css
gap-2: 0.5rem  /* 8px */
gap-4: 1rem    /* 16px */
gap-6: 1.5rem  /* 24px */
gap-8: 2rem    /* 32px */
```

---

## 🎭 سایه‌ها (Shadows)

### Shadow Levels
```css
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
```

---

## 🔄 انیمیشن‌ها (Animations)

### Transition Duration
```css
duration-200: 200ms  /* سریع */
duration-300: 300ms  /* متوسط */
duration-500: 500ms  /* کند */
```

### Hover Scale
```css
hover:scale-105  /* کارت‌ها */
hover:scale-110  /* دکمه‌ها و آیکون‌ها */
```

### Fade In
```css
animate-fade-in
```

### Bounce
```css
animate-bounce
```

### Pulse
```css
animate-pulse
```

---

## 📱 Breakpoints

```css
sm: 640px   /* موبایل بزرگ */
md: 768px   /* تبلت */
lg: 1024px  /* لپ‌تاپ */
xl: 1280px  /* دسکتاپ */
2xl: 1536px /* دسکتاپ بزرگ */
```

---

## ♿ Accessibility

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-primary/20
focus-visible:outline-2
focus-visible:outline-primary
```

### ARIA Labels
```tsx
aria-label="توضیح"
```

### Alt Text
```tsx
alt="توضیح کامل تصویر"
```

---

## 🎯 Best Practices

### 1. Consistency
- همیشه از رنگ‌های تعریف شده استفاده کنید
- از spacing system پیروی کنید
- از component patterns استفاده کنید

### 2. Performance
- از Next.js Image برای تصاویر
- Lazy loading برای محتوای زیر fold
- Optimize animations

### 3. Accessibility
- همیشه alt text برای تصاویر
- ARIA labels برای interactive elements
- Keyboard navigation support

### 4. Responsive
- Mobile-first approach
- Test در تمام breakpoints
- Touch-friendly buttons (min 44x44px)

---

## 📋 Component Checklist

هر component باید:
- ✅ Responsive باشد
- ✅ Accessible باشد
- ✅ Loading state داشته باشد
- ✅ Error state داشته باشد
- ✅ Hover/Focus states داشته باشد
- ✅ از Design System پیروی کند

---

## 🔧 Tools

- **Tailwind CSS**: Utility-first CSS
- **React Icons**: Icon library
- **Next.js Image**: Image optimization
- **React Hot Toast**: Notifications
- **Swiper**: Carousels

---

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn)
