'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa';

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
            // TODO: فعلاً داده‌های نمونه - بعداً از API می‌گیریم
            setTimeout(() => {
                const mockProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
                    id: `product-${i + 1}`,
                    name: `کوله پشتی مدل ${i + 1}`,
                    slug: `backpack-${i + 1}`,
                    sku: `BP-${1000 + i}`,
                    basePrice: 500000 + i * 50000,
                    finalPrice: 450000 + i * 50000,
                    stockQuantity: Math.floor(Math.random() * 50),
                    category: 'کوله پشتی',
                    brand: 'مایسا',
                    image: '/images/products/backpack-1.jpg',
                    isActive: Math.random() > 0.2,
                    isFeatured: Math.random() > 0.7,
                }));
                setProducts(mockProducts);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('خطا در دریافت محصولات:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) return;

        try {
            // TODO: API call
            setProducts(products.filter((p) => p.id !== id));
            alert('محصول با موفقیت حذف شد');
        } catch (error) {
            alert('خطا در حذف محصول');
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            // TODO: API call
            setProducts(
                products.map((p) =>
                    p.id === id ? { ...p, isActive: !p.isActive } : p
                )
            );
        } catch (error) {
            alert('خطا در تغییر وضعیت');
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
                    <p className="text-gray-600 mt-1">
                        {filteredProducts.length} محصول
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <FaPlus />
                    <span>افزودن محصول</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
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

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    تصویر
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    نام محصول
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    دسته‌بندی
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    قیمت
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    موجودی
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
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
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
        </div>
    );
}
