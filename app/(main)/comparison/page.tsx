'use client';

import { useComparison } from '@/lib/context/ComparisonContext';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import { FaShoppingCart, FaTimes, FaStar, FaCheck, FaTimes as FaX, FaSearch, FaLightbulb } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';

export default function ComparisonPage() {
  const { items, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Breadcrumb items={[{ label: 'مقایسه محصولات' }]} />
        <EmptyState
          icon={<FaSearch className="text-6xl text-gray-400" />}
          title="لیست مقایسه خالی است"
          description="هنوز محصولی برای مقایسه اضافه نکرده‌اید"
          actionLabel="مشاهده محصولات"
          actionHref="/shop"
        />
      </div>
    );
  }

  const features = [
    { key: 'price', label: 'قیمت' },
    { key: 'originalPrice', label: 'قیمت اصلی' },
    { key: 'discount', label: 'تخفیف' },
    { key: 'rating', label: 'امتیاز' },
    { key: 'reviewCount', label: 'تعداد نظرات' },
    { key: 'inStock', label: 'موجودی' },
    { key: 'category', label: 'دسته‌بندی' },
  ];

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'backpack': 'کوله پشتی',
      'laptop-bag': 'کیف لپ‌تاپ',
      'school-bag': 'کیف مدرسه',
    };
    return categories[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'مقایسه محصولات' }]} />

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">مقایسه محصولات</h1>
            <p className="text-gray-600">مقایسه {items.length} محصول</p>
          </div>
          <button
            onClick={() => {
              clearComparison();
              toast.success('لیست مقایسه پاک شد');
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            پاک کردن همه
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="p-4 text-right font-bold text-gray-700 bg-gray-50 sticky right-0 z-10">
                  ویژگی
                </th>
                {items.map((product) => (
                  <th key={product.id} className="p-4 min-w-[250px]">
                    <div className="relative">
                      <button
                        onClick={() => {
                          removeFromComparison(product.id);
                          toast.success('محصول از لیست مقایسه حذف شد');
                        }}
                        className="absolute -top-2 -left-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg z-20"
                      >
                        <FaTimes />
                      </button>
                      <Link href={`/product/${product.slug}`}>
                        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                        </div>
                      </Link>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-bold text-secondary hover:text-primary transition-colors mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => {
                          addToCart(product);
                          toast.success('محصول به سبد خرید اضافه شد');
                        }}
                        disabled={!product.inStock}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <FaShoppingCart />
                        افزودن به سبد
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={feature.key}
                  className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                >
                  <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky right-0 z-10">
                    {feature.label}
                  </td>
                  {items.map((product) => {
                    const value = product[feature.key as keyof typeof product];

                    if (feature.key === 'price') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          <span className="text-xl font-bold text-primary">
                            {(value as number).toLocaleString('fa-IR')} تومان
                          </span>
                        </td>
                      );
                    }

                    if (feature.key === 'originalPrice') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {value ? (
                            <span className="text-gray-400 line-through">
                              {(value as number).toLocaleString('fa-IR')} تومان
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'discount') {
                      const discount = product.originalPrice
                        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                        : 0;
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {discount > 0 ? (
                            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                              {discount}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'rating') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {value ? (
                            <div className="flex items-center justify-center gap-1">
                              <FaStar className="text-yellow-400" />
                              <span className="font-semibold">{value as number}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'reviewCount') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {value ? (
                            <span className="text-gray-600">{value as number} نظر</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'inStock') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {value ? (
                            <span className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                              <FaCheck />
                              موجود
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2 text-red-600 font-semibold">
                              <FaX />
                              ناموجود
                            </span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'category') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {getCategoryName(value as string)}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={product.id} className="p-4 text-center">
                        {value?.toString() || '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="p-4 font-semibold text-gray-700 sticky right-0 z-10 bg-gray-50">
                  توضیحات
                </td>
                {items.map((product) => (
                  <td key={product.id} className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <FaLightbulb className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              می‌توانید حداکثر 4 محصول را با هم مقایسه کنید. برای افزودن محصول جدید، روی دکمه "مقایسه" در صفحه محصولات کلیک کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
