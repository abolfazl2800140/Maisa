# راهنمای اضافه کردن فونت فارسی

در حال حاضر پروژه از فونت‌های سیستمی (Tahoma, Arial) استفاده می‌کند.

## اضافه کردن فونت Vazir یا سایر فونت‌های فارسی

### روش 1: استفاده از Google Fonts (پیشنهادی)

در فایل `app/layout.tsx`:

```tsx
import { Inter } from 'next/font/google'

// یا از CDN استفاده کنید
export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### روش 2: Local Font

1. فونت Vazir را از [اینجا](https://github.com/rastikerdar/vazir-font/releases) دانلود کنید
2. فایل‌های `.woff2` را در `public/fonts/` قرار دهید
3. در `app/layout.tsx`:

```tsx
import localFont from 'next/font/local'

const vazir = localFont({
  src: [
    {
      path: './fonts/Vazir-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Vazir-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-vazir',
})

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className={vazir.className}>{children}</body>
    </html>
  )
}
```

4. در `tailwind.config.ts`:

```ts
fontFamily: {
  sans: ['var(--font-vazir)', 'Tahoma', 'Arial', 'sans-serif'],
}
```

### فونت‌های فارسی پیشنهادی

- **Vazir**: مناسب برای وب، خوانا
- **Estedad**: مدرن و زیبا
- **Shabnam**: ساده و خوانا
- **Samim**: مناسب برای متن‌های طولانی

### نکات مهم

- فایل‌های فونت را در `public/fonts/` قرار دهید
- از فرمت `.woff2` برای بهترین عملکرد استفاده کنید
- حتماً fallback font تعریف کنید
- برای SEO، از `font-display: swap` استفاده کنید
