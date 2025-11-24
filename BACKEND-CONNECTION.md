# 🔌 راهنمای اتصال Frontend به Backend

## ✅ کارهای انجام شده

### 1. API Client
ساخته شد یک API Client مرکزی برای ارتباط با Backend:
- **فایل:** `lib/api/client.ts`
- **ویژگی‌ها:**
  - مدیریت خودکار Headers
  - مدیریت Token
  - Error Handling
  - TypeScript Support

### 2. Admin API Functions
ساخته شد تمام توابع مورد نیاز برای پنل ادمین:
- **فایل:** `lib/api/admin.ts`
- **شامل:**
  - Dashboard Stats
  - Products CRUD
  - Orders Management
  - Reviews Management
  - Categories CRUD
  - Brands CRUD
  - Users Management

### 3. Backend APIs
ساخته شد Admin Module در NestJS:
- **فایل‌ها:**
  - `src/admin/admin.controller.ts`
  - `src/admin/admin.service.ts`
  - `src/admin/admin.module.ts`
- **API:** `GET /admin/dashboard/stats`

### 4. AuthContext با Backend
به‌روزرسانی شد AuthContext برای کار با Backend:
- **فایل:** `lib/context/AuthContext.tsx`
- **ویژگی‌ها:**
  - دریافت اطلاعات کاربر از API
  - مدیریت Token
  - Loading State

---

## 🚀 راه‌اندازی

### 1. تنظیم Environment Variables

ایجاد فایل `.env` در root پروژه:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/maysa_shop?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Backend Port
PORT=4000

# Next.js Public API URL
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 2. اجرای Backend

```bash
# نصب dependencies
npm install

# اجرای migrations
npx prisma migrate dev

# Seed database (اختیاری)
npx prisma db seed

# اجرای backend
npm run nest:dev
```

Backend در `http://localhost:4000` اجرا می‌شود.

### 3. اجرای Frontend

```bash
# در ترمینال جدید
npm run dev
```

Frontend در `http://localhost:3000` اجرا می‌شود.

---

## 📝 نحوه استفاده

### مثال 1: دریافت آمار Dashboard

```typescript
import { adminApi } from '@/lib/api/admin';

// در کامپوننت
const fetchStats = async () => {
  try {
    const stats = await adminApi.getDashboardStats();
    console.log(stats);
  } catch (error) {
    console.error('خطا:', error);
  }
};
```

### مثال 2: دریافت لیست محصولات

```typescript
import { adminApi } from '@/lib/api/admin';

const fetchProducts = async () => {
  try {
    const { data, total } = await adminApi.getProducts({
      search: 'کوله',
      status: 'active',
      page: 1,
      limit: 10,
    });
    console.log(data, total);
  } catch (error) {
    console.error('خطا:', error);
  }
};
```

### مثال 3: ایجاد محصول جدید

```typescript
import { adminApi } from '@/lib/api/admin';

const createProduct = async () => {
  try {
    const product = await adminApi.createProduct({
      name: 'کوله پشتی جدید',
      slug: 'new-backpack',
      categoryId: 'category-id',
      basePrice: 500000,
      sku: 'BP-1001',
      isActive: true,
    });
    console.log('محصول ایجاد شد:', product);
  } catch (error) {
    console.error('خطا:', error);
  }
};
```

---

## 🔄 به‌روزرسانی صفحات پنل ادمین

### Dashboard (`app/admin/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { adminApi, DashboardStats } from '@/lib/api/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت آمار');
      console.error('خطا در دریافت آمار:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;
  if (!stats) return null;

  return (
    <div>
      {/* نمایش آمار */}
      <h1>کل محصولات: {stats.totalProducts}</h1>
      {/* ... */}
    </div>
  );
}
```

### Products (`app/admin/products/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { adminApi, Product } from '@/lib/api/admin';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.getProducts({
        search: searchTerm,
      });
      setProducts(data);
    } catch (error) {
      console.error('خطا در دریافت محصولات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    
    try {
      await adminApi.deleteProduct(id);
      fetchProducts(); // رفرش لیست
    } catch (error) {
      console.error('خطا در حذف محصول:', error);
    }
  };

  // ...
}
```

---

## 🔐 Authentication Flow

### 1. Login

```typescript
// در صفحه login
const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    // Redirect به dashboard یا home
  } catch (error) {
    console.error('خطا در ورود:', error);
  }
};
```

### 2. Protected Routes

```typescript
// در layout پنل ادمین
const { user, isAdmin, loading } = useAuth();

if (loading) return <Loading />;
if (!user || !isAdmin) {
  router.push('/login');
  return null;
}
```

### 3. API Calls با Token

Token به صورت خودکار از localStorage گرفته می‌شود و به Headers اضافه می‌شود.

---

## 🧪 تست

### 1. تست Backend

```bash
# بررسی Swagger Docs
http://localhost:4000/api/docs

# تست API با curl
curl http://localhost:4000/products
```

### 2. تست Frontend

1. وارد شوید: `http://localhost:3000/login`
2. برو به پنل ادمین: `http://localhost:3000/admin`
3. بررسی Console برای خطاها
4. بررسی Network Tab برای API Calls

---

## ⚠️ نکات مهم

### 1. CORS
مطمئن شوید CORS در Backend فعال است:

```typescript
// src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

### 2. JWT Secret
در production حتماً JWT_SECRET را تغییر دهید.

### 3. Error Handling
همیشه خطاها را handle کنید:

```typescript
try {
  const data = await adminApi.getProducts();
} catch (error: any) {
  toast.error(error.message || 'خطای ناشناخته');
}
```

### 4. Loading States
همیشه Loading State نمایش دهید:

```typescript
if (loading) return <Skeleton />;
```

---

## 📋 Checklist اتصال

- [x] API Client ساخته شد
- [x] Admin API Functions ساخته شد
- [x] Backend Admin Module ساخته شد
- [x] AuthContext به‌روز شد
- [x] Environment Variables تنظیم شد
- [ ] Dashboard به Backend وصل شود
- [ ] Products به Backend وصل شود
- [ ] Orders به Backend وصل شود
- [ ] Reviews به Backend وصل شود
- [ ] Categories به Backend وصل شود
- [ ] Brands به Backend وصل شود
- [ ] Users به Backend وصل شود
- [ ] Login واقعی پیاده شود
- [ ] Error Handling بهبود یابد
- [ ] Loading States اضافه شود

---

## 🎯 مراحل بعدی

### فاز 1: اتصال صفحات (در حال انجام)
- [ ] Dashboard
- [ ] Products
- [ ] Orders
- [ ] Reviews
- [ ] Categories
- [ ] Brands
- [ ] Users

### فاز 2: بهبود UX
- [ ] Toast Notifications
- [ ] Loading Skeletons
- [ ] Error Boundaries
- [ ] Optimistic Updates

### فاز 3: ویژگی‌های پیشرفته
- [ ] Pagination
- [ ] Infinite Scroll
- [ ] Real-time Updates
- [ ] File Upload

---

**آماده برای اتصال کامل به Backend! 🚀**
