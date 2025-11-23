# اتصال فرانت به بک‌اند

## تغییرات انجام شده

### 1. متغیرهای محیطی
فایل `.env` و `.env.example` آپدیت شدند:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 2. API Client
فایل `lib/api/client.ts` ساخته شد که یک HTTP client کامل برای ارتباط با بک‌اند است.

ویژگی‌ها:
- پشتیبانی از تمام متدهای HTTP (GET, POST, PUT, PATCH, DELETE)
- مدیریت خودکار توکن JWT
- مدیریت خطاها
- TypeScript support کامل

### 3. Products API
فایل `lib/api/products.ts` به‌روزرسانی شد:
- حالا از بک‌اند داده می‌خواند (قبلاً از JSON محلی می‌خواند)
- تمام endpoint های بک‌اند پشتیبانی می‌شوند:
  - `getProducts()` - لیست تمام محصولات
  - `getProductBySlug(slug)` - دریافت محصول با slug
  - `getProductsByCategory(categoryId)` - محصولات یک دسته‌بندی
  - `getFeaturedProducts()` - محصولات ویژه
  - `searchProducts(query)` - جستجوی محصولات

### 4. Auth API
فایل `lib/api/auth.ts` ساخته شد:
- `login(email, password)` - ورود کاربر
- `register(data)` - ثبت‌نام کاربر
- `logout()` - خروج کاربر
- `getToken()` - دریافت توکن
- `getUser()` - دریافت اطلاعات کاربر
- `isAuthenticated()` - بررسی احراز هویت

## نحوه استفاده

### استفاده از Products API
```typescript
import { getProducts, getFeaturedProducts } from '@/lib/api/products';

// در کامپوننت
const products = await getProducts();
const featured = await getFeaturedProducts();
```

### استفاده از Auth API
```typescript
import { login, register, logout } from '@/lib/api/auth';

// ورود
const response = await login({ email, password });

// ثبت‌نام
const response = await register({ email, password, firstName, lastName });

// خروج
logout();
```

### استفاده مستقیم از API Client
```typescript
import { ApiClient } from '@/lib/api/client';

// GET request
const data = await ApiClient.get('/endpoint');

// POST request
const result = await ApiClient.post('/endpoint', { data });
```

## راه‌اندازی

### 1. نصب dependencies (قبلاً نصب شده)
```bash
npm install
```

### 2. راه‌اندازی دیتابیس
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 3. اجرای بک‌اند
```bash
npm run nest:dev
```
بک‌اند روی پورت 4000 اجرا می‌شود.

### 4. اجرای فرانت
در ترمینال جدید:
```bash
npm run dev
```
فرانت روی پورت 3000 اجرا می‌شود.

## تست اتصال

1. بک‌اند را اجرا کنید
2. فرانت را اجرا کنید
3. به `http://localhost:3000` بروید
4. محصولات باید از بک‌اند لود شوند

## نکات مهم

- **توکن JWT**: توکن در localStorage ذخیره می‌شود و به صورت خودکار در header های request ها ارسال می‌شود
- **CORS**: در بک‌اند فعال است و فرانت می‌تواند به API دسترسی داشته باشد
- **Error Handling**: خطاها به صورت خودکار مدیریت می‌شوند و در console نمایش داده می‌شوند
- **TypeScript**: تمام API ها type-safe هستند

## مشکلات احتمالی

### بک‌اند در دسترس نیست
اگر فرانت نتواند به بک‌اند متصل شود:
1. مطمئن شوید بک‌اند روی پورت 4000 در حال اجراست
2. `NEXT_PUBLIC_API_URL` را در `.env` چک کنید
3. CORS را در `src/main.ts` بررسی کنید

### محصولات نمایش داده نمی‌شوند
1. دیتابیس را seed کنید: `npm run prisma:seed`
2. Console browser را برای خطاها چک کنید
3. Network tab را در DevTools بررسی کنید

### خطای Authentication
1. توکن را در localStorage چک کنید
2. مطمئن شوید JWT_SECRET در `.env` تنظیم شده
3. توکن منقضی شده باشد، دوباره login کنید
