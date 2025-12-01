# Design System - فروشگاه مایسا 🎨

## 📋 خلاصه سریع

| عنصر | مقدار |
|------|-------|
| آیکون‌ها | Lucide (outline, w-4 h-4 یا w-5 h-5) |
| Border Radius | rounded-xl, rounded-2xl |
| Spacing | gap-2, gap-3, p-3, p-4, px-4 |
| Typography | text-sm, text-xs, font-medium |
| States | hover:bg-gray-50, hover:text-primary |
| Badges | text-[10px], rounded-full |
| Buttons | h-10, h-12, rounded-xl |

---

## 🎨 رنگ‌ها (Colors)

### Primary Colors
```css
primary: #FF4444        /* قرمز اصلی */
primary/90: hover state
primary/10: background subtle
```

### Gray Scale
```css
gray-50: #F9FAFB   /* پس‌زمینه خیلی روشن */
gray-100: #F3F4F6  /* پس‌زمینه روشن، hover */
gray-200: #E5E7EB  /* border */
gray-300: #D1D5DB  /* border تیره‌تر */
gray-400: #9CA3AF  /* متن کم‌رنگ، آیکون غیرفعال */
gray-500: #6B7280  /* متن ثانویه */
gray-600: #4B5563  /* متن معمولی */
gray-700: #374151  /* متن تیره */
gray-900: #111827  /* متن اصلی، دکمه‌ها */
```

### Status Colors
```css
green-500: #10B981   /* موفقیت، موجود */
green-50: پس‌زمینه موفقیت
red-500: #EF4444     /* خطا، تخفیف */
red-50: پس‌زمینه خطا
blue-500: #3B82F6    /* اطلاعات */
blue-50: پس‌زمینه اطلاعات
yellow-400: #FBBF24  /* ستاره، امتیاز */
```

---

## 🔤 تایپوگرافی (Typography)

### Font Family
```css
font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
```

### Font Sizes (استفاده اصلی)
```css
text-xs: 0.75rem    /* 12px - بج‌ها، متن کمکی */
text-sm: 0.875rem   /* 14px - متن اصلی، دکمه‌ها */
text-base: 1rem     /* 16px - متن بزرگ‌تر */
text-lg: 1.125rem   /* 18px - عناوین کوچک */
text-xl: 1.25rem    /* 20px - عناوین صفحه */
text-2xl: 1.5rem    /* 24px - عناوین بزرگ */
```

### Font Weights
```css
font-medium: 500    /* متن معمولی مهم */
font-semibold: 600  /* عناوین کوچک */
font-bold: 700      /* عناوین اصلی */
```

---

## 🔘 دکمه‌ها (Buttons)

### Primary Button (Dark)
```tsx
className="h-12 px-6 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
```

### Primary Button (Color)
```tsx
className="h-12 px-6 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
```

### Secondary Button
```tsx
className="h-10 px-4 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
```

### Icon Button
```tsx
className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
```

### Danger Button
```tsx
className="h-10 px-4 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
```

### Disabled State
```tsx
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## 📦 کارت‌ها (Cards)

### Product Card
```tsx
className="bg-white rounded-2xl border border-gray-100 overflow-hidden group"
```

### Content Card
```tsx
className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-6"
```

### Info Box (Success)
```tsx
className="bg-green-50 border border-green-100 p-4 rounded-xl"
```

### Info Box (Info)
```tsx
className="bg-blue-50 border border-blue-100 p-4 rounded-xl"
```

---

## 📥 فرم‌ها (Forms)

### Input Field
```tsx
className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all"
```

### Textarea
```tsx
className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all h-28 resize-none"
```

### Input with Icon
```tsx
<div className="relative">
  <input className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl ..." />
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
</div>
```

### Label
```tsx
className="text-sm font-medium text-gray-700 mb-2 block"
```

---

## 🏷️ بج‌ها (Badges)

### Discount Badge
```tsx
className="bg-red-500 text-white text-[10px] font-medium px-2 py-1 rounded-full"
```

### Category Badge
```tsx
className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg"
```

### Status Badge (Success)
```tsx
className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium"
```

### Count Badge
```tsx
className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center"
```

---

## 🔗 لینک‌ها (Links)

### Text Link
```tsx
className="text-primary hover:text-primary/80 transition-colors"
```

### Card Link
```tsx
className="text-sm font-medium text-gray-900 hover:text-primary transition-colors"
```

### Breadcrumb Link
```tsx
className="text-sm text-gray-500 hover:text-primary transition-colors"
```

---

## 🖼️ تصاویر (Images)

### Product Image Container
```tsx
className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden"
```

### Image Hover Effect
```tsx
className="... group-hover:scale-105 transition-transform duration-300"
```

### Thumbnail
```tsx
className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors"
```

---

## 📏 فاصله‌گذاری (Spacing)

### Padding (استفاده اصلی)
```css
p-3: 0.75rem  /* 12px - کارت‌های کوچک */
p-4: 1rem     /* 16px - کارت‌های معمولی */
p-6: 1.5rem   /* 24px - بخش‌های بزرگ */
```

### Gap (استفاده اصلی)
```css
gap-1: 0.25rem /* 4px - آیتم‌های خیلی نزدیک */
gap-2: 0.5rem  /* 8px - آیتم‌های نزدیک */
gap-3: 0.75rem /* 12px - آیتم‌های معمولی */
gap-4: 1rem    /* 16px - بخش‌ها */
gap-6: 1.5rem  /* 24px - بخش‌های بزرگ */
```

---

## 🎭 Border Radius

### استفاده اصلی
```css
rounded-lg: 0.5rem    /* 8px - دکمه‌های کوچک */
rounded-xl: 0.75rem   /* 12px - دکمه‌ها، input‌ها */
rounded-2xl: 1rem     /* 16px - کارت‌ها */
rounded-full: 9999px  /* بج‌ها، آواتار */
```

---

## 🔄 انیمیشن‌ها (Animations)

### Transition
```css
transition-colors   /* تغییر رنگ */
transition-all      /* همه تغییرات */
duration-300        /* 300ms */
```

### Hover Scale
```css
group-hover:scale-105  /* تصاویر */
```

### Loading Spinner
```tsx
className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
```

---

## 📱 Breakpoints

```css
sm: 640px   /* موبایل بزرگ */
md: 768px   /* تبلت */
lg: 1024px  /* لپ‌تاپ */
xl: 1280px  /* دسکتاپ */
```

### Grid Patterns
```tsx
// Product Grid
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"

// Two Column Layout
className="grid grid-cols-1 lg:grid-cols-2 gap-6"
```

---

## 🎯 آیکون‌ها (Icons)

### Library
استفاده از **Lucide React** (outline style)

### Sizes
```css
w-4 h-4   /* آیکون‌های کوچک، داخل دکمه */
w-5 h-5   /* آیکون‌های معمولی */
w-10 h-10 /* آیکون‌های بزرگ، empty state */
```

### Common Icons
```tsx
import { 
  ShoppingCart, Heart, Star, Search, 
  Plus, Minus, Trash2, X, Check,
  ChevronLeft, ChevronRight, ChevronDown,
  Home, User, Package, Truck
} from 'lucide-react';
```

---

## ✅ Component Checklist

هر component باید:
- ✅ از Lucide icons استفاده کند
- ✅ rounded-xl یا rounded-2xl داشته باشد
- ✅ border border-gray-100 برای کارت‌ها
- ✅ text-sm برای متن اصلی
- ✅ h-10 یا h-12 برای دکمه‌ها
- ✅ hover:bg-gray-50 برای hover states
- ✅ transition-colors برای انیمیشن

---

## 🔧 Tools

- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Icon library
- **Next.js Image**: Image optimization
- **React Hot Toast**: Notifications
- **Swiper**: Carousels
