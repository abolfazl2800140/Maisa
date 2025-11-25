'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import {
    FaHome,
    FaBox,
    FaShoppingCart,
    FaList,
    FaTags,
    FaStar,
    FaUsers,
    FaSignOutAlt,
    FaBars,
    FaTimes,
} from 'react-icons/fa';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAdmin, logout, loading: authLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // صبر کن تا auth loading تموم بشه
        if (authLoading) return;

        // بررسی دسترسی
        if (!user) {
            router.push('/login?redirect=/admin');
            return;
        }

        if (!isAdmin) {
            router.push('/');
            return;
        }
    }, [user, isAdmin, router, authLoading]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (authLoading || !user || !isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    const menuItems = [
        { href: '/admin', icon: FaHome, label: 'داشبورد', roles: ['admin', 'super_admin'] },
        { href: '/admin/products', icon: FaBox, label: 'محصولات', roles: ['admin', 'super_admin'] },
        { href: '/admin/orders', icon: FaShoppingCart, label: 'سفارشات', roles: ['admin', 'super_admin'] },
        { href: '/admin/categories', icon: FaList, label: 'دسته‌بندی‌ها', roles: ['admin', 'super_admin'] },
        { href: '/admin/brands', icon: FaTags, label: 'برندها', roles: ['admin', 'super_admin'] },
        { href: '/admin/reviews', icon: FaStar, label: 'نظرات', roles: ['admin', 'super_admin'] },
        { href: '/admin/users', icon: FaUsers, label: 'کاربران', roles: ['super_admin'] },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.roles.includes(user.role)
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white shadow-lg transition-all duration-300 fixed h-full z-30`}
            >
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-xl font-bold text-primary">پنل مدیریت</h1>
                            <p className="text-sm text-gray-600 mt-1">{user.name}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-primary text-white text-xs rounded-full">
                                {user.role === 'super_admin' ? 'سوپر ادمین' : 'ادمین'}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-600 hover:text-primary transition-colors"
                    >
                        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-6 py-3 transition-colors ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                title={!sidebarOpen ? item.label : undefined}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors mt-4 border-t"
                        title={!sidebarOpen ? 'خروج' : undefined}
                    >
                        <FaSignOutAlt size={20} />
                        {sidebarOpen && <span>خروج</span>}
                    </button>
                </nav>

                {/* Back to Site */}
                {sidebarOpen && (
                    <div className="absolute bottom-0 w-full p-4 border-t">
                        <Link
                            href="/"
                            className="block text-center text-sm text-primary hover:underline"
                        >
                            بازگشت به سایت
                        </Link>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 ${sidebarOpen ? 'mr-64' : 'mr-20'
                    } transition-all duration-300`}
            >
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-20">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {filteredMenuItems.find(item => item.href === pathname)?.label || 'پنل مدیریت'}
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{user.email}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
