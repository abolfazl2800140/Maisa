# 🚀 Maysa Shop - NestJS Backend

بک‌اند حرفه‌ای فروشگاه مایسا با NestJS، Prisma، PostgreSQL

## ✨ ویژگی‌ها

- ✅ **Architecture مدرن** - NestJS با Module-based structure
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **JWT Authentication** - احراز هویت امن
- ✅ **RBAC** - 3 نقش (Customer, Admin, Super Admin)
- ✅ **Swagger Documentation** - مستندات خودکار API
- ✅ **Validation** - اعتبارسنجی کامل با class-validator
- ✅ **Error Handling** - مدیریت خطای حرفه‌ای
- ✅ **PostgreSQL** - دیتابیس قدرتمند
- ✅ **TypeScript** - Type safety کامل

## 📋 پیش‌نیازها

- Node.js 18+
- PostgreSQL 15+
- npm یا yarn

## 🛠️ نصب و راه‌اندازی

### 1. نصب Dependencies

```bash
npm install
```

### 2. تنظیم Database

```bash
# ایجاد فایل .env
cp .env.example .env

# ویرایش .env و تنظیم DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/maysa_shop"
```

### 3. اجرای Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# اجرای migrations
npm run prisma:migrate

# Seed داده‌های اولیه
npm run prisma:seed
```

### 4. اجرای سرور

```bash
# Development mode
npm run nest:dev

# Production mode
npm run nest:build
npm run nest:start:prod
```

سرور در آدرس `http://localhost:4000` اجرا می‌شود.

## 📚 API Documentation

بعد از اجرای سرور، Swagger docs در آدرس زیر در دسترس است:

```
http://localhost:4000/api/docs
```

## 🔐 احراز هویت

### ثبت‌نام

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "علی",
  "lastName": "احمدی",
  "phone": "09123456789"
}
```

### ورود

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

Response:
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### استفاده از Token

```bash
GET /auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## 👥 نقش‌ها و دسترسی‌ها

### Customer (مشتری)
- خرید محصولات
- مدیریت سبد خرید
- مدیریت علاقه‌مندی‌ها
- ثبت نظر
- مشاهده سفارشات خود

### Admin (ادمین)
- همه دسترسی‌های Customer +
- مدیریت محصولات (CRUD)
- مدیریت دسته‌بندی‌ها
- مشاهده همه سفارشات
- تایید/رد نظرات

### Super Admin (سوپر ادمین)
- همه دسترسی‌های Admin +
- مدیریت کاربران
- تغییر نقش کاربران
- دسترسی کامل به سیستم

## 📁 ساختار پروژه

```
src/
├── auth/                    # احراز هویت
│   ├── decorators/         # Custom decorators
│   ├── dto/                # Data Transfer Objects
│   ├── guards/             # Auth & Role guards
│   ├── strategies/         # JWT strategy
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                   # مدیریت کاربران
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── products/                # محصولات
│   ├── dto/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── categories/              # دسته‌بندی‌ها
├── orders/                  # سفارشات
├── reviews/                 # نظرات
├── prisma/                  # Prisma service
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts            # Root module
└── main.ts                  # Entry point

prisma/
├── schema.prisma            # Database schema
├── migrations/              # Database migrations
└── seed.ts                  # Seed data
```

## 🔑 اطلاعات ورود پیش‌فرض

بعد از اجرای seed:

```
Super Admin:
  Email: admin@maysa.com
  Password: Admin@123

Admin:
  Email: support@maysa.com
  Password: Admin@123

Customer:
  Email: user@example.com
  Password: User@123
```

## 📊 Endpoints اصلی

### Authentication
- `POST /auth/register` - ثبت‌نام
- `POST /auth/login` - ورود
- `GET /auth/me` - اطلاعات کاربر فعلی

### Users (فقط Super Admin)
- `GET /users` - لیست کاربران
- `GET /users/:id` - دریافت کاربر
- `PATCH /users/:id` - ویرایش کاربر
- `PATCH /users/:id/role` - تغییر نقش
- `PATCH /users/:id/toggle-active` - فعال/غیرفعال

### Products
- `GET /products` - لیست محصولات (با فیلتر و جستجو)
- `GET /products/:id` - دریافت محصول
- `GET /products/slug/:slug` - دریافت با slug
- `POST /products` - ایجاد محصول (Admin)
- `PATCH /products/:id` - ویرایش محصول (Admin)
- `DELETE /products/:id` - حذف محصول (Admin)

### Categories
- `GET /categories` - لیست دسته‌بندی‌ها
- `GET /categories/:id` - دریافت دسته‌بندی
- `POST /categories` - ایجاد (Admin)
- `PATCH /categories/:id` - ویرایش (Admin)
- `DELETE /categories/:id` - حذف (Admin)

### Orders
- `GET /orders` - لیست سفارشات
- `GET /orders/:id` - جزئیات سفارش
- `POST /orders` - ایجاد سفارش
- `PATCH /orders/:id/status` - تغییر وضعیت (Admin)

### Reviews
- `GET /reviews/product/:productId` - نظرات محصول
- `POST /reviews` - ثبت نظر
- `PATCH /reviews/:id/approve` - تایید نظر (Admin)
- `DELETE /reviews/:id` - حذف نظر (Admin)

## 🔧 دستورات مفید

```bash
# Prisma Studio (مدیریت دیتابیس)
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Format Prisma schema
npx prisma format
```

## 🧪 تست API

### با cURL

```bash
# ثبت‌نام
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'

# ورود
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maysa.com","password":"Admin@123"}'

# دریافت محصولات
curl http://localhost:4000/products

# دریافت محصولات با فیلتر
curl "http://localhost:4000/products?page=1&limit=10&categoryId=xxx&minPrice=100000&maxPrice=500000"
```

### با Postman

1. Import کردن Swagger JSON از `/api/docs-json`
2. تنظیم Bearer Token در Authorization
3. تست endpoints

## 🌍 متغیرهای محیطی

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/maysa_shop"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# Frontend
FRONTEND_URL="http://localhost:3000"
```

## 🚀 Deploy

### با Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run prisma:generate
RUN npm run nest:build
EXPOSE 4000
CMD ["npm", "run", "nest:start:prod"]
```

### با PM2

```bash
npm install -g pm2
npm run nest:build
pm2 start dist/main.js --name maysa-api
```

## 📝 TODO

- [ ] Rate Limiting
- [ ] Redis Caching
- [ ] File Upload (Multer)
- [ ] Email Service
- [ ] SMS Service
- [ ] Payment Gateway Integration
- [ ] WebSocket for real-time updates
- [ ] Unit & E2E Tests
- [ ] Docker Compose
- [ ] CI/CD Pipeline

## 🤝 مشارکت

1. Fork کنید
2. Branch جدید بسازید
3. تغییرات را commit کنید
4. Push کنید
5. Pull Request باز کنید

## 📄 License

MIT

---

**ساخته شده با ❤️ برای فروشگاه مایسا**
