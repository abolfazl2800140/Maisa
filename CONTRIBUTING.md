# راهنمای توسعه پروژه

## اضافه کردن محصول جدید

1. فایل `data/products.json` را باز کنید
2. یک آبجکت جدید با ساختار زیر اضافه کنید:

```json
{
  "id": "4",
  "name": "نام محصول",
  "slug": "product-slug",
  "description": "توضیحات محصول",
  "price": 1000000,
  "originalPrice": 1200000,
  "category": "backpack",
  "images": ["/images/products/product-1.jpg"],
  "inStock": true,
  "featured": false,
  "rating": 4.5,
  "reviewCount": 10
}
```

3. تصاویر محصول را در `public/images/products/` قرار دهید

## اضافه کردن مقاله بلاگ

1. فایل `data/blog.json` را باز کنید
2. مقاله جدید را اضافه کنید
3. تصویر مقاله را در `public/images/blog/` قرار دهید

## اضافه کردن دسته‌بندی جدید

1. فایل `data/categories.json` را ویرایش کنید
2. در `types/index.ts` نوع دسته‌بندی را به union type اضافه کنید
3. منوی Header را در `components/layout/Header.tsx` آپدیت کنید

## استایل‌دهی

- از Tailwind CSS استفاده کنید
- رنگ‌های اصلی: `primary`, `secondary`
- از کلاس‌های responsive استفاده کنید: `md:`, `lg:`

## کامپوننت‌های جدید

کامپوننت‌ها را در فولدر مناسب قرار دهید:
- `components/ui/` - کامپوننت‌های عمومی UI
- `components/layout/` - کامپوننت‌های Layout
- `components/product/` - کامپوننت‌های مرتبط با محصول
- `components/carousel/` - کامپوننت‌های Carousel

## تست

قبل از commit:
1. پروژه را build کنید: `npm run build`
2. خطاهای TypeScript را بررسی کنید
3. در مرورگرهای مختلف تست کنید
4. Responsive بودن را چک کنید

## SEO

برای هر صفحه جدید:
- Metadata مناسب اضافه کنید
- از Structured Data استفاده کنید
- Alt text برای تصاویر
- Heading hierarchy را رعایت کنید
