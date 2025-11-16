# Toast Notifications با React Hot Toast 🔥

## ✅ نصب و پیکربندی:

### نصب شده:
```bash
npm install react-hot-toast
```

### تنظیمات در layout.tsx:
- Position: top-center
- Duration: 3 ثانیه (success), 4 ثانیه (error)
- فونت فارسی: Vazirmatn
- Direction: RTL
- آیکون‌های سفارشی

---

## 🎯 جاهایی که Toast اضافه شد:

### 1. ProductCard (کارت محصول)
```tsx
toast.success(`${product.name} به سبد خرید اضافه شد`, {
  icon: '🛒',
});
```

### 2. Product Detail Page (صفحه جزئیات)
```tsx
toast.success(
  `${quantity} عدد ${product.name} به سبد خرید اضافه شد`,
  {
    icon: '🛒',
    duration: 3000,
  }
);
```

### 3. Cart Page (سبد خرید)
```tsx
// حذف محصول
toast.success(`${productName} از سبد خرید حذف شد`, {
  icon: '🗑️',
});

// تعداد صفر شد
toast.success('محصول از سبد خرید حذف شد', {
  icon: '🗑️',
});
```

---

## 📱 انواع Toast:

### Success (موفقیت)
```tsx
toast.success('پیام موفقیت', {
  icon: '✅',
  duration: 3000,
});
```

### Error (خطا)
```tsx
toast.error('پیام خطا', {
  icon: '❌',
  duration: 4000,
});
```

### Loading (در حال بارگذاری)
```tsx
const toastId = toast.loading('در حال پردازش...');
// بعد از اتمام:
toast.success('انجام شد!', { id: toastId });
```

### Custom (سفارشی)
```tsx
toast('پیام سفارشی', {
  icon: '👏',
  style: {
    borderRadius: '10px',
    background: '#333',
    color: '#fff',
  },
});
```

---

## 🎨 استایل‌های پیش‌فرض:

```tsx
toastOptions={{
  duration: 3000,
  style: {
    background: '#fff',
    color: '#1a1a1a',
    fontFamily: 'Vazirmatn, sans-serif',
    direction: 'rtl',
  },
  success: {
    iconTheme: {
      primary: '#10B981', // سبز
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#EF4444', // قرمز
      secondary: '#fff',
    },
  },
}}
```

---

## 💡 نکات مهم:

1. **RTL Support**: تمام toast ها راست‌چین هستند
2. **فونت فارسی**: از Vazirmatn استفاده می‌شود
3. **آیکون‌های Emoji**: برای UX بهتر
4. **Duration**: قابل تنظیم برای هر toast
5. **Position**: بالای صفحه (top-center)

---

## 🚀 استفاده در کامپوننت‌های جدید:

```tsx
import toast from 'react-hot-toast';

function MyComponent() {
  const handleAction = () => {
    try {
      // انجام عملیات
      toast.success('عملیات با موفقیت انجام شد!', {
        icon: '✅',
      });
    } catch (error) {
      toast.error('خطا در انجام عملیات', {
        icon: '❌',
      });
    }
  };
}
```

---

## 📝 گام‌های بعدی:

- ✅ Toast برای Add to Cart
- ✅ Toast برای Remove from Cart
- ⏳ Toast برای Checkout
- ⏳ Toast برای Login/Register
- ⏳ Toast برای Contact Form
- ⏳ Toast برای Newsletter
