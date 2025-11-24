'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaBan, FaCheck } from 'react-icons/fa';
import { useAuth, UserRole } from '@/lib/context/AuthContext';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    loyaltyPoints: number;
    createdAt: string;
}

export default function UsersPage() {
    const { isSuperAdmin } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // TODO: داده‌های نمونه
            setTimeout(() => {
                const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
                    id: `user-${i + 1}`,
                    email: `user${i + 1}@example.com`,
                    firstName: `نام ${i + 1}`,
                    lastName: `نام خانوادگی ${i + 1}`,
                    phone: `0912345${String(i).padStart(4, '0')}`,
                    role: i === 0 ? 'super_admin' : i < 3 ? 'admin' : 'customer',
                    isActive: Math.random() > 0.1,
                    loyaltyPoints: Math.floor(Math.random() * 1000),
                    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                }));
                setUsers(mockUsers);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('خطا در دریافت کاربران:', error);
            setLoading(false);
        }
    };

    const handleChangeRole = async (userId: string, newRole: UserRole) => {
        if (!confirm('آیا از تغییر نقش این کاربر اطمینان دارید؟')) return;

        try {
            // TODO: API call
            setUsers(
                users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );
            alert('نقش کاربر تغییر یافت');
        } catch (error) {
            alert('خطا در تغییر نقش');
        }
    };

    const handleToggleStatus = async (userId: string) => {
        try {
            // TODO: API call
            setUsers(
                users.map((u) =>
                    u.id === userId ? { ...u, isActive: !u.isActive } : u
                )
            );
        } catch (error) {
            alert('خطا در تغییر وضعیت');
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);

        const matchesFilter = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesFilter;
    });

    const roleLabels: Record<UserRole, string> = {
        customer: 'مشتری',
        admin: 'ادمین',
        super_admin: 'سوپر ادمین',
    };

    const roleColors: Record<UserRole, string> = {
        customer: 'bg-gray-100 text-gray-800',
        admin: 'bg-blue-100 text-blue-800',
        super_admin: 'bg-purple-100 text-purple-800',
    };

    if (!isSuperAdmin) {
        return (
            <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-red-600 text-lg">
                    شما دسترسی به این بخش را ندارید
                </p>
                <p className="text-gray-600 mt-2">
                    فقط سوپر ادمین می‌تواند کاربران را مدیریت کند
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
                    <p className="text-gray-600 mt-1">{filteredUsers.length} کاربر</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['all', 'customer', 'admin', 'super_admin'] as const).map((role) => {
                    const count =
                        role === 'all'
                            ? users.length
                            : users.filter((u) => u.role === role).length;
                    return (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`p-4 rounded-lg border-2 transition-all ${filterRole === role
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <p className="text-2xl font-bold">{count}</p>
                            <p className="text-sm mt-1">
                                {role === 'all' ? 'همه' : roleLabels[role]}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="relative">
                    <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="جستجو بر اساس نام، ایمیل یا تلفن..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    نام
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    ایمیل
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    تلفن
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    نقش
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    امتیاز
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    وضعیت
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">
                                            {user.firstName} {user.lastName}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                handleChangeRole(user.id, e.target.value as UserRole)
                                            }
                                            className={`px-3 py-1 text-sm rounded-full border-0 ${roleColors[user.role]
                                                }`}
                                        >
                                            <option value="customer">مشتری</option>
                                            <option value="admin">ادمین</option>
                                            <option value="super_admin">سوپر ادمین</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-primary">
                                            {user.loyaltyPoints.toLocaleString('fa-IR')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${user.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {user.isActive ? <FaCheck /> : <FaBan />}
                                            {user.isActive ? 'فعال' : 'غیرفعال'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="ویرایش"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">کاربری یافت نشد</p>
                    </div>
                )}
            </div>
        </div>
    );
}
