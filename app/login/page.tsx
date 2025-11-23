'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/account');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation
        if (isLogin) {
            if (!formData.email || !formData.password) {
                toast.error('لطفاً تمام فیلدها را پر کنید');
                setIsLoading(false);
                return;
            }
        } else {
            if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
                toast.error('لطفاً تمام فیلدها را پر کنید');
                setIsLoading(false);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('رمز عبور و تکرار آن یکسان نیستند');
                setIsLoading(false);
                return;
            }
            if (formData.password.length < 6) {
                toast.error('رمز عبور باید حداقل 6 کاراکتر باشد');
                setIsLoading(false);
                return;
            }
        }

        // Simulate API call
        setTimeout(() => {
            if (isLogin) {
                // Mock login
                login(formData.email, formData.password, 'کاربر مایسا');
                toast.success('با موفقیت وارد شدید', { icon: '👋' });
                router.push('/account');
            } else {
                // Mock register
                login(formData.email, formData.password, formData.name);
                toast.success('ثبت‌نام با موفقیت انجام شد', { icon: '🎉' });
                router.push('/account');
            }
            setIsLoading(false);
        }, 1500);
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block font-semibold mb-2">نام و نام خانوادگی</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        placeholder="نام خود را وارد کنید"
                                    />
                                    <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block font-semibold mb-2">ایمیل</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                    placeholder="example@email.com"
                                />
                                <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block font-semibold mb-2">شماره تلفن</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        placeholder="09123456789"
                                    />
                                    <FaPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block font-semibold mb-2">رمز عبور</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                    placeholder="رمز عبور خود را وارد کنید"
                                />
                                <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block font-semibold mb-2">تکرار رمز عبور</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        placeholder="رمز عبور را دوباره وارد کنید"
                                    />
                                    <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span>مرا به خاطر بسپار</span>
                                </label>
                                <Link href="/forgot-password" className="text-primary hover:underline">
                                    فراموشی رمز عبور
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    در حال پردازش...
                                </>
                            ) : (
                                isLogin ? 'ورود' : 'ثبت‌نام'
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setFormData({
                                        email: '',
                                        password: '',
                                        name: '',
                                        phone: '',
                                        confirmPassword: ''
                                    });
                                }}
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
