# 🚀 NestJS - راهنمای کامل

## 🤔 NestJS چیست؟

**NestJS** یک فریمورک Node.js پیشرفته برای ساخت Backend های مقیاس‌پذیر و قابل نگهداری است.

### ویژگی‌های کلیدی:
- ✅ **TypeScript-First** - از اول با TypeScript طراحی شده
- ✅ **Architecture محکم** - الهام گرفته از Angular
- ✅ **Modular** - ساختار ماژولار و سازمان‌یافته
- ✅ **Dependency Injection** - مدیریت خودکار وابستگی‌ها
- ✅ **Decorators** - استفاده از Decorators برای تعریف route ها
- ✅ **Built-in Features** - Authentication, Validation, Caching, و...

---

## 🆚 مقایسه: NestJS vs Express

### **Express (ساده و سبک):**

```typescript
// ❌ ساختار آزاد - هر کسی به یک شکل می‌نویسد
import express from 'express';

const app = express();

app.get('/products', async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const product = await createProduct(req.body);
  res.json(product);
});

app.listen(3000);
```

**مشکلات:**
- ❌ بدون ساختار مشخص
- ❌ سخت برای مقیاس‌پذیری
- ❌ کد تکراری زیاد
- ❌ سخت برای تست

---

### **NestJS (ساختاریافته و حرفه‌ای):**

```typescript
// ✅ ساختار مشخص و استاندارد

// products.controller.ts
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}

// products.service.ts
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }

  async create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }
}

// products.module.ts
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

**مزایا:**
- ✅ ساختار واضح و استاندارد
- ✅ Dependency Injection خودکار
- ✅ Decorators برای route ها
- ✅ Validation خودکار
- ✅ راحت برای تست
- ✅ مقیاس‌پذیر

---

## 🎯 چرا NestJS برای پروژه شما عالیه؟

### 1️⃣ **TypeScript Native**
```typescript
// Type Safety کامل در همه جا
interface Product {
  id: string;
  name: string;
  price: number;
}

// IDE بهت می‌گه چه property هایی داری
product.name  // ✅
product.xyz   // ❌ Error
```

### 2️⃣ **Dependency Injection**
```typescript
// بدون DI (Express):
const prisma = new PrismaClient();
const productsService = new ProductsService(prisma);
const productsController = new ProductsController(productsService);

// با DI (NestJS):
// فقط تعریف می‌کنی، NestJS خودش inject می‌کنه
constructor(private productsService: ProductsService) {}
```

### 3️⃣ **Decorators قدرتمند**
```typescript
@Controller('products')  // مسیر اصلی
export class ProductsController {
  
  @Get()  // GET /products
  findAll() {}
  
  @Get(':id')  // GET /products/:id
  findOne(@Param('id') id: string) {}
  
  @Post()  // POST /products
  @UseGuards(AuthGuard)  // نیاز به Authentication
  @Roles('admin')  // فقط Admin
  create(@Body() dto: CreateProductDto) {}
  
  @Put(':id')  // PUT /products/:id
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {}
  
  @Delete(':id')  // DELETE /products/:id
  remove(@Param('id') id: string) {}
}
```

### 4️⃣ **Validation خودکار**
```typescript
// DTO با validation
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  description?: string;
}

// NestJS خودکار validate می‌کنه!
// اگر داده نامعتبر باشه، خطا برمی‌گردونه
```

### 5️⃣ **Guards برای Authorization**
```typescript
// تعریف Guard
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requiredRoles = this.reflector.get('roles', context.getHandler());
    
    return requiredRoles.includes(user.role);
  }
}

// استفاده
@Post()
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
create() {
  // فقط admin و super_admin می‌تونن اجرا کنن
}
```

### 6️⃣ **Pipes برای Transformation**
```typescript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  // اگر id یک UUID معتبر نباشه، خطا می‌ده
}
```

### 7️⃣ **Interceptors برای Logging/Caching**
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    
    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`))
    );
  }
}
```

### 8️⃣ **Exception Filters**
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
```

---

## 📊 ساختار پروژه NestJS

```
maysa-shop-backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── auth/                      # ماژول Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── decorators/
│   │       ├── current-user.decorator.ts
│   │       └── roles.decorator.ts
│   │
│   ├── products/                  # ماژول محصولات
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   └── entities/
│   │       └── product.entity.ts
│   │
│   ├── orders/                    # ماژول سفارشات
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── dto/
│   │
│   ├── users/                     # ماژول کاربران
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │
│   ├── prisma/                    # ماژول Prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── common/                    # مشترک
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── decorators/
│   │
│   └── config/                    # تنظیمات
│       ├── configuration.ts
│       └── validation.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎁 ویژگی‌های Built-in NestJS

### 1. **Authentication & Authorization**
```bash
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/jwt
```

### 2. **Validation**
```bash
npm install class-validator class-transformer
```

### 3. **Configuration**
```bash
npm install @nestjs/config
```

### 4. **Swagger (API Documentation)**
```bash
npm install @nestjs/swagger swagger-ui-express
```

### 5. **Caching**
```bash
npm install @nestjs/cache-manager cache-manager
```

### 6. **Rate Limiting**
```bash
npm install @nestjs/throttler
```

### 7. **File Upload**
```bash
npm install @nestjs/platform-express multer
```

---

## 💪 مزایای NestJS برای پروژه شما

### ✅ **1. مقیاس‌پذیری**
- ساختار ماژولار
- راحت برای اضافه کردن ویژگی جدید
- مناسب برای تیم‌های بزرگ

### ✅ **2. قابل نگهداری**
- کد تمیز و سازمان‌یافته
- استانداردهای مشخص
- راحت برای debug

### ✅ **3. تست‌پذیری**
- Built-in testing utilities
- Dependency Injection برای mock کردن
- Unit و E2E testing

### ✅ **4. مستندسازی خودکار**
- Swagger integration
- API documentation خودکار
- Interactive API explorer

### ✅ **5. Community قوی**
- مستندات عالی
- Plugins زیاد
- پشتیبانی فعال

---

## ⚠️ معایب NestJS

### ❌ **1. Learning Curve**
- پیچیده‌تر از Express
- نیاز به یادگیری Decorators, DI, و...
- زمان بیشتر برای شروع

### ❌ **2. Boilerplate بیشتر**
- فایل‌های بیشتر
- کد بیشتر برای کارهای ساده

### ❌ **3. Performance**
- کمی کندتر از Express خام
- ولی برای اکثر پروژه‌ها قابل قبوله

---

## 🎯 مقایسه نهایی

| ویژگی | Express | NestJS |
|-------|---------|--------|
| Learning Curve | ⭐⭐ آسان | ⭐⭐⭐⭐ متوسط |
| ساختار | ❌ آزاد | ✅ مشخص |
| TypeScript | 😐 نیاز به setup | ✅ Built-in |
| Scalability | 😐 دستی | ✅ خودکار |
| Testing | 😐 دستی | ✅ Built-in |
| Validation | ❌ دستی | ✅ خودکار |
| Documentation | ❌ دستی | ✅ Swagger |
| DI | ❌ ندارد | ✅ دارد |
| Community | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| مناسب برای | پروژه‌های کوچک | پروژه‌های متوسط تا بزرگ |

---

## 💡 توصیه من

### **برای پروژه فروشگاه مایسا: NestJS ⭐⭐⭐⭐⭐**

**چرا؟**
1. ✅ پروژه متوسط تا بزرگ
2. ✅ نیاز به RBAC پیچیده
3. ✅ احتمال توسعه در آینده
4. ✅ تیم ممکنه بزرگ بشه
5. ✅ نیاز به API documentation
6. ✅ TypeScript از اول
7. ✅ ساختار حرفه‌ای

**زمان یادگیری:**
- اگر TypeScript بلدی: 1-2 هفته
- اگر Angular بلدی: 3-5 روز
- اگر Express بلدی: 1 هفته

**ارزششو داره؟**
- برای پروژه شما: **100% بله!** ✅

---

## 🚀 مرحله بعدی

اگر تصمیم گرفتی با NestJS بری، می‌تونم برات:

1. ✅ Setup کامل پروژه NestJS
2. ✅ Integration با Prisma
3. ✅ Authentication با JWT
4. ✅ RBAC کامل (customer, admin, super_admin)
5. ✅ Products Module
6. ✅ Orders Module
7. ✅ Swagger Documentation
8. ✅ و همه چیز دیگه...

**آماده‌ای شروع کنیم؟** 🎉
