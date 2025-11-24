'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

interface Brand {
    id: string;
    name: string;
    slug: string;
    productsCount: number;
    isActive: boolean;
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setTimeout(() => {
                const mockBrands: Brand[] = [
                    { id: '1', name: 'مایسا', slug: 'maysa', productsCount: 85, isActive: true },
                    { id: '2', name: 'دلسی', slug: 'delsey', productsCount: 42, isActive: true },
                    { id: '3', name: 'سامسونایت', slug: 'samsonite', productsCount: 38, isActive: true },
                    { id: '4', name: 'کاترپیلار', slug: 'caterpillar', productsCount: 25, isActive: true },
                ];
                setBrands(mockBrands);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('خطا در دریافت برندها:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // TODO: API call
            alert(editingBrand ? 'برند به‌روزرسانی شد' : 'برند ایجاد شد');
            setShowModal(false);
            setEditingBrand(null);
            setFormData({ name: '', slug: '', description: '' });
            fetchBrands();
        } catch (error) {
            alert('خطا در ذخیره برند');
        }
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({
            name: brand.name,
            slug: brand.slug,
            description: '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('آیا از حذف این برند اطمینان دارید?')) return;
        try {
            // TODO: API call
            setBrands(brands.filter((b) => b.id !== id));
            alert('برند حذف شد');
        } catch (error) {
            alert('خطا در حذف برند');
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            setBrands(
                brands.map((b) =>
                    b.id === id ? { ...b, isActive: !b.isActive } : b
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
                    <h1 className="text-2xl font-bold text-gray-800">مدیریت برندها</h1>
                    <p className="text-gray-600 mt-1">{brands.length} برند</p>
                </div>
                <button
                    onClick={() => {
                        setEditingBrand(null);
                        setFormData({ name: '', slug: '', description: '' });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <FaPlus />
                    <span>افزودن برند</span>
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
                        {brands.map((brand) => (
                            <tr key={brand.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-800">{brand.name}</p>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{brand.slug}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {brand.productsCount} محصول
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(brand.id)}
                                        className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${brand.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {brand.isActive ? <FaEye /> : <FaEyeSlash />}
                                        {brand.isActive ? 'فعال' : 'غیرفعال'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(brand)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(brand.id)}
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
                            {editingBrand ? 'ویرایش برند' : 'افزودن برند'}
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
                                    توضیحات
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
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
