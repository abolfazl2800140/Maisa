# راهنمای رفع مشکلات (Troubleshooting)

این فایل شامل راه‌حل‌های مشکلات رایج است.

---

## ❌ خطاهای رایج و راه‌حل

### 1. خطای "Cannot read properties of undefined (reading 'length')"

**علت:** Hook `useRecentlyViewed` در ابتدا `undefined` برمی‌گرداند.

**راه‌حل:**
```tsx
// ❌ اشتباه
const { items: recentlyViewed } = useRecentlyViewed();
{recentlyViewed.length > 0 && <Component />}

// ✅ درست
const { items: recentlyViewed } = useRecentlyViewed();
{recentlyViewed && recentlyViewed.length > 0 && <Component />}
```

---

### 2. خطای "useContext must be used within Provider"

**علت:** Context Provider در layout اضافه نشده.

**راه‌حل:**
مطمئن شوید که در `app/layout.tsx` تمام Providerها اضافه شده‌اند:

```tsx
<QueryProvider>
  <CartProvider>
    <WishlistProvider>
      <ComparisonProvider>
        <AddressProvider>
          {children}
        </AddressProvider>
      </ComparisonProvider>
    </WishlistProvider>
  </CartProvider>
</QueryProvider>
```

---

### 3. خطای "Module not found"

**علت:** مسیر import اشتباه است.

**راه‌حل:**
- از `@/` برای مسیر نسبی از root استفاده کنید
- مطمئن شوید فایل در مسیر صحیح است

```tsx
// ✅ درست
import { useCart } from '@/lib/context/CartContext';

// ❌ اشتباه
import { useCart } from '../lib/context/CartContext';
```

---

### 4. Bottom Navigation در دسکتاپ نمایش داده می‌شود

**علت:** کلاس `md:hidden` اضافه نشده.

**راه‌حل:**
```tsx
// در components/layout/BottomNav.tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
```

---

### 5. localStorage خالی است

**علت:** داده‌ها هنوز ذخیره نشده‌اند.

**راه‌حل:**
- مطمئن شوید که `isHydrated` true است
- در console بررسی کنید: `localStorage.getItem('maysa-cart')`

---

### 6. Swiper کار نمی‌کند

**علت:** CSS import نشده یا modules اضافه نشده.

**راه‌حل:**
```tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

<Swiper modules={[Navigation, Autoplay]}>
```

---

### 7. تصاویر load نمی‌شوند

**علت:** مسیر تصویر اشتباه است یا تصویر وجود ندارد.

**راه‌حل:**
- تصاویر را در `public/images/` قرار دهید
- از مسیر `/images/...` استفاده کنید
- placeholder اضافه کنید:

```tsx
<Image
  src={product.images[0] || '/images/placeholder.jpg'}
  alt={product.name}
  fill
/>
```

---

### 8. TypeScript خطا می‌دهد

**علت:** Type تعریف نشده یا اشتباه است.

**راه‌حل:**
- Types را در `types/index.ts` چک کنید
- از `any` استفاده نکنید
- Interface‌ها را export کنید

---

### 9. Build خطا می‌دهد

**علت:** خطای TypeScript یا ESLint.

**راه‌حل:**
```bash
# چک کردن TypeScript
npx tsc --noEmit

# چک کردن ESLint
npm run lint

# Fix کردن خطاهای ESLint
npm run lint -- --fix
```

---

### 10. Performance ضعیف است

**راه‌حل:**
- از `next/image` برای تصاویر استفاده کنید
- Lazy loading فعال کنید
- Code splitting استفاده کنید
- Bundle size را چک کنید:

```bash
npm run build
npm run analyze
```

---

## 🔍 دیباگ کردن

### چک کردن Context:
```tsx
// در کامپوننت
const { items } = useCart();
console.log('Cart items:', items);
```

### چک کردن localStorage:
```javascript
// در Console
console.log('Cart:', localStorage.getItem('maysa-cart'));
console.log('Wishlist:', localStorage.getItem('maysa-wishlist'));
console.log('Comparison:', localStorage.getItem('maysa-comparison'));
console.log('Addresses:', localStorage.getItem('maysa-addresses'));
```

### چک کردن Props:
```tsx
// در کامپوننت
useEffect(() => {
  console.log('Props:', { product, viewMode });
}, [product, viewMode]);
```

---

## 🛠️ ابزارهای مفید

### React DevTools:
- نصب از Chrome Web Store
- بررسی Component Tree
- بررسی Props و State
- بررسی Context

### Redux DevTools (برای Context):
- نصب از Chrome Web Store
- بررسی State Changes
- Time Travel Debugging

### Lighthouse:
```bash
# در Chrome DevTools
# Performance > Lighthouse > Generate Report
```

### Bundle Analyzer:
```bash
npm install --save-dev @next/bundle-analyzer

# در next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

# اجرا
ANALYZE=true npm run build
```

---

## 📝 چک لیست قبل از Deploy

- [ ] تمام خطاهای TypeScript برطرف شده
- [ ] تمام خطاهای ESLint برطرف شده
- [ ] Build بدون خطا انجام می‌شود
- [ ] تمام صفحات load می‌شوند
- [ ] تمام Context Providerها اضافه شده‌اند
- [ ] localStorage کار می‌کند
- [ ] تصاویر load می‌شوند
- [ ] Responsive در همه سایزها
- [ ] Performance خوب است (Lighthouse > 90)
- [ ] Accessibility خوب است (Lighthouse > 90)
- [ ] SEO خوب است (Lighthouse > 90)

---

## 🆘 دریافت کمک

اگر مشکل شما در این لیست نیست:

1. خطا را در Console بررسی کنید
2. Stack Trace را بخوانید
3. در Google جستجو کنید
4. در GitHub Issues جستجو کنید
5. سوال خود را در Stack Overflow بپرسید
6. با تیم پشتیبانی تماس بگیرید

---

## 📚 منابع مفید

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Swiper Documentation](https://swiperjs.com/react)

---

**موفق باشید! 🚀**
