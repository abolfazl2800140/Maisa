'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaBan, FaCheck, FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth, UserRole } from '@/lib/context/AuthContext';
import Select from '@/components/ui/Select';

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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'admin' as UserRole,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('خطا در دریافت کاربران');
            }

            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('خطا در دریافت کاربران:', error);
            setLoading(false);
        }
    };

    const handleChangeRole = async (userId: string, newRole: UserRole) => {
        if (!confirm('آیا از تغییر نقش این کاربر اطمینان دارید؟')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                throw new Error('خطا در تغییر نقش');
            }

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
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/toggle-active`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('خطا در تغییر وضعیت');
            }

            setUsers(
                users.map((u) =>
                    u.id === userId ? { ...u, isActive: !u.isActive } : u
                )
            );
        } catch (error) {
            alert('خطا در تغییر وضعیت');
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'خطا در ایجاد ادمین');
            }

            const newUser = await response.json();
            setUsers([newUser, ...users]);
            setShowCreateModal(false);
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phone: '',
                role: 'admin',
            });
            alert('ادمین با موفقیت ایجاد شد');
        } catch (error: any) {
            alert(error.message || 'خطا در ایجاد ادمین');
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                }),
            });

            if (!response.ok) {
                throw new Error('خطا در ویرایش کاربر');
            }

            const updatedUser = await response.json();
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...updatedUser } : u));
            setShowEditModal(false);
            setSelectedUser(null);
            alert('کاربر با موفقیت ویرایش شد');
        } catch (error) {
            alert('خطا در ویرایش کاربر');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'خطا در حذف کاربر');
            }

            setUsers(users.filter(u => u.id !== userId));
            alert('کاربر با موفقیت حذف شد');
        } catch (error: any) {
            alert(error.message || 'خطا در حذف کاربر');
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            password: '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            role: user.role,
        });
        setShowEditModal(true);
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
                    <p className="text-sm lg:text-base text-gray-600 mt-1">{filteredUsers.length} کاربر</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-primary text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm lg:text-base w-full sm:w-auto justify-center"
                >
                    <FaPlus />
                    <span className="hidden sm:inline">ایجاد ادمین جدید</span>
                    <span className="sm:hidden">ادمین جدید</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {(['all', 'customer', 'admin', 'super_admin'] as const).map((role) => {
                    const count =
                        role === 'all'
                            ? users.length
                            : users.filter((u) => u.role === role).length;
                    return (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`p-3 lg:p-4 rounded-lg border-2 transition-all ${filterRole === role
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <p className="text-xl lg:text-2xl font-bold">{count}</p>
                            <p className="text-xs lg:text-sm mt-1">
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

            {/* Users Table - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ایمیل</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تلفن</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نقش</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">امتیاز</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{user.phone}</td>
                                    <td className="px-6 py-4">
                                        <Select
                                            value={user.role}
                                            onChange={(val) => handleChangeRole(user.id, val as UserRole)}
                                            options={[
                                                { value: 'customer', label: 'مشتری' },
                                                { value: 'admin', label: 'ادمین' },
                                                { value: 'super_admin', label: 'سوپر ادمین' },
                                            ]}
                                            size="sm"
                                            className="min-w-[120px]"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-primary">{user.loyaltyPoints.toLocaleString('fa-IR')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                        >
                                            {user.isActive ? <FaCheck size={12} /> : <FaBan size={12} />}
                                            {user.isActive ? 'فعال' : 'غیرفعال'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEditModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="ویرایش">
                                                <FaEdit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="حذف">
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
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

            {/* Users Cards - Mobile */}
            <div className="lg:hidden space-y-3">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-800">{user.firstName} {user.lastName}</h3>
                                <p className="text-sm text-gray-600 truncate mt-1">{user.email}</p>
                                {user.phone && <p className="text-xs text-gray-500 mt-1">{user.phone}</p>}
                            </div>
                            <button
                                onClick={() => handleToggleStatus(user.id)}
                                className={`flex-shrink-0 p-2 rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                                {user.isActive ? <FaCheck size={14} /> : <FaBan size={14} />}
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <Select
                                value={user.role}
                                onChange={(val) => handleChangeRole(user.id, val as UserRole)}
                                options={[
                                    { value: 'customer', label: 'مشتری' },
                                    { value: 'admin', label: 'ادمین' },
                                    { value: 'super_admin', label: 'سوپر ادمین' },
                                ]}
                                size="sm"
                                className="min-w-[100px]"
                            />
                            <span className="text-xs text-gray-500">
                                امتیاز: <span className="font-semibold text-primary">{user.loyaltyPoints.toLocaleString('fa-IR')}</span>
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => openEditModal(user)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <FaEdit size={14} />
                                <span className="text-sm">ویرایش</span>
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <FaTrash size={14} />
                                <span className="text-sm">حذف</span>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500">کاربری یافت نشد</p>
                    </div>
                )}
            </div>

            {/* Create Admin Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-lg max-w-md w-full p-4 lg:p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-modal-enter">
                        <h2 className="text-lg lg:text-xl font-bold mb-4">ایجاد ادمین جدید</h2>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">ایمیل *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">رمز عبور *</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نام</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نام خانوادگی</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">تلفن</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نقش *</label>
                                <Select
                                    value={formData.role}
                                    onChange={(val) => setFormData({ ...formData, role: val as UserRole })}
                                    options={[
                                        { value: 'admin', label: 'ادمین' },
                                        { value: 'super_admin', label: 'سوپر ادمین' },
                                    ]}
                                    size="md"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
                                >
                                    ایجاد
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-lg max-w-md w-full p-4 lg:p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-modal-enter">
                        <h2 className="text-lg lg:text-xl font-bold mb-4">ویرایش کاربر</h2>
                        <form onSubmit={handleEditUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">ایمیل</label>
                                <input
                                    type="email"
                                    disabled
                                    value={formData.email}
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نام</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نام خانوادگی</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">تلفن</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
                                >
                                    ذخیره
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
