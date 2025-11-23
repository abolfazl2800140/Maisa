# 🛍️ فروشگاه آنلاین مایسا

فروشگاه آنلاین حرفه‌ای کیف و کوله پشتی با Next.js 14 و TypeScript

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ ویژگی‌های برجسته

### 🛒 E-commerce
- ✅ سبد خرید کامل با localStorage
- ✅ لیست علاقه‌مندی‌ها
- ✅ مقایسه محصولات (تا 4 محصول)
- ✅ Quick View Modal
- ✅ Cross-Selling هوشمند
- ✅ کد تخفیف
- ✅ مدیریت آدرس‌ها
- ✅ پیگیری سفارشات
- ✅ محصولات اخیراً مشاهده شده

### 📱 Mobile Experience
- ✅ Bottom Navigation
- ✅ Mobile Menu Drawer
- ✅ Mobile Search
- ✅ Filter Drawer
- ✅ Sticky Add to Cart
- ✅ Touch-friendly buttons (44x44px)
- ✅ Swipe gestures
- ✅ Responsive در همه جا

### 🎨 UI/UX
- ✅ Mega Menu با تصاویر
- ✅ Loading Skeletons با shimmer
- ✅ Error Handling حرفه‌ای
- ✅ Empty States زیبا
- ✅ Breadcrumb Navigation
- ✅ Active Page Indicator
- ✅ Grid/List View Toggle
- ✅ Image Zoom
- ✅ Glassmorphism Effects
- ✅ Micro-interactions

### ♿ Accessibility
- ✅ Skip to Content
- ✅ ARIA Labels کامل
- ✅ Keyboard Navigation
- ✅ Screen Reader Support
- ✅ Focus States
- ✅ Color Contrast

### 💬 Customer Support
- ✅ Live Chat با ربات هوشمند
- ✅ Quick Replies
- ✅ پاسخ‌های خودکار
- ✅ Size Guide
- ✅ زمان تحویل
- ✅ اشتراک‌گذاری محصولات

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+ 
- npm یا yarn

### نصب

```bash
# Clone repository
git clone https://github.com/yourusername/maysa-shop.git

# ورود به پوشه پروژه
cd maysa-shop

# نصب dependencies
npm install

# اجرای development server
npm run dev
```

سایت در آدرس `http://localhost:3000` در دسترس خواهد بود.

### Build برای Production

```bash
# Build
npm run build

# اجرای production server
npm start
```

## 📁 ساختار پروژه

```
maysa-shop/
├── app/                      # Next.js App Router
│   ├── (main)/              # صفحات اصلی
│   │   ├── page.tsx         # صفحه اصلی
│   │   ├── shop/            # فروشگاه
│   │   ├── product/         # صفحه محصول
│   │   ├── cart/            # سبد خرید
│   │   ├── checkout/        # تسویه حساب
│   │   ├── wishlist/        # علاقه‌مندی‌ها
│   │   ├── comparison/      # مقایسه محصولات
│   │   ├── account/         # حساب کاربری
│   │   └── ...
│   ├── login/               # ورود/ثبت‌نام
│   ├── layout.tsx           # Layout اصلی
│   └── globals.css          # استایل‌های global
├── components/              # کامپوننت‌ها
│   ├── layout/             # Header, Footer, etc.
│   ├── product/            # کامپوننت‌های محصول
│   ├── ui/                 # کامپوننت‌های UI
│   └── carousel/           # Carousel‌ها
├── lib/                     # Utilities و Hooks
│   ├── context/            # Context Providers
│   └── hooks/              # Custom Hooks
├── types/                   # TypeScript Types
├── data/                    # داده‌های استاتیک
└── public/                  # فایل‌های استاتیک
```

## 🛠️ تکنولوژی‌ها

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Data Fetching:** React Query (TanStack Query)
- **Forms:** React Hook Form
- **Carousel:** Swiper.js
- **Icons:** React Icons
- **Notifications:** React Hot Toast
- **Image Optimization:** Next.js Image

## 📚 مستندات

- [راهنمای سریع فاز 3](QUICK-GUIDE-PHASE-3.md)
- [راهنمای استفاده از ویژگی‌های جدید](HOW-TO-USE-NEW-FEATURES.md)
- [خلاصه فاز 0](PRIORITY-IMPROVEMENTS-DONE.md)
- [خلاصه فاز 1](PHASE-1-COMPLETED.md)
- [خلاصه فاز 2](PHASE-2-COMPLETED.md)
- [خلاصه فاز 3](PHASE-3-COMPLETED.md)
- [خلاصه نهایی](FINAL-SUMMARY.md)

## 🎯 ویژگی‌های کلیدی

### مقایسه محصولات
مقایسه تا 4 محصول با جدول کامل ویژگی‌ها

### مدیریت آدرس
ذخیره و مدیریت چندین آدرس با امکان انتخاب پیش‌فرض

### چت آنلاین
ربات پشتیبانی هوشمند با پاسخ‌های خودکار

### Bottom Navigation
منوی پایین موبایل برای دسترسی سریع

### Sticky Add to Cart
دکمه افزودن به سبد ثابت در موبایل

### Size Guide
راهنمای کامل سایز برای هر دسته‌بندی

## 🧪 تست

```bash
# اجرای تست‌ها
npm test

# اجرای تست‌ها با coverage
npm run test:coverage
```

## 📈 Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

## 🤝 مشارکت

مشارکت شما خوش‌آمد است! لطفاً:

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. Commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. Pull Request باز کنید

## 📝 License

این پروژه تحت لایسنس MIT منتشر شده است.

## 📞 تماس با ما

- **وب‌سایت:** https://maysa.com
- **ایمیل:** info@maysa.com
- **تلفن:** 021-12345678

## 🙏 تشکر

از تمام کسانی که در توسعه این پروژه مشارکت داشتند، تشکر می‌کنیم.

---

**ساخته شده با ❤️ در ایران**
