'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa';
import { adminApi } from '@/lib/api/admin';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    basePrice: number;
    finalPrice: number;
    stockQuantity: number;
    category: string;
    brand: string;
    image: string;
    isActive: boolean;
    isFeatured: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await adminApi.getProducts();
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const mappedProducts: Product[] = (response.data || response).map((p: any) => {
                const imageId = p.images?.[0]?.id;
                return {
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    sku: p.sku || '-',
                    basePrice: Number(p.basePrice),
                    finalPrice: Number(p.finalPrice) || Number(p.basePrice),
                    stockQuantity: p.variants?.[0]?.stockQuantity || 0,
                    category: p.category?.name || '-',
                    brand: p.brand?.name || '-',
                    image: imageId ? `${API_URL}/upload/image/${imageId}` : '/images/placeholder.jpg',
                    isActive: p.isActive,
                    isFeatured: p.isFeatured,
                };
            });
            setProducts(mappedProducts);
        } catch (error: any) {
            console.error('خطا در دریافت محصولات:', error);
            toast.error(error.message || 'خطا در دریافت محصولات');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) return;

        try {
            await adminApi.deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id));
            toast.success('محصول با موفقیت حذف شد');
        } catch (error: any) {
            toast.error(error.message || 'خطا در حذف محصول');
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            const product = products.find(p => p.id === id);
            if (!product) return;

            await adminApi.updateProduct(id, { isActive: !product.isActive });
            setProducts(
                products.map((p) =>
                    p.id === id ? { ...p, isActive: !p.isActive } : p
                )
            );
            toast.success('وضعیت محصول تغییر کرد');
        } catch (error: any) {
            toast.error(error.message || 'خطا در تغییر وضعیت');
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ||
            (filterStatus === 'active' && product.isActive) ||
            (filterStatus === 'inactive' && !product.isActive);

        return matchesSearch && matchesFilter;
    });

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
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
                    <p className="text-sm lg:text-base text-gray-600 mt-1">
                        {filteredProducts.length} محصول
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-primary text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm lg:text-base w-full sm:w-auto justify-center"
                >
                    <FaPlus />
                    <span>افزودن محصول</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="جستجو بر اساس نام یا SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">همه محصولات</option>
                            <option value="active">فعال</option>
                            <option value="inactive">غیرفعال</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تصویر</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام محصول</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">دسته‌بندی</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">قیمت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">موجودی</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            {product.isFeatured && (
                                                <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                                    ویژه
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{product.sku}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {product.finalPrice.toLocaleString('fa-IR')} تومان
                                            </p>
                                            {product.basePrice !== product.finalPrice && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    {product.basePrice.toLocaleString('fa-IR')}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${product.stockQuantity === 0
                                                ? 'bg-red-100 text-red-800'
                                                : product.stockQuantity < 10
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}
                                        >
                                            {product.stockQuantity} عدد
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(product.id)}
                                            className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${product.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {product.isActive ? <FaEye /> : <FaEyeSlash />}
                                            {product.isActive ? 'فعال' : 'غیرفعال'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="ویرایش"
                                            >
                                                <FaEdit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="حذف"
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

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">محصولی یافت نشد</p>
                    </div>
                )}
            </div>

            {/* Products Cards - Mobile */}
            <div className="lg:hidden space-y-4">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex gap-4">
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleStatus(product.id)}
                                        className={`flex-shrink-0 p-2 rounded-full ${product.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {product.isActive ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                    {product.isFeatured && (
                                        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                                            ویژه
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-600">{product.category}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {product.finalPrice.toLocaleString('fa-IR')} تومان
                                        </p>
                                        {product.basePrice !== product.finalPrice && (
                                            <p className="text-xs text-gray-500 line-through">
                                                {product.basePrice.toLocaleString('fa-IR')}
                                            </p>
                                        )}
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${product.stockQuantity === 0
                                            ? 'bg-red-100 text-red-800'
                                            : product.stockQuantity < 10
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}
                                    >
                                        {product.stockQuantity} عدد
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                            <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <FaEdit size={14} />
                                <span className="text-sm">ویرایش</span>
                            </Link>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <FaTrash size={14} />
                                <span className="text-sm">حذف</span>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500">محصولی یافت نشد</p>
                    </div>
                )}
            </div>
        </div>
    );
}
