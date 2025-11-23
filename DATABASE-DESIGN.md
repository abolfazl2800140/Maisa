# 🗄️ طراحی Database - فروشگاه مایسا

## 📋 خلاصه نیازمندی‌ها

- ✅ محصولات با Variant (رنگ، سایز)
- ✅ چند تصویر برای هر محصول
- ✅ سیستم موجودی
- ✅ سیستم امتیازدهی/وفاداری
- ✅ یک فروشنده (خود کاربر)
- ✅ یک درگاه پرداخت
- ❌ بدون خرید اقساطی
- ❌ بدون پیگیری پیچیده ارسال (فعلاً)

---

## 📊 ساختار جداول (11 جدول اصلی)

### 1️⃣ users - کاربران
```sql
- id (UUID, Primary Key)
- email (VARCHAR, UNIQUE, NOT NULL)
- password_hash (VARCHAR, NOT NULL)
- first_name (VARCHAR)
- last_name (VARCHAR)
- phone (VARCHAR, UNIQUE)
- avatar (VARCHAR) - URL تصویر پروفایل
- loyalty_points (INTEGER, DEFAULT 0) - امتیاز وفاداری
- role (ENUM: 'customer', 'admin', DEFAULT 'customer')
- email_verified (BOOLEAN, DEFAULT false)
- phone_verified (BOOLEAN, DEFAULT false)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 2️⃣ categories - دسته‌بندی‌ها
```sql
- id (UUID, Primary Key)
- name (VARCHAR, NOT NULL)
- slug (VARCHAR, UNIQUE, NOT NULL)
- description (TEXT)
- image (VARCHAR) - تصویر دسته‌بندی
- parent_id (UUID, Foreign Key -> categories.id) - برای زیردسته
- display_order (INTEGER, DEFAULT 0)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 3️⃣ brands - برندها
```sql
- id (UUID, Primary Key)
- name (VARCHAR, NOT NULL)
- slug (VARCHAR, UNIQUE, NOT NULL)
- logo (VARCHAR) - لوگوی برند
- description (TEXT)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 4️⃣ products - محصولات
```sql
- id (UUID, Primary Key)
- name (VARCHAR, NOT NULL)
- slug (VARCHAR, UNIQUE, NOT NULL)
- description (TEXT)
- category_id (UUID, Foreign Key -> categories.id)
- brand_id (UUID, Foreign Key -> brands.id, NULLABLE)
- base_price (DECIMAL(10,2), NOT NULL) - قیمت پایه
- discount_percentage (INTEGER, DEFAULT 0)
- final_price (DECIMAL(10,2)) - قیمت نهایی (محاسبه شده)
- sku (VARCHAR, UNIQUE) - کد محصول
- weight (DECIMAL(8,2)) - وزن (گرم)
- dimensions (JSONB) - ابعاد {length, width, height}
- features (JSONB) - ویژگی‌ها
- tags (TEXT[]) - تگ‌ها
- rating_average (DECIMAL(3,2), DEFAULT 0)
- rating_count (INTEGER, DEFAULT 0)
- review_count (INTEGER, DEFAULT 0)
- view_count (INTEGER, DEFAULT 0)
- sales_count (INTEGER, DEFAULT 0)
- is_featured (BOOLEAN, DEFAULT false)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 5️⃣ product_images - تصاویر محصولات
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key -> products.id, ON DELETE CASCADE)
- image_url (VARCHAR, NOT NULL)
- alt_text (VARCHAR)
- display_order (INTEGER, DEFAULT 0)
- is_primary (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMP)
```

### 6️⃣ product_variants - انواع محصول (رنگ، سایز)
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key -> products.id, ON DELETE CASCADE)
- sku (VARCHAR, UNIQUE, NOT NULL)
- color (VARCHAR) - رنگ
- color_code (VARCHAR) - کد رنگ HEX
- size (VARCHAR) - سایز
- price_adjustment (DECIMAL(10,2), DEFAULT 0) - تفاوت قیمت با پایه
- stock_quantity (INTEGER, DEFAULT 0) - موجودی
- low_stock_threshold (INTEGER, DEFAULT 5)
- image_url (VARCHAR) - تصویر اختصاصی variant
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 7️⃣ addresses - آدرس‌های کاربران
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id, ON DELETE CASCADE)
- title (VARCHAR) - عنوان (خانه، محل کار)
- full_name (VARCHAR, NOT NULL)
- phone (VARCHAR, NOT NULL)
- province (VARCHAR, NOT NULL)
- city (VARCHAR, NOT NULL)
- postal_code (VARCHAR, NOT NULL)
- address_line (TEXT, NOT NULL)
- is_default (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 8️⃣ orders - سفارشات
```sql
- id (UUID, Primary Key)
- order_number (VARCHAR, UNIQUE, NOT NULL) - شماره سفارش
- user_id (UUID, Foreign Key -> users.id)
- address_id (UUID, Foreign Key -> addresses.id)
- status (ENUM: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- subtotal (DECIMAL(10,2), NOT NULL) - جمع محصولات
- discount_amount (DECIMAL(10,2), DEFAULT 0)
- shipping_cost (DECIMAL(10,2), DEFAULT 0)
- tax_amount (DECIMAL(10,2), DEFAULT 0)
- total_amount (DECIMAL(10,2), NOT NULL) - مبلغ نهایی
- coupon_code (VARCHAR, NULLABLE)
- loyalty_points_used (INTEGER, DEFAULT 0)
- loyalty_points_earned (INTEGER, DEFAULT 0)
- payment_method (VARCHAR) - روش پرداخت
- payment_status (ENUM: 'pending', 'paid', 'failed', 'refunded')
- notes (TEXT) - یادداشت کاربر
- admin_notes (TEXT) - یادداشت ادمین
- tracking_code (VARCHAR) - کد رهگیری پست
- shipped_at (TIMESTAMP)
- delivered_at (TIMESTAMP)
- cancelled_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 9️⃣ order_items - آیتم‌های سفارش
```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key -> orders.id, ON DELETE CASCADE)
- product_id (UUID, Foreign Key -> products.id)
- variant_id (UUID, Foreign Key -> product_variants.id, NULLABLE)
- product_name (VARCHAR, NOT NULL) - ذخیره نام (برای تاریخچه)
- variant_details (JSONB) - جزئیات variant
- quantity (INTEGER, NOT NULL)
- unit_price (DECIMAL(10,2), NOT NULL)
- discount_amount (DECIMAL(10,2), DEFAULT 0)
- total_price (DECIMAL(10,2), NOT NULL)
- created_at (TIMESTAMP)
```

### 🔟 reviews - نظرات و امتیازها
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key -> products.id, ON DELETE CASCADE)
- user_id (UUID, Foreign Key -> users.id, ON DELETE CASCADE)
- order_id (UUID, Foreign Key -> orders.id, NULLABLE)
- rating (INTEGER, NOT NULL, CHECK: 1-5)
- title (VARCHAR)
- comment (TEXT)
- pros (TEXT[]) - نقاط قوت
- cons (TEXT[]) - نقاط ضعف
- is_verified_purchase (BOOLEAN, DEFAULT false)
- is_approved (BOOLEAN, DEFAULT false)
- helpful_count (INTEGER, DEFAULT 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

UNIQUE CONSTRAINT: (product_id, user_id) - هر کاربر یک نظر
```

### 1️⃣1️⃣ wishlist - علاقه‌مندی‌ها
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id, ON DELETE CASCADE)
- product_id (UUID, Foreign Key -> products.id, ON DELETE CASCADE)
- created_at (TIMESTAMP)

UNIQUE CONSTRAINT: (user_id, product_id)
```

---

## 🔗 روابط (Relations)

```
users (1) -----> (N) addresses
users (1) -----> (N) orders
users (1) -----> (N) reviews
users (1) -----> (N) wishlist

categories (1) -----> (N) products
categories (1) -----> (N) categories (parent-child)

brands (1) -----> (N) products

products (1) -----> (N) product_images
products (1) -----> (N) product_variants
products (1) -----> (N) reviews
products (1) -----> (N) wishlist
products (1) -----> (N) order_items

orders (1) -----> (N) order_items
orders (1) -----> (1) addresses

product_variants (1) -----> (N) order_items
```

---

## 📌 Indexes پیشنهادی (برای Performance)

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);

-- Product Variants
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- Wishlist
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
```

---

## 🎯 ویژگی‌های خاص PostgreSQL

### 1. Full-Text Search برای محصولات
```sql
-- اضافه کردن ستون tsvector
ALTER TABLE products ADD COLUMN search_vector tsvector;

-- ایجاد index
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Trigger برای به‌روزرسانی خودکار
CREATE TRIGGER products_search_update
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.persian', name, description);
```

### 2. JSONB برای داده‌های Flexible
```sql
-- مثال: ویژگی‌های محصول
{
  "material": "چرم طبیعی",
  "waterproof": true,
  "warranty": "12 ماه",
  "compartments": 3
}

-- Query:
SELECT * FROM products 
WHERE features @> '{"waterproof": true}';
```

### 3. Array برای Tags
```sql
-- مثال: تگ‌های محصول
tags: ['کیف-چرمی', 'ضدآب', 'مسافرتی']

-- Query:
SELECT * FROM products 
WHERE 'ضدآب' = ANY(tags);
```

---

## 💾 Seed Data (داده‌های اولیه)

### Categories:
- کوله پشتی
  - کوله پشتی مدرسه
  - کوله پشتی لپ‌تاپ
  - کوله پشتی ورزشی
- کیف دستی
- کیف لپ‌تاپ
- چمدان
- لوازم جانبی

### Brands:
- مایسا
- دلسی
- سامسونایت
- کاترپیلار

---

## 🔐 Security Best Practices

1. **Password Hashing:** bcrypt با salt rounds 10+
2. **UUID:** استفاده از UUID v4 برای IDs
3. **Soft Delete:** نگه‌داشتن داده‌ها با is_active
4. **Timestamps:** همیشه created_at و updated_at
5. **Foreign Keys:** CASCADE برای یکپارچگی
6. **Constraints:** CHECK constraints برای validation

---

## 📈 Scalability Considerations

1. **Partitioning:** برای جدول orders (بر اساس تاریخ)
2. **Caching:** Redis برای محصولات پربازدید
3. **Read Replicas:** برای query های سنگین
4. **Connection Pooling:** PgBouncer
5. **Materialized Views:** برای گزارش‌ها

---

## 🎁 امتیازدهی/وفاداری (Loyalty System)

### قوانین پیشنهادی:
```javascript
// کسب امتیاز
- هر 10,000 تومان خرید = 1 امتیاز
- ثبت نظر = 5 امتیاز
- معرفی دوست = 10 امتیاز

// استفاده از امتیاز
- هر 1 امتیاز = 1,000 تومان تخفیف
- حداکثر 20% از مبلغ سفارش
```

### پیاده‌سازی:
```sql
-- در جدول users
loyalty_points (INTEGER, DEFAULT 0)

-- در جدول orders
loyalty_points_used (INTEGER, DEFAULT 0)
loyalty_points_earned (INTEGER, DEFAULT 0)
```

---

## 📊 Business Logic در Database

### 1. محاسبه قیمت نهایی محصول
```sql
CREATE OR REPLACE FUNCTION calculate_final_price()
RETURNS TRIGGER AS $$
BEGIN
  NEW.final_price = NEW.base_price * (1 - NEW.discount_percentage / 100.0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_final_price
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION calculate_final_price();
```

### 2. به‌روزرسانی موجودی بعد از سفارش
```sql
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid' THEN
    UPDATE product_variants
    SET stock_quantity = stock_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id 
    AND oi.variant_id = product_variants.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. به‌روزرسانی امتیاز محصول
```sql
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    rating_average = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id AND is_approved = true),
    rating_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = true),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = true)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();
```

---

## ✅ Checklist پیاده‌سازی

- [ ] نصب PostgreSQL
- [ ] ایجاد Database
- [ ] اجرای Schema
- [ ] ایجاد Indexes
- [ ] ایجاد Triggers
- [ ] Seed Data
- [ ] تست Relations
- [ ] تست Performance
- [ ] Backup Strategy

---

**تاریخ ایجاد:** 23 نوامبر 2025
**نسخه:** 1.0
**وضعیت:** آماده برای پیاده‌سازی ✅
