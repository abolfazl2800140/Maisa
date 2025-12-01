'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag, Truck, Plus, Minus, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';
import RelatedProducts from '@/components/product/RelatedProducts';
import { useProducts } from '@/lib/hooks/useProducts';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const { data: allProducts = [] } = useProducts();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} از سبد خرید حذف شد`);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
    if (newQuantity === 0) {
      toast.success('محصول از سبد خرید حذف شد');
    }
  };

  const shipping = 50000;
  const total = totalPrice + shipping;

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">سبد خرید خالی است</h2>
          <p className="text-gray-500 mb-6">هنوز محصولی به سبد خرید اضافه نکرده‌اید</p>
          <Link
            href="/shop"
            className="flex items-center gap-2 h-12 px-6 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            مشاهده محصولات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'سبد خرید' }]} />
      
      <h1 className="text-2xl font-bold text-gray-900 mb-8">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4"
            >
              <Link href={`/product/${item.product.slug}`} className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="font-medium text-gray-900 hover:text-primary transition-colors mb-1 truncate">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-primary font-semibold mb-3">
                  {formatPricePersian(item.product.price)} تومان
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-medium text-gray-900">
                      {toPersianNumbers(item.quantity)}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.product.id, item.product.name)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="hidden sm:block text-left">
                <p className="font-semibold text-gray-900">
                  {formatPricePersian(item.product.price * item.quantity)} تومان
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">خلاصه سفارش</h2>

            {/* Discount Code */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="کد تخفیف"
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all"
                  />
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <button className="h-10 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  اعمال
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">جمع کل</span>
                <span className="text-gray-900">{formatPricePersian(totalPrice)} تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">هزینه ارسال</span>
                <span className="text-gray-900">{formatPricePersian(shipping)} تومان</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">مجموع</span>
                <span className="font-bold text-primary text-lg">{formatPricePersian(total)} تومان</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">ارسال سریع</p>
                  <p className="text-xs text-green-600">تحویل ۲ تا ۳ روز کاری</p>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full h-12 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors mb-3"
            >
              ادامه خرید
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="flex items-center justify-center w-full h-12 text-gray-600 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              ادامه خرید از فروشگاه
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {items.length > 0 && allProducts.length > 0 && (
        <div className="mt-12">
          <RelatedProducts
            products={getRelatedProducts()}
            title="پیشنهاد برای شما"
          />
        </div>
      )}
    </div>
  );

  function getRelatedProducts() {
    if (!allProducts.length || !items.length) return [];
    const cartCategories = items.map(item => item.product.category);
    const cartProductIds = items.map(item => item.product.id);
    const related = allProducts.filter(
      product =>
        cartCategories.includes(product.category) &&
        !cartProductIds.includes(product.id) &&
        product.inStock
    );
    return related.slice(0, 8);
  }
}
