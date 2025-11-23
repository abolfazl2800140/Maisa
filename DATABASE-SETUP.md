# 🚀 راهنمای نصب و راه‌اندازی Database

## 📋 پیش‌نیازها

1. **PostgreSQL** نصب شده باشد
2. **Node.js** نصب شده باشد
3. **npm** یا **yarn**

---

## 1️⃣ نصب PostgreSQL

### Windows:
```bash
# دانلود از سایت رسمی
https://www.postgresql.org/download/windows/

# یا با Chocolatey
choco install postgresql
```

### Mac:
```bash
# با Homebrew
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## 2️⃣ ایجاد Database

```bash
# ورود به PostgreSQL
psql -U postgres

# ایجاد database
CREATE DATABASE maysa_shop;

# ایجاد user (اختیاری)
CREATE USER maysa_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE maysa_shop TO maysa_user;

# خروج
\q
```

---

## 3️⃣ نصب Dependencies

```bash
# نصب Prisma و bcrypt
npm install @prisma/client
npm install -D prisma typescript ts-node @types/node
npm install bcrypt
npm install -D @types/bcrypt

# یا با yarn
yarn add @prisma/client
yarn add -D prisma typescript ts-node @types/node
yarn add bcrypt
yarn add -D @types/bcrypt
```

---

## 4️⃣ تنظیم Environment Variables

ایجاد فایل `.env` در root پروژه:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/maysa_shop?schema=public"

# یا با user اختصاصی
# DATABASE_URL="postgresql://maysa_user:your_password@localhost:5432/maysa_shop?schema=public"

# JWT Secret (برای Authentication)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# App
NODE_ENV="development"
PORT=3001

# Frontend URL (برای CORS)
FRONTEND_URL="http://localhost:3000"
```

**⚠️ مهم:** `your_password` رو با پسورد واقعی PostgreSQL خودت عوض کن!

---

## 5️⃣ اجرای Migrations

```bash
# ایجاد migration اولیه
npx prisma migrate dev --name init

# یا
yarn prisma migrate dev --name init
```

این دستور:
- ✅ جداول رو در database ایجاد می‌کنه
- ✅ Prisma Client رو generate می‌کنه
- ✅ فایل migration رو ذخیره می‌کنه

---

## 6️⃣ Seed کردن داده‌های اولیه

### اضافه کردن script به package.json:

```json
{
  "scripts": {
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### اجرای Seed:

```bash
npm run prisma:seed

# یا
npx prisma db seed
```

این دستور داده‌های زیر رو اضافه می‌کنه:
- ✅ 3 کاربر (1 ادمین، 2 مشتری)
- ✅ 3 برند
- ✅ 5 دسته‌بندی
- ✅ 3 محصول
- ✅ 9 Variant
- ✅ 5 تصویر
- ✅ 3 آدرس
- ✅ 3 نظر

---

## 7️⃣ بررسی Database با Prisma Studio

```bash
npm run prisma:studio

# یا
npx prisma studio
```

این دستور یک UI وب در `http://localhost:5555` باز می‌کنه که می‌تونی:
- ✅ جداول رو ببینی
- ✅ داده‌ها رو ویرایش کنی
- ✅ رکورد جدید اضافه کنی
- ✅ روابط رو بررسی کنی

---

## 8️⃣ استفاده از Prisma Client در کد

### ایجاد Prisma Client Instance:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### مثال استفاده:

```typescript
// مثال: گرفتن لیست محصولات
import { prisma } from '@/lib/prisma';

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
      brand: true,
      images: {
        where: { isPrimary: true },
      },
      variants: {
        where: { isActive: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products;
}

// مثال: ایجاد سفارش
export async function createOrder(data: any) {
  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      userId: data.userId,
      addressId: data.addressId,
      status: 'pending',
      subtotal: data.subtotal,
      totalAmount: data.totalAmount,
      paymentStatus: 'pending',
      items: {
        create: data.items.map((item: any) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      },
    },
    include: {
      items: true,
      address: true,
    },
  });

  return order;
}
```

---

## 9️⃣ دستورات مفید Prisma

```bash
# Generate Prisma Client (بعد از تغییر schema)
npx prisma generate

# ایجاد migration جدید
npx prisma migrate dev --name add_new_field

# اعمال migrations در production
npx prisma migrate deploy

# Reset کردن database (پاک کردن همه داده‌ها)
npx prisma migrate reset

# Format کردن schema
npx prisma format

# Validate کردن schema
npx prisma validate

# بررسی وضعیت migrations
npx prisma migrate status
```

---

## 🔟 Backup و Restore

### Backup:
```bash
# Backup کامل database
pg_dump -U postgres maysa_shop > backup.sql

# Backup فقط schema
pg_dump -U postgres --schema-only maysa_shop > schema.sql

# Backup فقط data
pg_dump -U postgres --data-only maysa_shop > data.sql
```

### Restore:
```bash
# Restore از backup
psql -U postgres maysa_shop < backup.sql
```

---

## 🐛 عیب‌یابی (Troubleshooting)

### مشکل: نمی‌تونم به PostgreSQL وصل بشم
```bash
# بررسی وضعیت PostgreSQL
# Windows
pg_ctl status

# Mac/Linux
sudo systemctl status postgresql

# شروع PostgreSQL
# Windows
pg_ctl start

# Mac
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### مشکل: خطای Authentication
```bash
# ویرایش pg_hba.conf
# Windows: C:\Program Files\PostgreSQL\15\data\pg_hba.conf
# Mac: /usr/local/var/postgres/pg_hba.conf
# Linux: /etc/postgresql/15/main/pg_hba.conf

# تغییر خط زیر:
# از: local   all   all   peer
# به:  local   all   all   md5

# Restart PostgreSQL
```

### مشکل: Port 5432 در حال استفاده است
```bash
# پیدا کردن process
# Windows
netstat -ano | findstr :5432

# Mac/Linux
lsof -i :5432

# تغییر port در DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5433/maysa_shop"
```

### مشکل: Prisma Client out of sync
```bash
# Generate مجدد
npx prisma generate

# یا
npm run prisma:generate
```

---

## 📊 بررسی نصب موفق

بعد از انجام تمام مراحل، این چک‌لیست رو بررسی کن:

- [ ] PostgreSQL نصب و اجرا شده
- [ ] Database ایجاد شده
- [ ] فایل `.env` تنظیم شده
- [ ] Dependencies نصب شدند
- [ ] Migration اجرا شد
- [ ] Seed اجرا شد
- [ ] Prisma Studio باز می‌شه
- [ ] می‌تونی داده‌ها رو ببینی

---

## 🎯 مرحله بعدی

حالا می‌تونی:
1. ✅ Backend API بسازی (Next.js API Routes یا Express)
2. ✅ Authentication پیاده کنی
3. ✅ Frontend رو به Backend وصل کنی
4. ✅ درگاه پرداخت اضافه کنی

---

## 📚 منابع مفید

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

**موفق باشی! 🚀**
