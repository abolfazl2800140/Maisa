# 🔐 طراحی سیستم نقش‌ها و دسترسی‌ها (RBAC)

## 📋 نقش‌های سیستم

### 1️⃣ Customer (مشتری)
- خرید محصولات
- مدیریت سبد خرید
- مدیریت علاقه‌مندی‌ها
- مشاهده و ثبت نظر
- مدیریت پروفایل شخصی
- مشاهده سفارشات خود

### 2️⃣ Admin (ادمین)
- همه دسترسی‌های Customer +
- مدیریت محصولات (CRUD)
- مدیریت دسته‌بندی‌ها
- مدیریت برندها
- مشاهده سفارشات همه کاربران
- تغییر وضعیت سفارشات
- تایید/رد نظرات
- مشاهده گزارش‌های پایه

### 3️⃣ Super Admin (سوپر ادمین)
- همه دسترسی‌های Admin +
- مدیریت کاربران (CRUD)
- مدیریت ادمین‌ها (اضافه/حذف)
- تغییر نقش کاربران
- مشاهده گزارش‌های پیشرفته
- تنظیمات سیستم
- مدیریت کدهای تخفیف
- دسترسی به لاگ‌های سیستم
- Backup و Restore

---

## 🗄️ ساختار Database

### گزینه 1: ساده (توصیه برای شروع) ⭐

```prisma
// prisma/schema.prisma

enum UserRole {
  customer
  admin
  super_admin
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  firstName    String?  @map("first_name")
  lastName     String?  @map("last_name")
  phone        String?  @unique
  role         UserRole @default(customer)
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  
  // Relations
  addresses    Address[]
  orders       Order[]
  reviews      Review[]
  wishlist     Wishlist[]
  
  @@map("users")
}
```

### گزینه 2: پیشرفته (برای آینده)

```prisma
// اگر بخوای Permissions جزئی‌تر داشته باشی

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  firstName    String?  @map("first_name")
  lastName     String?  @map("last_name")
  phone        String?  @unique
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  
  // Relations
  roles        UserRole[]
  addresses    Address[]
  orders       Order[]
  reviews      Review[]
  wishlist     Wishlist[]
  
  @@map("users")
}

model Role {
  id          String       @id @default(uuid())
  name        String       @unique // 'customer', 'admin', 'super_admin'
  description String?
  permissions Permission[]
  users       UserRole[]
  createdAt   DateTime     @default(now()) @map("created_at")
  
  @@map("roles")
}

model Permission {
  id          String   @id @default(uuid())
  name        String   @unique // 'products.create', 'orders.view', etc.
  description String?
  resource    String   // 'products', 'orders', 'users'
  action      String   // 'create', 'read', 'update', 'delete'
  roles       Role[]
  createdAt   DateTime @default(now()) @map("created_at")
  
  @@map("permissions")
}

model UserRole {
  userId    String   @map("user_id")
  roleId    String   @map("role_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now()) @map("assigned_at")
  
  @@id([userId, roleId])
  @@map("user_roles")
}
```

---

## 🎯 پیشنهاد من: شروع با گزینه 1 (ساده)

چرا؟
- ✅ کافی برای 90% پروژه‌ها
- ✅ ساده و سریع
- ✅ بعداً می‌تونی توسعه بدی
- ✅ Performance بهتر

---

## 🔒 پیاده‌سازی Authentication & Authorization

### 1. Middleware برای بررسی نقش

```typescript
// lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { prisma } from '@/lib/prisma';

export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

// بررسی Authentication
export async function requireAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    
    // بررسی کاربر در دیتابیس
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// بررسی نقش
export function requireRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

// Helper برای بررسی Admin
export function isAdmin(user: AuthUser | null): boolean {
  return requireRole(user, ['admin', 'super_admin']);
}

// Helper برای بررسی Super Admin
export function isSuperAdmin(user: AuthUser | null): boolean {
  return requireRole(user, ['super_admin']);
}
```

### 2. استفاده در API Routes

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAdmin } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

// GET - همه می‌تونن ببینن
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
  });
  
  return NextResponse.json(products);
}

// POST - فقط Admin و Super Admin
export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  
  // بررسی Authentication
  if (!user) {
    return NextResponse.json(
      { error: 'لطفاً وارد شوید' },
      { status: 401 }
    );
  }
  
  // بررسی Authorization
  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: 'شما دسترسی ندارید' },
      { status: 403 }
    );
  }
  
  // ایجاد محصول
  const body = await request.json();
  const product = await prisma.product.create({
    data: body,
  });
  
  return NextResponse.json(product, { status: 201 });
}
```

### 3. مدیریت کاربران (فقط Super Admin)

```typescript
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isSuperAdmin } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

// لیست کاربران - فقط Super Admin
export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  
  if (!isSuperAdmin(user)) {
    return NextResponse.json(
      { error: 'فقط سوپر ادمین دسترسی دارد' },
      { status: 403 }
    );
  }
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return NextResponse.json(users);
}
```

### 4. تغییر نقش کاربر (فقط Super Admin)

```typescript
// app/api/admin/users/[id]/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isSuperAdmin } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(request);
  
  if (!isSuperAdmin(user)) {
    return NextResponse.json(
      { error: 'فقط سوپر ادمین می‌تواند نقش کاربران را تغییر دهد' },
      { status: 403 }
    );
  }
  
  const { role } = await request.json();
  
  // اعتبارسنجی نقش
  if (!['customer', 'admin', 'super_admin'].includes(role)) {
    return NextResponse.json(
      { error: 'نقش نامعتبر است' },
      { status: 400 }
    );
  }
  
  // جلوگیری از تغییر نقش خودش
  if (params.id === user.id) {
    return NextResponse.json(
      { error: 'نمی‌توانید نقش خود را تغییر دهید' },
      { status: 400 }
    );
  }
  
  const updatedUser = await prisma.user.update({
    where: { id: params.id },
    data: { role },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
  
  return NextResponse.json(updatedUser);
}
```

---

## 🎨 پنل ادمین (Frontend)

### ساختار صفحات:

```
app/
├── (main)/              # صفحات عمومی
│   ├── page.tsx
│   ├── shop/
│   └── ...
├── admin/               # 🔥 پنل ادمین
│   ├── layout.tsx       # Layout اختصاصی ادمین
│   ├── page.tsx         # Dashboard
│   ├── products/
│   │   ├── page.tsx     # لیست محصولات
│   │   ├── new/page.tsx # افزودن محصول
│   │   └── [id]/edit/page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── categories/
│   ├── reviews/
│   └── users/           # فقط Super Admin
│       ├── page.tsx
│       └── [id]/page.tsx
└── api/
```

### Layout ادمین با بررسی دسترسی:

```typescript
// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaStar } from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        router.push('/login?redirect=/admin');
        return;
      }

      const userData = await response.json();

      // بررسی نقش
      if (userData.role !== 'admin' && userData.role !== 'super_admin') {
        router.push('/');
        return;
      }

      setUser(userData);
    } catch (error) {
      router.push('/login?redirect=/admin');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isSuperAdmin = user.role === 'super_admin';

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">پنل مدیریت</h1>
          <p className="text-sm text-gray-600 mt-2">
            {user.firstName} {user.lastName}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary text-white text-xs rounded-full">
            {user.role === 'super_admin' ? 'سوپر ادمین' : 'ادمین'}
          </span>
        </div>

        <nav className="mt-6">
          <a
            href="/admin"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors"
          >
            <FaHome />
            <span>داشبورد</span>
          </a>
          
          <a
            href="/admin/products"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors"
          >
            <FaBox />
            <span>محصولات</span>
          </a>
          
          <a
            href="/admin/orders"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors"
          >
            <FaShoppingCart />
            <span>سفارشات</span>
          </a>
          
          <a
            href="/admin/reviews"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors"
          >
            <FaStar />
            <span>نظرات</span>
          </a>

          {/* فقط برای Super Admin */}
          {isSuperAdmin && (
            <a
              href="/admin/users"
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors border-t mt-4 pt-4"
            >
              <FaUsers />
              <span>مدیریت کاربران</span>
            </a>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
```

### صفحه مدیریت کاربران (فقط Super Admin):

```typescript
// app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        alert('شما دسترسی ندارید');
        router.push('/admin');
        return;
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('خطا در دریافت کاربران:', error);
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(userId: string, newRole: string) {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        alert('نقش کاربر تغییر یافت');
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert('خطا در تغییر نقش');
    }
  }

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">مدیریت کاربران</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">نام</th>
              <th className="px-6 py-3 text-right">ایمیل</th>
              <th className="px-6 py-3 text-right">تلفن</th>
              <th className="px-6 py-3 text-right">نقش</th>
              <th className="px-6 py-3 text-right">وضعیت</th>
              <th className="px-6 py-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-t">
                <td className="px-6 py-4">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone || '-'}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    className="border rounded px-3 py-1"
                  >
                    <option value="customer">مشتری</option>
                    <option value="admin">ادمین</option>
                    <option value="super_admin">سوپر ادمین</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline">
                    جزئیات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 📊 جدول دسترسی‌ها

| عملیات | Customer | Admin | Super Admin |
|--------|----------|-------|-------------|
| خرید محصول | ✅ | ✅ | ✅ |
| مشاهده محصولات | ✅ | ✅ | ✅ |
| ثبت نظر | ✅ | ✅ | ✅ |
| مدیریت پروفایل | ✅ | ✅ | ✅ |
| افزودن محصول | ❌ | ✅ | ✅ |
| ویرایش محصول | ❌ | ✅ | ✅ |
| حذف محصول | ❌ | ✅ | ✅ |
| مشاهده همه سفارشات | ❌ | ✅ | ✅ |
| تغییر وضعیت سفارش | ❌ | ✅ | ✅ |
| تایید/رد نظرات | ❌ | ✅ | ✅ |
| مشاهده کاربران | ❌ | ❌ | ✅ |
| تغییر نقش کاربران | ❌ | ❌ | ✅ |
| حذف کاربران | ❌ | ❌ | ✅ |
| تنظیمات سیستم | ❌ | ❌ | ✅ |

---

## ✅ Checklist پیاده‌سازی

- [ ] به‌روزرسانی Prisma Schema با enum UserRole
- [ ] ایجاد middleware برای Authentication
- [ ] ایجاد helper functions برای Authorization
- [ ] محافظت از API Routes
- [ ] ایجاد Layout پنل ادمین
- [ ] ایجاد صفحات پنل ادمین
- [ ] محدود کردن دسترسی صفحات
- [ ] تست دسترسی‌ها
- [ ] ایجاد اولین Super Admin

---

**آماده برای پیاده‌سازی! 🚀**
