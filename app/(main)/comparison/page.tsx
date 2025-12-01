'use client';

import { useComparison } from '@/lib/context/ComparisonContext';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import { ShoppingCart, X, Star, Check, X as XIcon, Search, Lightbulb, Trash2, GitCompare } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';

export default function ComparisonPage() {
  const { items, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Breadcrumb items={[{ label: 'مقایسه محصولات' }]} />
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <GitCompare className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">لیست مقایسه خالی است</h2>
          <p className="text-gray-500 mb-6">هنوز محصولی برای مقایسه اضافه نکرده‌اید</p>
          <Link
            href="/shop"
            className="flex items-center gap-2 h-12 px-6 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            مشاهده محصولات
          </Link>
        </div>
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
      'backpacks': 'کوله پشتی',
      'laptop-bag': 'کیف لپ‌تاپ',
      'laptop-bags': 'کیف لپ‌تاپ',
      'school-bag': 'کیف مدرسه',
      'school-bags': 'کیف مدرسه',
    };
    return categories[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'مقایسه محصولات' }]} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">مقایسه محصولات</h1>
          <p className="text-sm text-gray-500">{toPersianNumbers(items.length)} محصول</p>
        </div>
        <button
          onClick={() => {
            clearComparison();
            toast.success('لیست مقایسه پاک شد');
          }}
          className="flex items-center gap-2 h-10 px-4 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          پاک کردن همه
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="p-4 text-right text-sm font-semibold text-gray-700 bg-gray-50 sticky right-0 z-10 min-w-[120px]">
                  ویژگی
                </th>
                {items.map((product) => (
                  <th key={product.id} className="p-4 min-w-[220px]">
                    <div className="relative">
                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          removeFromComparison(product.id);
                          toast.success('از لیست مقایسه حذف شد');
                        }}
                        className="absolute -top-1 -left-1 w-7 h-7 bg-gray-100 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors flex items-center justify-center z-20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {/* Product Image */}
                      <Link href={`/product/${product.slug}`}>
                        <div className="relative h-40 mb-3 rounded-xl overflow-hidden bg-gray-50">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                        </div>
                      </Link>
                      
                      {/* Product Name */}
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-sm font-medium text-gray-900 hover:text-primary transition-colors mb-3 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Add to Cart */}
                      <button
                        onClick={() => {
                          addToCart(product);
                          toast.success('به سبد خرید اضافه شد');
                        }}
                        disabled={!product.inStock}
                        className="w-full h-10 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
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
                  className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
                >
                  <td className="p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky right-0 z-10">
                    {feature.label}
                  </td>
                  {items.map((product) => {
                    const value = product[feature.key as keyof typeof product];

                    if (feature.key === 'price') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          <span className="text-base font-bold text-primary">
                            {formatPricePersian(value as number)} تومان
                          </span>
                        </td>
                      );
                    }

                    if (feature.key === 'originalPrice') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {value ? (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPricePersian(value as number)} تومان
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
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
                            <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                              {toPersianNumbers(discount)}%
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'rating') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {value ? (
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium text-gray-700">{toPersianNumbers(value as number)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'reviewCount') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {value ? (
                            <span className="text-sm text-gray-600">{toPersianNumbers(value as number)} نظر</span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'inStock') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          {value ? (
                            <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                              <Check className="w-4 h-4" />
                              موجود
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-sm text-red-500 font-medium">
                              <XIcon className="w-4 h-4" />
                              ناموجود
                            </span>
                          )}
                        </td>
                      );
                    }

                    if (feature.key === 'category') {
                      return (
                        <td key={product.id} className="p-4 text-center">
                          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                            {getCategoryName(value as string)}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={product.id} className="p-4 text-center text-sm text-gray-600">
                        {value?.toString() || '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              {/* Description Row */}
              <tr className="bg-gray-50/50">
                <td className="p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky right-0 z-10">
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
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            می‌توانید حداکثر ۴ محصول را با هم مقایسه کنید. برای افزودن محصول جدید، روی دکمه "مقایسه" در صفحه محصولات کلیک کنید.
          </p>
        </div>
      </div>
    </div>
  );
}
