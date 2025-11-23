# 🚀 ساختار Backend جداگانه - فروشگاه مایسا

## 📁 ساختار پروژه Backend

```
maysa-shop-backend/
├── src/
│   ├── config/              # تنظیمات
│   │   ├── database.ts      # تنظیمات Prisma
│   │   ├── jwt.ts           # تنظیمات JWT
│   │   └── env.ts           # Environment variables
│   │
│   ├── middleware/          # Middleware ها
│   │   ├── auth.ts          # Authentication
│   │   ├── rbac.ts          # Role-Based Access Control
│   │   ├── errorHandler.ts # Error handling
│   │   ├── validator.ts     # Validation
│   │   └── logger.ts        # Logging
│   │
│   ├── routes/              # Route ها
│   │   ├── index.ts         # Main router
│   │   ├── auth.routes.ts   # Authentication routes
│   │   ├── products.routes.ts
│   │   ├── categories.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── users.routes.ts
│   │   ├── reviews.routes.ts
│   │   ├── wishlist.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── payment.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── controllers/         # Controller ها
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── categories.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── users.controller.ts
│   │   ├── reviews.controller.ts
│   │   ├── wishlist.controller.ts
│   │   ├── cart.controller.ts
│   │   └── payment.controller.ts
│   │
│   ├── services/            # Business Logic
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── orders.service.ts
│   │   ├── users.service.ts
│   │   ├── email.service.ts
│   │   ├── sms.service.ts
│   │   └── payment.service.ts
│   │
│   ├── validators/          # Validation schemas
│   │   ├── auth.validator.ts
│   │   ├── product.validator.ts
│   │   ├── order.validator.ts
│   │   └── user.validator.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── express.d.ts     # Express type extensions
│   │   ├── auth.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/               # Utilities
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   ├── response.ts
│   │   └── helpers.ts
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── tests/                   # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 package.json

```json
{
  "name": "maysa-shop-backend",
  "version": "1.0.0",
  "description": "Backend API for Maysa Shop",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5",
    "@types/cors": "^2.8.17",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "@types/compression": "^1.7.5",
    "@types/cookie-parser": "^1.4.6",
    "@types/multer": "^1.4.11",
    "@types/nodemailer": "^6.4.14",
    "prisma": "^5.7.0",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "ts-jest": "^29.1.1",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1"
  }
}
```

---

## ⚙️ tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@config/*": ["config/*"],
      "@middleware/*": ["middleware/*"],
      "@routes/*": ["routes/*"],
      "@controllers/*": ["controllers/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## 🔧 .env.example

```env
# Server
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001

# Frontend
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/maysa_shop?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_ROUNDS=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@maysa.com

# SMS (برای ارسال OTP)
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://api.sms-provider.com

# Payment Gateway (زرین‌پال)
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_SANDBOX=true

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Logging
LOG_LEVEL=debug
```

---

## 🎯 نکات مهم:

### 1. جداسازی Concerns
- **Routes**: فقط مسیریابی
- **Controllers**: دریافت request و ارسال response
- **Services**: Business Logic
- **Validators**: اعتبارسنجی داده‌ها

### 2. امنیت
- Helmet برای HTTP headers
- CORS برای Cross-Origin
- Rate Limiting برای جلوگیری از حملات
- JWT برای Authentication
- Bcrypt برای Hash کردن پسورد

### 3. Error Handling
- Centralized error handling
- Custom error classes
- Proper HTTP status codes

### 4. Validation
- express-validator برای اعتبارسنجی
- Validation در سطح route

### 5. Logging
- Morgan برای HTTP logs
- Custom logger برای application logs

---

## 🚀 مراحل راه‌اندازی:

```bash
# 1. ایجاد پوشه پروژه
mkdir maysa-shop-backend
cd maysa-shop-backend

# 2. مقداردهی اولیه
npm init -y

# 3. نصب dependencies
npm install express cors helmet dotenv bcrypt jsonwebtoken express-validator express-rate-limit morgan compression cookie-parser @prisma/client

# 4. نصب devDependencies
npm install -D typescript @types/express @types/node @types/cors @types/bcrypt @types/jsonwebtoken ts-node nodemon prisma

# 5. مقداردهی TypeScript
npx tsc --init

# 6. مقداردهی Prisma
npx prisma init

# 7. ایجاد ساختار پوشه‌ها
mkdir -p src/{config,middleware,routes,controllers,services,validators,types,utils}

# 8. کپی schema.prisma از پروژه قبلی

# 9. اجرای migration
npx prisma migrate dev --name init

# 10. Seed کردن
npx prisma db seed

# 11. اجرای سرور
npm run dev
```

---

## 📝 در مرحله بعد:

من می‌تونم برات ایجاد کنم:
1. ✅ فایل‌های اصلی (server.ts, app.ts)
2. ✅ Middleware ها (auth, rbac, error handling)
3. ✅ Routes و Controllers
4. ✅ Services
5. ✅ Validators
6. ✅ Utils

**آماده‌ای که شروع کنیم؟** 🚀
