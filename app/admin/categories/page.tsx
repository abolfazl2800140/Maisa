'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminApi, Category } from '@/lib/api/admin';

interface CategoryDisplay {
    id: string;
    name: string;
    slug: string;
    productsCount: number;
    isActive: boolean;
    parentId: string | null;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryDisplay | null>(null);
    const [saving, setSaving] = useState(false);
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
            setLoading(true);
            setError(null);
            const data = await adminApi.getCategories();
            const displayCategories: CategoryDisplay[] = data.map((cat: Category) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                productsCount: cat._count?.products || 0,
                isActive: cat.isActive,
                parentId: cat.parentId || null,
            }));
            setCategories(displayCategories);
        } catch (err: any) {
            setError(err.message || 'خطا در دریافت دسته‌بندی‌ها');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingCategory) {
                await adminApi.updateCategory(editingCategory.id, {
                    name: formData.name,
                    slug: formData.slug,
                    parentId: formData.parentId || undefined,
                });
            } else {
                await adminApi.createCategory({
                    name: formData.name,
                    slug: formData.slug,
                    parentId: formData.parentId || undefined,
                });
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', slug: '', parentId: '' });
            fetchCategories();
        } catch (err: any) {
            alert(err.message || 'خطا در ذخیره دسته‌بندی');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category: CategoryDisplay) => {
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
            await adminApi.deleteCategory(id);
            fetchCategories();
        } catch (err: any) {
            alert(err.message || 'خطا در حذف دسته‌بندی');
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            await adminApi.toggleCategoryStatus(id);
            fetchCategories();
        } catch (err: any) {
            alert(err.message || 'خطا در تغییر وضعیت');
        }
    };

    if (loading) {
        return <div className="h-64 bg-gray-200 rounded animate-pulse"></div>;
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={fetchCategories} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    تلاش مجدد
                </button>
            </div>
        );
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
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تعداد محصولات</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
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
                                <td className="px-6 py-4 text-gray-600">{category.productsCount} محصول</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(category.id)}
                                        className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${
                                            category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {category.isActive ? <FaEye /> : <FaEyeSlash />}
                                        {category.isActive ? 'فعال' : 'غیرفعال'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                            <FaEdit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">دسته‌بندی‌ای یافت نشد</p>
                    </div>
                )}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">نام *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی والد</label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="">بدون والد</option>
                                    {categories.filter((c) => !c.parentId && c.id !== editingCategory?.id).map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'در حال ذخیره...' : 'ذخیره'}
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
