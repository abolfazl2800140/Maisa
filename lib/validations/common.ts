import * as Yup from 'yup';

// پیام‌های خطای فارسی مشترک
export const validationMessages = {
  required: 'این فیلد الزامی است',
  min: (field: string, min: number) => `${field} باید حداقل ${min} کاراکتر باشد`,
  max: (field: string, max: number) => `${field} نباید بیشتر از ${max} کاراکتر باشد`,
  minNumber: (field: string, min: number) => `${field} باید حداقل ${min} باشد`,
  maxNumber: (field: string, max: number) => `${field} نباید بیشتر از ${max} باشد`,
  invalidUrl: 'آدرس URL معتبر نیست',
  invalidEmail: 'ایمیل معتبر نیست',
  invalidPhone: 'شماره تلفن معتبر نیست',
  passwordMismatch: 'رمز عبور و تکرار آن یکسان نیستند',
};

// Regex patterns
export const patterns = {
  phone: /^09[0-9]{9}$/,
  postalCode: /^[0-9]{10}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Common field schemas
export const phoneSchema = Yup.string()
  .matches(patterns.phone, validationMessages.invalidPhone);

export const emailSchema = Yup.string()
  .email(validationMessages.invalidEmail);

export const urlSchema = Yup.string()
  .url(validationMessages.invalidUrl);

export const postalCodeSchema = Yup.string()
  .matches(patterns.postalCode, 'کد پستی باید ۱۰ رقم باشد');
