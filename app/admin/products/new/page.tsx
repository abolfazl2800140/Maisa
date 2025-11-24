'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowRight, FaSave, FaPlus, FaTrash } from 'react-icons/fa';

interface ProductVariant {
    id: string;
    color: string;
    colorCode: string;
    size: string;
    sku: string;
    priceAdjustment: number;
    stockQuantity: number;
}

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        categoryId: '',
        brandId: '',
        basePrice: '',
        discountPercentage: '0',
        sku: '',
        weight: '',
        tags: '',
        isFeatured: false,
        isActive: true,
    });

    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [images, setImages] = useState<File[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: API call برای ذخیره محصول
            console.log('Product Data:', formData);
            console.log('Variants:', variants);
            console.log('Images:', images);

            // موقتاً
            setTimeout(() => {
                alert('محصول با موفقیت ایجاد شد');
                router.push('/admin/products');
            }, 1000);
        } catch (error) {
            alert('خطا در ایجاد محصول');
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '');
        setFormData((prev) => ({ ...prev, slug }));
    };

    const addVariant = () => {
        const newVariant: ProductVariant = {
            id: Date.now().toString(),
            color: '',
            colorCode: '#000000',
            size: '',
            sku: '',
            priceAdjustment: 0,
            stockQuantity: 0,
        };
        setVariants([...variants, newVariant]);
    };

    const removeVariant = (id: string) => {
        setVariants(variants.filter((v) => v.id !== id));
    };

    const updateVariant = (id: string, field: string, value: any) => {
        setVariants(
            variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaArrowRight size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">افزودن محصول جدید</h1>
                        <p className="text-gray-600 mt-1">اطلاعات محصول را وارد کنید</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        اطلاعات پایه
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                نام محصول *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={generateSlug}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="مثال: کوله پشتی لپ‌تاپ مدل X"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug (نامک URL) *
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="backpack-laptop-x"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                به صورت خودکار از نام محصول ایجاد می‌شود
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                توضیحات
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="توضیحات کامل محصول..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                دسته‌بندی *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">انتخاب کنید</option>
                                <option value="1">کوله پشتی</option>
                                <option value="2">کیف دستی</option>
                                <option value="3">کیف لپ‌تاپ</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                برند
                            </label>
                            <select
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">انتخاب کنید</option>
                                <option value="1">مایسا</option>
                                <option value="2">دلسی</option>
                                <option value="3">سامسونایت</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SKU *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="BP-1001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                وزن (گرم)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="500"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">قیمت‌گذاری</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                قیمت پایه (تومان) *
                            </label>
                            <input
                                type="number"
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="500000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                درصد تخفیف
                            </label>
                            <input
                                type="number"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {formData.basePrice && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">قیمت نهایی:</p>
                            <p className="text-2xl font-bold text-primary">
                                {(
                                    Number(formData.basePrice) *
                                    (1 - Number(formData.discountPercentage) / 100)
                                ).toLocaleString('fa-IR')}{' '}
                                تومان
                            </p>
                        </div>
                    )}
                </div>

                {/* Variants */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            انواع محصول (Variants)
                        </h2>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="flex items-center gap-2 text-primary hover:text-primary-dark"
                        >
                            <FaPlus />
                            <span>افزودن Variant</span>
                        </button>
                    </div>

                    {variants.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            هنوز Variant اضافه نشده است
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {variants.map((variant) => (
                                <div
                                    key={variant.id}
                                    className="p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                                رنگ
                                            </label>
                                            <input
                                                type="text"
                                                value={variant.color}
                                                onChange={(e) =>
                                                    updateVariant(variant.id, 'color', e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                placeholder="مشکی"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                                کد رنگ
                                            </label>
                                            <input
                                                type="color"
                                                value={variant.colorCode}
                                                onChange={(e) =>
                                                    updateVariant(variant.id, 'colorCode', e.target.value)
                                                }
                                                className="w-full h-10 border border-gray-300 rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                                سایز
                                            </label>
                                            <input
                                                type="text"
                                                value={variant.size}
                                                onChange={(e) =>
                                                    updateVariant(variant.id, 'size', e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                placeholder="L"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                                SKU
                                            </label>
                                            <input
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) =>
                                                    updateVariant(variant.id, 'sku', e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                placeholder="BP-1001-BLK-L"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                                موجودی
                                            </label>
                                            <input
                                                type="number"
                                                value={variant.stockQuantity}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        variant.id,
                                                        'stockQuantity',
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                placeholder="10"
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(variant.id)}
                                                className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <FaTrash className="mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">تنظیمات</h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-gray-700">محصول ویژه</span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-gray-700">فعال</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                        <FaSave />
                        <span>{loading ? 'در حال ذخیره...' : 'ذخیره محصول'}</span>
                    </button>
                    <Link
                        href="/admin/products"
                        className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        انصراف
                    </Link>
                </div>
            </form>
        </div>
    );
}
