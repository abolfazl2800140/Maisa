# خلاصه رفع مشکل آپلود تصاویر

## مشکل
خطای `request entity too large` هنگام اضافه کردن محصول با تصاویر

## علت
ارسال تصاویر به صورت base64 در بادی JSON که سایز ریکوئست رو خیلی بزرگ می‌کرد

## راهکار
پیاده‌سازی سیستم آپلود مستقیم فایل با Multipart/Form-Data

## فایل‌های جدید
```
src/upload/
├── upload.module.ts       # ماژول آپلود
├── upload.controller.ts   # API endpoints
└── upload.service.ts      # لوژیک آپلود و ذخیره فایل

public/uploads/            # پوشه ذخیره تصاویر
└── .gitkeep
```

## تغییرات
1. ✅ افزودن ماژول آپلود در بک‌اند
2. ✅ افزایش body size limit به 50MB
3. ✅ اضافه کردن API های آپلود در `lib/api/admin.ts`
4. ✅ تغییر `handleFileUpload` در صفحه افزودن محصول
5. ✅ تنظیم .gitignore برای فایل‌های آپلود شده

## نحوه استفاده
1. بک‌اند رو ریستارت کنید: `npm run nest:dev`
2. فرانت‌اند رو ریستارت کنید: `npm run dev`
3. محصول جدید اضافه کنید و تصاویر رو آپلود کنید

## API Endpoints جدید
- `POST /upload/image` - آپلود یک تصویر
- `POST /upload/images` - آپلود چند تصویر (حداکثر 10)

## محدودیت‌ها
- فرمت: JPG, PNG, WebP
- حداکثر حجم: 5MB per file
- حداکثر تعداد: 10 files per request

برای جزئیات بیشتر: `راهنمای-آپلود-تصاویر.md`
