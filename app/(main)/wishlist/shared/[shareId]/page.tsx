'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaShoppingCart, FaStar, FaArrowLeft } from 'react-icons/fa';
import { useProducts } from '@/lib/hooks/useProducts';
import { useCart } from '@/lib/context/CartContext';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function SharedWishlistPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const { data: allProducts = [], isLoading } = useProducts();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shareId || !allProducts.length) return;

    try {
      const decoded = JSON.parse(atob(shareId));
      const productIds = decoded.items;

      const products = allProducts.filter(p => productIds.includes(p.id));
      setWishlistProducts(products);
    } catch (err) {
      setError(true);
    }
  }, [shareId, allProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} به سبد خرید اضافه شد`, {
      icon: '🛒',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !wishlistProducts.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            لیست علاقه‌مندی یافت نشد
          </h2>
          <p className="text-gray-500 mb-8">
            ممکن است لینک اشتباه باشد یا منقضی شده باشد
          </p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'علاقه‌مندی‌ها', href: '/wishlist' },
        { label: 'لیست اشتراکی' }
      ]} />

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-8 border border-pink-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaHeart className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              لیست علاقه‌مندی‌های اشتراکی
            </h1>
            <p className="text-gray-600 mt-1">
              {wishlistProducts.length} محصول در این لیست
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link
            href="/wishlist"
            className="flex items-center gap-2 px-4 py-2 bg-white text-secondary rounded-lg hover:bg-gray-50 transition-colors font-semibold border border-gray-200"
          >
            <FaHeart className="text-primary" />
            <span>لیست علاقه‌مندی‌های من</span>
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
          >
            <span>مشاهده فروشگاه</span>
            <FaArrowLeft />
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <Link href={`/product/${product.slug}`}>
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {discount > 0 && (
                    <span className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {discount}% تخفیف
                    </span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white text-lg font-bold bg-gray-900 px-4 py-2 rounded-lg">ناموجود</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-lg font-semibold text-secondary mb-2 hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {product.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm text-gray-600 mr-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviewCount} نظر)</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <div>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through block">
                        {product.originalPrice.toLocaleString('fa-IR')} تومان
                      </span>
                    )}
                    <span className="text-lg font-bold text-primary">
                      {product.price.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-primary text-white p-2.5 rounded-full hover:bg-primary-dark hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    disabled={!product.inStock}
                    title="افزودن به سبد خرید"
                  >
                    <FaShoppingCart className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
