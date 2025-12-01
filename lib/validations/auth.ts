import * as Yup from 'yup';
import { validationMessages, patterns } from './common';

// Login Schema - هماهنگ با LoginDto در بک‌اند
export const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .required('شماره تلفن الزامی است')
    .matches(patterns.phone, 'شماره تلفن معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'),
  
  password: Yup.string()
    .required('رمز عبور الزامی است')
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
});

// Register Schema - هماهنگ با RegisterDto در بک‌اند
export const registerSchema = Yup.object().shape({
  phone: Yup.string()
    .required('شماره تلفن الزامی است')
    .matches(patterns.phone, 'شماره تلفن معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'),
  
  password: Yup.string()
    .required('رمز عبور الزامی است')
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
  
  confirmPassword: Yup.string()
    .required('تکرار رمز عبور الزامی است')
    .oneOf([Yup.ref('password')], 'رمز عبور و تکرار آن یکسان نیستند'),
  
  firstName: Yup.string()
    .max(50, validationMessages.max('نام', 50)),
  
  lastName: Yup.string()
    .max(50, validationMessages.max('نام خانوادگی', 50)),
});

// Initial values
export const loginInitialValues = {
  phone: '',
  password: '',
};

export const registerInitialValues = {
  phone: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
};

export type LoginFormValues = typeof loginInitialValues;
export type RegisterFormValues = typeof registerInitialValues;
