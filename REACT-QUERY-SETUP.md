# React Query & Cart Setup

## ✅ چیزهایی که اضافه شد:

### 1. React Query (TanStack Query)
- **نصب شده**: `@tanstack/react-query` و `@tanstack/react-query-devtools`
- **QueryProvider**: در `components/providers/QueryProvider.tsx`
- **تنظیمات**:
  - staleTime: 1 دقیقه
  - gcTime: 5 دقیقه
  - refetchOnWindowFocus: false
  - retry: 1

### 2. Cart Context
- **مسیر**: `lib/context/CartContext.tsx`
- **قابلیت‌ها**:
  - افزودن به سبد خرید
  - حذف از سبد خرید
  - تغییر تعداد
  - پاک کردن کل سبد
  - ذخیره در localStorage
  - محاسبه خودکار مجموع

### 3. API Functions
- **مسیر**: `lib/api/products.ts`
- **توابع**:
  - `getProducts()` - دریافت همه محصولات
  - `getProductBySlug(slug)` - دریافت یک محصول
  - `getProductsByCategory(category)` - فیلتر بر اساس دسته
  - `getFeaturedProducts()` - محصولات ویژه
  - `searchProducts(query)` - جستجو

### 4. Custom Hooks
- **مسیر**: `lib/hooks/useProducts.ts`
- **Hooks**:
  - `useProducts()` - همه محصولات
  - `useProduct(slug)` - یک محصول
  - `useProductsByCategory(category)` - فیلتر دسته
  - `useFeaturedProducts()` - محصولات ویژه
  - `useSearchProducts(query)` - جستجو

## 🎯 نحوه استفاده:

### استفاده از Cart:
```tsx
import { useCart } from '@/lib/context/CartContext';

function MyComponent() {
  const { items, addToCart, removeFromCart, totalItems, totalPrice } = useCart();
  
  // افزودن به سبد
  addToCart(product, quantity);
  
  // حذف از سبد
  removeFromCart(productId);
}
```

### استفاده از React Query:
```tsx
import { useProducts } from '@/lib/hooks/useProducts';

function MyComponent() {
  const { data: products, isLoading, error } = useProducts();
  
  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در دریافت اطلاعات</div>;
  
  return <div>{/* نمایش محصولات */}</div>;
}
```

## 🔥 مزایا:

### React Query:
- ✅ Caching خودکار
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ DevTools برای دیباگ
- ✅ مدیریت loading و error states

### Cart Context:
- ✅ ذخیره در localStorage
- ✅ محاسبه خودکار
- ✅ دسترسی آسان در تمام کامپوننت‌ها
- ✅ TypeScript support

## 📝 گام‌های بعدی:

1. اتصال به API واقعی (جایگزینی mock data)
2. Mutations برای ثبت سفارش
3. Optimistic updates برای UX بهتر
4. Infinite scroll برای لیست محصولات
5. Prefetching برای سرعت بیشتر
