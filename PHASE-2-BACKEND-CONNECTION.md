# ✅ مرحله 2: اتصال به Backend - خلاصه

## 🎯 هدف
اتصال پنل ادمین به Backend (NestJS) و آماده‌سازی برای دریافت داده‌های واقعی

## ✨ کارهای انجام شده

### 1️⃣ API Client (`lib/api/client.ts`)
یک Client مرکزی برای ارتباط با Backend:
- ✅ مدیریت خودکار Headers
- ✅ مدیریت Token (localStorage)
- ✅ Error Handling
- ✅ TypeScript Support
- ✅ Methods: GET, POST, PATCH, DELETE

### 2️⃣ Admin API Functions (`lib/api/admin.ts`)
تمام توابع مورد نیاز برای پنل ادمین:
- ✅ Dashboard Stats
- ✅ Products (CRUD + Search + Filter)
- ✅ Orders (List + Details + Update Status)
- ✅ Reviews (List + Approve + Reject)
- ✅ Categories (CRUD + Toggle Status)
- ✅ Brands (CRUD + Toggle Status)
- ✅ Users (List + Change Role + Toggle Status)

### 3️⃣ Backend Admin Module
ساخته شد Admin Module در NestJS:
- ✅ `src/admin/admin.controller.ts`
- ✅ `src/admin/admin.service.ts`
- ✅ `src/admin/admin.module.ts`
- ✅ API: `GET /admin/dashboard/stats`
- ✅ اضافه شد به `app.module.ts`

### 4️⃣ AuthContext با Backend
به‌روزرسانی شد برای کار با Backend:
- ✅ دریافت اطلاعات کاربر از API
- ✅ مدیریت Token
- ✅ Loading State
- ✅ Mock Login (برای تست)
- ✅ آماده برای Login واقعی

### 5️⃣ Environment Variables
- ✅ `.env.example` با تمام متغیرهای مورد نیاز
- ✅ `NEXT_PUBLIC_API_URL` برای Frontend
- ✅ `DATABASE_URL`, `JWT_SECRET`, etc.

### 6️⃣ مستندات
- ✅ `BACKEND-CONNECTION.md` - راهنمای کامل اتصال
- ✅ `app/admin/dashboard-connected.tsx.example` - مثال کامل

---

## 📁 فایل‌های ایجاد شده

```
lib/api/
├── client.ts              # API Client مرکزی
└── admin.ts               # Admin API Functions

src/admin/
├── admin.controller.ts    # Admin Controller
├── admin.service.ts       # Admin Service
└── admin.module.ts        # Admin Module

.env.example               # Environment Variables
BACKEND-CONNECTION.md      # راهنمای اتصال
PHASE-2-BACKEND-CONNECTION.md  # این فایل
app/admin/dashboard-connected.tsx.example  # مثال Dashboard
```

---

## 🚀 نحوه استفاده

### 1. تنظیم Environment

```bash
# کپی کردن .env.example
cp .env.example .env

# ویرایش .env و تنظیم DATABASE_URL و JWT_SECRET
```

### 2. اجرای Backend

```bash
# نصب dependencies
npm install

# اجرای migrations
npx prisma migrate dev

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

### 4. تست API

```bash
# بررسی Swagger Docs
http://localhost:4000/api/docs

# تست Dashboard Stats API
curl http://localhost:4000/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💡 مثال استفاده

### دریافت آمار Dashboard

```typescript
import { adminApi } from '@/lib/api/admin';

const fetchStats = async () => {
  try {
    const stats = await adminApi.getDashboardStats();
    console.log(stats);
    // {
    //   totalProducts: 156,
    //   totalOrders: 342,
    //   totalUsers: 1250,
    //   ...
    // }
  } catch (error) {
    console.error('خطا:', error);
  }
};
```

### دریافت لیست محصولات

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
    console.log(`${total} محصول یافت شد`);
    console.log(data);
  } catch (error) {
    console.error('خطا:', error);
  }
};
```

### ایجاد محصول جدید

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

## 🔄 به‌روزرسانی صفحات

برای اتصال هر صفحه به Backend:

1. Import کردن `adminApi`
2. استفاده از `useState` و `useEffect`
3. Error Handling
4. Loading State
5. نمایش داده‌ها

**مثال کامل:** `app/admin/dashboard-connected.tsx.example`

---

## 📋 Checklist

### Backend
- [x] Admin Module ساخته شد
- [x] Dashboard Stats API
- [x] Users APIs (موجود بود)
- [x] Products APIs (موجود بود)
- [x] Orders APIs (موجود بود)
- [x] Reviews APIs (نیاز به تکمیل)
- [x] Categories APIs (نیاز به تکمیل)
- [ ] Brands APIs (نیاز به ساخت)

### Frontend
- [x] API Client
- [x] Admin API Functions
- [x] AuthContext با Backend
- [x] Environment Variables
- [ ] Dashboard متصل به Backend
- [ ] Products متصل به Backend
- [ ] Orders متصل به Backend
- [ ] Reviews متصل به Backend
- [ ] Categories متصل به Backend
- [ ] Brands متصل به Backend
- [ ] Users متصل به Backend

### مستندات
- [x] BACKEND-CONNECTION.md
- [x] PHASE-2-BACKEND-CONNECTION.md
- [x] مثال Dashboard
- [x] .env.example

---

## 🎯 مراحل بعدی (فاز 3)

### 1. تکمیل Backend APIs
- [ ] Reviews APIs (approve, reject)
- [ ] Categories APIs (toggle status)
- [ ] Brands Module (CRUD + toggle status)
- [ ] Search و Filter پیشرفته
- [ ] Pagination

### 2. اتصال صفحات Frontend
- [ ] Dashboard
- [ ] Products
- [ ] Orders
- [ ] Reviews
- [ ] Categories
- [ ] Brands
- [ ] Users

### 3. بهبود UX
- [ ] Toast Notifications
- [ ] Loading Skeletons
- [ ] Error Boundaries
- [ ] Retry Mechanism
- [ ] Optimistic Updates

### 4. Authentication واقعی
- [ ] Login با Backend
- [ ] Register با Backend
- [ ] Refresh Token
- [ ] Logout

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
در production حتماً `JWT_SECRET` را تغییر دهید و از یک مقدار قوی استفاده کنید.

### 3. Error Handling
همیشه خطاها را handle کنید و به کاربر نمایش دهید:

```typescript
try {
  const data = await adminApi.getProducts();
} catch (error: any) {
  toast.error(error.message || 'خطای ناشناخته');
}
```

### 4. Loading States
همیشه Loading State نمایش دهید تا کاربر بداند چه اتفاقی در حال رخ دادن است.

### 5. Token Management
Token به صورت خودکار مدیریت می‌شود، اما در صورت نیاز می‌توانید از این توابع استفاده کنید:

```typescript
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/api/client';

// دریافت Token
const token = getAuthToken();

// ذخیره Token
setAuthToken('new-token');

// حذف Token
removeAuthToken();
```

---

## 🧪 تست

### 1. تست Backend
```bash
# Swagger Docs
http://localhost:4000/api/docs

# تست با curl
curl http://localhost:4000/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. تست Frontend
1. وارد شوید: `http://localhost:3000/login`
2. برو به پنل ادمین: `http://localhost:3000/admin`
3. بررسی Console برای خطاها
4. بررسی Network Tab برای API Calls

---

## 📞 پشتیبانی

در صورت بروز مشکل:
1. بررسی Console برای خطاها
2. بررسی Network Tab برای API Calls
3. بررسی Backend Logs
4. بررسی Environment Variables
5. مطالعه `BACKEND-CONNECTION.md`

---

**مرحله 2 با موفقیت تکمیل شد! 🎉**

آماده برای مرحله 3: اتصال کامل صفحات به Backend
