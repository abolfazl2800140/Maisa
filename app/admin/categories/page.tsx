'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

interface Category {
    id: string;
    name: string;
    slug: string;
    productsCount: number;
    isActive: boolean;
    parentId: string | null;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        parentId: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setTimeout(() => {
                const mockCategories: Category[] = [
                    { id: '1', name: 'کوله پشتی', slug: 'backpack', productsCount: 45, isActive: true, parentId: null },
                    { id: '2', name: 'کوله پشتی لپ‌تاپ', slug: 'laptop-backpack', productsCount: 20, isActive: true, parentId: '1' },
                    { id: '3', name: 'کوله پشتی مدرسه', slug: 'school-backpack', productsCount: 15, isActive: true, parentId: '1' },
                    { id: '4', name: 'کیف دستی', slug: 'handbag', productsCount: 30, isActive: true, parentId: null },
                    { id: '5', name: 'کیف لپ‌تاپ', slug: 'laptop-bag', productsCount: 25, isActive: true, parentId: null },
                ];
                setCategories(mockCategories);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('خطا در دریافت دسته‌بندی‌ها:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // TODO: API call
            alert(editingCategory ? 'دسته‌بندی به‌روزرسانی شد' : 'دسته‌بندی ایجاد شد');
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', slug: '', parentId: '' });
            fetchCategories();
        } catch (error) {
            alert('خطا در ذخیره دسته‌بندی');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            parentId: category.parentId || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید?')) return;
        try {
            // TODO: API call
            setCategories(categories.filter((c) => c.id !== id));
            alert('دسته‌بندی حذف شد');
        } catch (error) {
            alert('خطا در حذف دسته‌بندی');
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            setCategories(
                categories.map((c) =>
                    c.id === id ? { ...c, isActive: !c.isActive } : c
                )
            );
        } catch (error) {
            alert('خطا در تغییر وضعیت');
        }
    };

    if (loading) {
        return <div className="h-64 bg-gray-200 rounded animate-pulse"></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h1>
                    <p className="text-gray-600 mt-1">{categories.length} دسته‌بندی</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', slug: '', parentId: '' });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <FaPlus />
                    <span>افزودن دسته‌بندی</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                نام
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                تعداد محصولات
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
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className={`font-medium ${category.parentId ? 'mr-6' : ''}`}>
                                        {category.parentId && '↳ '}
                                        {category.name}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {category.productsCount} محصول
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(category.id)}
                                        className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${category.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {category.isActive ? <FaEye /> : <FaEyeSlash />}
                                        {category.isActive ? 'فعال' : 'غیرفعال'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    نام *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug *
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: e.target.value })
                                    }
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    دسته‌بندی والد
                                </label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, parentId: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="">بدون والد</option>
                                    {categories
                                        .filter((c) => !c.parentId)
                                        .map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    ذخیره
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
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
