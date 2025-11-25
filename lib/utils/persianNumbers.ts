// تبدیل اعداد انگلیسی به فارسی
export function toPersianNumbers(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
}

// فرمت قیمت با اعداد فارسی
export function formatPricePersian(price: number): string {
  return toPersianNumbers(price.toLocaleString('en-US'));
}

// فرمت تاریخ با اعداد فارسی
export function formatDatePersian(date: Date | string): string {
  const d = new Date(date);
  return toPersianNumbers(d.toLocaleDateString('fa-IR'));
}
