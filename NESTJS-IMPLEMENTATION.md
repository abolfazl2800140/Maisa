# 🎉 پیاده‌سازی کامل NestJS Backend

## ✅ چیزهایی که ساخته شد

### 1️⃣ ساختار پروژه

```
src/
├── auth/                    ✅ احراز هویت کامل
│   ├── decorators/         ✅ @GetUser, @Roles
│   ├── dto/                ✅ RegisterDto, LoginDto
│   ├── guards/             ✅ JwtAuthGuard, RolesGuard
│   ├── strategies/         ✅ JWT Strategy
│   └── auth.module.ts
├── users/                   ✅ مدیریت کاربران
├── products/                ✅ مدیریت محصولات
├── categories/              ✅ دسته‌بندی‌ها
├── orders/                  ✅ سفارشات
├── reviews/                 ✅ نظرات
├── prisma/                  ✅ Prisma Service
├── app.module.ts
└── main.ts

prisma/
├── schema.prisma            ✅ Schema کامل
├── seed.ts                  ✅ داده‌های اولیه
└── migrations/
```

### 2️⃣ ویژگی‌های پیاده‌سازی شده

#### 🔐 Authentication & Authorization
- ✅ JWT Authentication
- ✅ Password Hashing با bcrypt
- ✅ Register & Login
- ✅ Get Current User
- ✅ Role-based Access Control (RBAC)
- ✅ 3 نقش: Customer, Admin, Super Admin

#### 👥 Users Module
- ✅ لیست کاربران (فقط Super Admin)
- ✅ دریافت اطلاعات کاربر
- ✅ ویرایش پروفایل
- ✅ تغییر نقش (فقط Super Admin)
- ✅ فعال/غیرفعال کردن کاربر

#### 📦 Products Module
- ✅ CRUD کامل محصولات
- ✅ فیلتر و جستجو
- ✅ Pagination
- ✅ Sort (قیمت، تاریخ، فروش، امتیاز)
- ✅ دریافت با ID یا Slug
- ✅ افزایش تعداد بازدید
- ✅ محصولات ویژه
- ✅ تصاویر چندگانه
- ✅ Variants (رنگ، سایز)

#### 📂 Categories Module
- ✅ CRUD دسته‌بندی‌ها
- ✅ دسته‌بندی‌های تو در تو (Parent-Child)
- ✅ شمارش محصولات هر دسته

#### 🛒 Orders Module
- ✅ ایجاد سفارش
- ✅ لیست سفارشات (کاربر فقط خودش، ادمین همه)
- ✅ جزئیات سفارش
- ✅ تغییر وضعیت (فقط ادمین)
- ✅ محاسبه خودکار قیمت نهایی

#### ⭐ Reviews Module
- ✅ ثبت نظر
- ✅ یک نظر برای هر کاربر در هر محصول
- ✅ تایید نظر (فقط ادمین)
- ✅ حذف نظر (فقط ادمین)
- ✅ نمایش نظرات تایید شده

### 3️⃣ Prisma Schema

```prisma
✅ User (با 3 نقش)
✅ Category (با Parent-Child)
✅ Brand
✅ Product (با همه ویژگی‌ها)
✅ ProductImage (چند تصویر)
✅ ProductVariant (رنگ، سایز، موجودی)
✅ Address (چند آدرس برای هر کاربر)
✅ Order (با وضعیت‌های مختلف)
✅ OrderItem
✅ Review (با تایید ادمین)
✅ Wishlist
```

### 4️⃣ Swagger Documentation

✅ مستندات خودکار API
✅ Bearer Authentication
✅ تگ‌بندی endpoints
✅ مثال‌های کامل
✅ در دسترس در: `http://localhost:4000/api/docs`

### 5️⃣ Validation

✅ class-validator برای همه DTOs
✅ پیام‌های خطا به فارسی
✅ Transform و Sanitize خودکار
✅ Type safety کامل

### 6️⃣ Error Handling

✅ Exception Filters
✅ پیام‌های خطای واضح
✅ HTTP Status Codes صحیح
✅ Validation Errors

### 7️⃣ Security

✅ Password Hashing
✅ JWT Token
✅ CORS Configuration
✅ Role-based Guards
✅ Input Validation
✅ SQL Injection Prevention (Prisma)

---

## 🚀 راه‌اندازی سریع

### 1. نصب Dependencies

```bash
npm install
```

### 2. تنظیم Database

```bash
# کپی فایل .env
cp .env.example .env

# ویرایش DATABASE_URL در .env
DATABASE_URL="postgresql://user:password@localhost:5432/maysa_shop"
```

### 3. اجرای Prisma

```bash
# Generate Client
npm run prisma:generate

# اجرای Migrations
npm run prisma:migrate

# Seed داده‌های اولیه
npm run prisma:seed
```

### 4. اجرای سرور

```bash
npm run nest:dev
```

سرور در `http://localhost:4000` اجرا می‌شود.

---

## 📝 اطلاعات ورود

بعد از seed:

```
Super Admin:
  📧 admin@maysa.com
  🔑 Admin@123

Admin:
  📧 support@maysa.com
  🔑 Admin@123

Customer:
  📧 user@example.com
  🔑 User@123
```

---

## 🧪 تست سریع

### 1. ورود به سیستم

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@maysa.com",
    "password": "Admin@123"
  }'
```

پاسخ:
```json
{
  "user": {
    "id": "...",
    "email": "admin@maysa.com",
    "role": "super_admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. دریافت محصولات

```bash
curl http://localhost:4000/products
```

### 3. دریافت اطلاعات کاربر فعلی

```bash
curl http://localhost:4000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. لیست کاربران (فقط Super Admin)

```bash
curl http://localhost:4000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 جدول دسترسی‌ها

| Endpoint | Customer | Admin | Super Admin |
|----------|----------|-------|-------------|
| GET /products | ✅ | ✅ | ✅ |
| POST /products | ❌ | ✅ | ✅ |
| PATCH /products/:id | ❌ | ✅ | ✅ |
| DELETE /products/:id | ❌ | ✅ | ✅ |
| GET /orders | ✅ (خودش) | ✅ (همه) | ✅ (همه) |
| PATCH /orders/:id/status | ❌ | ✅ | ✅ |
| POST /reviews | ✅ | ✅ | ✅ |
| PATCH /reviews/:id/approve | ❌ | ✅ | ✅ |
| GET /users | ❌ | ❌ | ✅ |
| PATCH /users/:id/role | ❌ | ❌ | ✅ |

---

## 🎯 Endpoints اصلی

### Authentication
```
POST   /auth/register          ثبت‌نام
POST   /auth/login             ورود
GET    /auth/me                اطلاعات کاربر فعلی
```

### Users (Super Admin)
```
GET    /users                  لیست کاربران
GET    /users/:id              دریافت کاربر
PATCH  /users/:id              ویرایش کاربر
PATCH  /users/:id/role         تغییر نقش
PATCH  /users/:id/toggle-active فعال/غیرفعال
```

### Products
```
GET    /products               لیست محصولات (با فیلتر)
GET    /products/:id           دریافت محصول
GET    /products/slug/:slug    دریافت با slug
POST   /products               ایجاد محصول (Admin)
PATCH  /products/:id           ویرایش محصول (Admin)
DELETE /products/:id           حذف محصول (Admin)
```

### Categories
```
GET    /categories             لیست دسته‌بندی‌ها
GET    /categories/:id         دریافت دسته‌بندی
POST   /categories             ایجاد (Admin)
PATCH  /categories/:id         ویرایش (Admin)
DELETE /categories/:id         حذف (Admin)
```

### Orders
```
GET    /orders                 لیست سفارشات
GET    /orders/:id             جزئیات سفارش
POST   /orders                 ایجاد سفارش
PATCH  /orders/:id/status      تغییر وضعیت (Admin)
```

### Reviews
```
GET    /reviews/product/:id    نظرات محصول
POST   /reviews                ثبت نظر
PATCH  /reviews/:id/approve    تایید نظر (Admin)
DELETE /reviews/:id            حذف نظر (Admin)
```

---

## 🔧 دستورات مفید

```bash
# Development
npm run nest:dev              # اجرای dev server با watch mode

# Build
npm run nest:build            # Build برای production

# Production
npm run nest:start:prod       # اجرای production server

# Prisma
npm run prisma:generate       # Generate Prisma Client
npm run prisma:migrate        # اجرای migrations
npm run prisma:studio         # باز کردن Prisma Studio
npm run prisma:seed           # Seed داده‌های اولیه

# Database
npx prisma migrate dev --name migration_name  # ایجاد migration جدید
npx prisma migrate reset      # Reset database
npx prisma db push            # Push schema بدون migration
```

---

## 📚 مستندات

- **Swagger UI:** http://localhost:4000/api/docs
- **Swagger JSON:** http://localhost:4000/api/docs-json
- **Prisma Studio:** `npm run prisma:studio`

---

## 🎨 معماری

### Module Structure
```
AppModule
├── ConfigModule (Global)
├── PrismaModule (Global)
├── AuthModule
│   └── UsersModule
├── ProductsModule
├── CategoriesModule
├── OrdersModule
└── ReviewsModule
```

### Guards & Decorators
```typescript
// استفاده از Guards
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.super_admin)

// استفاده از Decorators
@GetUser('id') userId: string
@GetUser('role') userRole: UserRole
@GetUser() user: User
```

---

## 🔒 امنیت

✅ Password hashing با bcrypt (10 rounds)
✅ JWT token با expiration
✅ Role-based access control
✅ Input validation
✅ SQL injection prevention (Prisma)
✅ CORS configuration
✅ Environment variables

---

## 📈 Performance

✅ Prisma query optimization
✅ Pagination برای لیست‌ها
✅ Select فقط فیلدهای مورد نیاز
✅ Index‌های database
✅ Lazy loading برای relations

---

## 🐛 Debugging

```bash
# لاگ‌های Prisma
DEBUG=prisma:* npm run nest:dev

# لاگ‌های Query
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=20&log=query"
```

---

## 🚀 آماده برای Production!

همه چیز آماده است:
- ✅ Authentication & Authorization
- ✅ CRUD کامل
- ✅ Validation
- ✅ Error Handling
- ✅ Documentation
- ✅ Security
- ✅ RBAC
- ✅ Seed Data

فقط کافیه:
1. Database رو راه‌اندازی کنی
2. `.env` رو تنظیم کنی
3. Migration و Seed رو اجرا کنی
4. سرور رو start کنی

**بک‌اند آماده است! 🎉**

---

**ساخته شده با ❤️ برای فروشگاه مایسا**
