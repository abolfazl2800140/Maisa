'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth, UserRole } from '@/lib/context/AuthContext';
import { loginSchema, registerSchema, loginInitialValues, registerInitialValues } from '@/lib/validations/auth';

// کامپوننت نمایش خطا
const FormError = ({ name }: { name: string }) => (
  <ErrorMessage name={name}>
    {(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
  </ErrorMessage>
);

// کامپوننت Input با آیکون
const FormInputWithIcon = ({
  name,
  type = 'text',
  placeholder,
  icon: Icon,
}: {
  name: string;
  type?: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Field name={name}>
    {({ field, meta }: FieldProps) => (
      <div className="relative">
        <input
          {...field}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:border-primary ${
            meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    )}
  </Field>
);

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleLoginSubmit = async (values: typeof loginInitialValues, { setSubmitting }: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      login(values.email, values.password, 'کاربر مایسا', selectedRole);
      toast.success('با موفقیت وارد شدید', { icon: '👋' });

      // Redirect based on role
      if (selectedRole === 'admin' || selectedRole === 'super_admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (error: any) {
      toast.error(error.message || 'خطا در ورود');
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (values: typeof registerInitialValues, { setSubmitting }: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      login(values.email, values.password, `${values.firstName} ${values.lastName}`, 'customer');
      toast.success('ثبت‌نام با موفقیت انجام شد', { icon: '🎉' });
      router.push('/account');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ثبت‌نام');
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <div className="text-4xl font-bold text-primary mb-2">مایسا</div>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            {isLogin ? 'ورود به حساب کاربری' : 'ثبت‌نام'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'به فروشگاه مایسا خوش آمدید' : 'عضویت در فروشگاه مایسا'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {isLogin ? (
            // Login Form
            <Formik
              initialValues={loginInitialValues}
              validationSchema={loginSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">ایمیل</label>
                    <FormInputWithIcon
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      icon={FaEnvelope}
                    />
                    <FormError name="email" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">رمز عبور</label>
                    <FormInputWithIcon
                      name="password"
                      type="password"
                      placeholder="رمز عبور خود را وارد کنید"
                      icon={FaLock}
                    />
                    <FormError name="password" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">نقش (برای تست)</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="customer">مشتری</option>
                      <option value="admin">ادمین</option>
                      <option value="super_admin">سوپر ادمین</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      این فیلد فقط برای تست است و در نسخه نهایی حذف می‌شود
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>مرا به خاطر بسپار</span>
                    </label>
                    <Link href="/forgot-password" className="text-primary hover:underline">
                      فراموشی رمز عبور
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        در حال پردازش...
                      </>
                    ) : (
                      'ورود'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            // Register Form
            <Formik
              initialValues={registerInitialValues}
              validationSchema={registerSchema}
              onSubmit={handleRegisterSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">نام</label>
                      <FormInputWithIcon
                        name="firstName"
                        placeholder="نام"
                        icon={FaUser}
                      />
                      <FormError name="firstName" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">نام خانوادگی</label>
                      <FormInputWithIcon
                        name="lastName"
                        placeholder="نام خانوادگی"
                        icon={FaUser}
                      />
                      <FormError name="lastName" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">ایمیل</label>
                    <FormInputWithIcon
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      icon={FaEnvelope}
                    />
                    <FormError name="email" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">شماره تلفن</label>
                    <FormInputWithIcon
                      name="phone"
                      type="tel"
                      placeholder="09123456789"
                      icon={FaPhone}
                    />
                    <FormError name="phone" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">رمز عبور</label>
                    <FormInputWithIcon
                      name="password"
                      type="password"
                      placeholder="حداقل ۸ کاراکتر"
                      icon={FaLock}
                    />
                    <FormError name="password" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">تکرار رمز عبور</label>
                    <FormInputWithIcon
                      name="confirmPassword"
                      type="password"
                      placeholder="رمز عبور را دوباره وارد کنید"
                      icon={FaLock}
                    />
                    <FormError name="confirmPassword" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        در حال پردازش...
                      </>
                    ) : (
                      'ثبت‌نام'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}


          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold mr-2 hover:underline"
              >
                {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
              </button>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">یا ورود با</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span>گوگل</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span>تلگرام</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
