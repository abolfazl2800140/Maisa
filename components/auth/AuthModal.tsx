'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaPhone, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      if (!formData.phone || !formData.password) {
        toast.error('لطفاً تمام فیلدها را پر کنید');
        setIsLoading(false);
        return;
      }
    } else {
      if (!formData.name || !formData.phone || !formData.password || !formData.confirmPassword) {
        toast.error('لطفاً تمام فیلدها را پر کنید');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('رمز عبور و تکرار آن یکسان نیستند');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 8) {
        toast.error('رمز عبور باید حداقل 8 کاراکتر باشد');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await login(formData.phone, formData.password);
        toast.success('با موفقیت وارد شدید', { icon: '👋' });
      } else {
        // TODO: ثبت‌نام با API
        await login(formData.phone, formData.password, formData.name, 'customer');
        toast.success('ثبت‌نام با موفقیت انجام شد', { icon: '🎉' });
      }
      onClose();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'خطا در ورود');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      phone: '',
      password: '',
      name: '',
      confirmPassword: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-secondary">
            {isLogin ? 'ورود به حساب کاربری' : 'ثبت‌نام'}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block font-semibold mb-2 text-sm">نام و نام خانوادگی</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                    placeholder="نام خود را وارد کنید"
                  />
                  <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-2 text-sm">شماره تلفن</label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  placeholder="09123456789"
                />
                <FaPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">رمز عبور</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  placeholder="رمز عبور خود را وارد کنید"
                />
                <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block font-semibold mb-2 text-sm">تکرار رمز عبور</label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                    placeholder="رمز عبور را دوباره وارد کنید"
                  />
                  <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  در حال پردازش...
                </>
              ) : isLogin ? (
                'ورود'
              ) : (
                'ثبت‌نام'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="text-primary font-bold mr-2 hover:underline"
              >
                {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
