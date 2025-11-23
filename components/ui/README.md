# UI Components 🎨

این فولدر شامل کامپوننت‌های UI قابل استفاده مجدد است.

---

## 📦 کامپوننت‌ها

### 1. Breadcrumb
**مسیر:** `components/ui/Breadcrumb.tsx`

**استفاده:**
```tsx
import Breadcrumb from '@/components/ui/Breadcrumb';

<Breadcrumb items={[
  { label: 'فروشگاه', href: '/shop' },
  { label: 'محصول' }
]} />
```

**Props:**
- `items`: آرایه‌ای از آیتم‌های breadcrumb
  - `label`: متن نمایشی
  - `href`: لینک (اختیاری)

---

### 2. EmptyState
**مسیر:** `components/ui/EmptyState.tsx`

**استفاده:**
```tsx
import EmptyState from '@/components/ui/EmptyState';
import { FaShoppingBag } from 'react-icons/fa';

<EmptyState
  icon={<FaShoppingBag className="text-6xl text-gray-300" />}
  title="سبد خرید خالی است"
  description="محصولی در سبد خرید شما وجود ندارد"
  actionLabel="مشاهده محصولات"
  actionHref="/shop"
/>
```

**Props:**
- `icon`: آیکون (ReactNode)
- `title`: عنوان
- `description`: توضیحات (اختیاری)
- `actionLabel`: متن دکمه (اختیاری)
- `actionHref`: لینک دکمه (اختیاری)
- `onAction`: تابع کلیک دکمه (اختیاری)

---

### 3. ErrorBoundary
**مسیر:** `components/ui/ErrorBoundary.tsx`

**استفاده:**
```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `children`: کامپوننت‌های فرزند
- `fallback`: UI جایگزین (اختیاری)

**ویژگی‌ها:**
- Catch کردن خطاهای React
- نمایش UI مناسب
- دکمه تلاش مجدد
- نمایش خطا در development

---

### 4. ErrorMessage
**مسیر:** `components/ui/ErrorMessage.tsx`

**استفاده:**
```tsx
import ErrorMessage from '@/components/ui/ErrorMessage';

<ErrorMessage
  title="خطایی رخ داده است"
  message="لطفاً دوباره تلاش کنید"
  onRetry={() => refetch()}
  showHomeButton={true}
/>
```

**Props:**
- `title`: عنوان خطا (پیش‌فرض: "خطایی رخ داده است")
- `message`: پیام خطا (پیش‌فرض: متن استاندارد)
- `onRetry`: تابع تلاش مجدد (اختیاری)
- `showHomeButton`: نمایش دکمه خانه (پیش‌فرض: true)

---

### 5. LoadingSkeleton
**مسیر:** `components/ui/LoadingSkeleton.tsx`

**استفاده:**
```tsx
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

// Skeleton محصول
<LoadingSkeleton type="product" count={8} />

// Skeleton لیست
<LoadingSkeleton type="list" count={5} />

// Skeleton جزئیات
<LoadingSkeleton type="detail" />

// Skeleton متن
<LoadingSkeleton type="text" count={3} />

// Skeleton کارت
<LoadingSkeleton type="card" count={4} />
```

**Props:**
- `type`: نوع skeleton ('product' | 'detail' | 'list' | 'text' | 'card')
- `count`: تعداد skeleton (پیش‌فرض: 1)

**ویژگی‌ها:**
- انیمیشن shimmer
- Responsive
- انواع مختلف

---

### 6. ScrollToTop
**مسیر:** `components/ui/ScrollToTop.tsx`

**استفاده:**
```tsx
import ScrollToTop from '@/components/ui/ScrollToTop';

// در layout
<ScrollToTop />
```

**ویژگی‌ها:**
- نمایش بعد از scroll 300px
- Smooth scroll
- انیمیشن bounce
- دکمه شناور

---

### 7. StructuredData
**مسیر:** `components/ui/StructuredData.tsx`

**استفاده:**
```tsx
import StructuredData from '@/components/ui/StructuredData';

<StructuredData
  type="Product"
  data={{
    name: "محصول",
    price: 1000000,
    // ...
  }}
/>
```

**Props:**
- `type`: نوع structured data
- `data`: داده‌های structured data

**ویژگی‌ها:**
- بهبود SEO
- Rich snippets
- Schema.org

---

## 🎨 Design System

تمام کامپوننت‌ها از Design System پروژه پیروی می‌کنند:

### رنگ‌ها:
- Primary: `#FF4444`
- Secondary: `#1a1a1a`
- Success: `#10B981`
- Error: `#EF4444`

### Spacing:
- Small: `0.5rem` (8px)
- Medium: `1rem` (16px)
- Large: `1.5rem` (24px)

### Border Radius:
- Small: `0.375rem` (6px)
- Medium: `0.5rem` (8px)
- Large: `0.75rem` (12px)

---

## ♿ Accessibility

تمام کامپوننت‌ها:
- ✅ ARIA labels دارند
- ✅ Keyboard navigation دارند
- ✅ Screen reader friendly هستند
- ✅ Focus states واضح دارند

---

## 📱 Responsive

تمام کامپوننت‌ها:
- ✅ Mobile-first هستند
- ✅ در تمام breakpoint ها تست شده‌اند
- ✅ Touch-friendly هستند

---

## 🧪 Testing

برای تست کامپوننت‌ها:

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 📚 مستندات بیشتر

- [Design System](../../DESIGN-SYSTEM.md)
- [UI Improvements](../../UI-IMPROVEMENTS.md)
- [How to Use](../../HOW-TO-USE-NEW-FEATURES.md)

---

**آخرین بروزرسانی:** 23 نوامبر 2025
