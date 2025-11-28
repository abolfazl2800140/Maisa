'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { FaStar, FaShoppingCart, FaHeart, FaEye, FaExchangeAlt } from 'react-icons/fa';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useComparison } from '@/lib/context/ComparisonContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import QuickViewModal from './QuickViewModal';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  compact?: boolean;
}

export default function ProductCard({ product, viewMode = 'grid', compact = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
  const [isAdding, setIsAdding] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inComparison = isInComparison(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product);

    toast.success(`${product.name} به سبد خرید اضافه شد`, {
      icon: '🛒',
    });

    setTimeout(() => setIsAdding(false), 500);
  };
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Compact mode for carousels
  if (compact) {
    return (
      <Link href={`/product/${product.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group border border-gray-100">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
            }}
          />
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
              {discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-gray-900 px-2 py-1 rounded">ناموجود</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs text-gray-500">{toPersianNumbers(product.rating)}</span>
            </div>
          )}
          <div className="space-y-1">
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through block">
                {formatPricePersian(product.originalPrice)}
              </span>
            )}
            <span className="text-sm font-bold text-gray-800">
              {formatPricePersian(product.price)} <span className="text-xs font-normal text-gray-500">تومان</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20">
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <Link href={`/product/${product.slug}`} className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-white rounded-lg">
              <img
                src={product.images[0] || '/images/placeholder.jpg'}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain p-2 rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
              {discount > 0 && (
                <span className="absolute top-2 right-2 bg-sale text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                  {discount}% تخفیف
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm rounded-lg">
                  <span className="text-white text-sm font-bold bg-gray-900 px-3 py-1 rounded-lg">ناموجود</span>
                </div>
              )}
            </Link>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-xl font-semibold text-secondary mb-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                {product.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm text-gray-600 mr-1">{toPersianNumbers(product.rating || 0)}</span>
                    </div>
                    <span className="text-xs text-gray-500">({toPersianNumbers(product.reviewCount || 0)} نظر)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through block">
                      {formatPricePersian(product.originalPrice)} تومان
                    </span>
                  )}
                  <span className="text-xl font-bold text-primary">
                    {formatPricePersian(product.price)} تومان
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setQuickViewOpen(true);
                    }}
                    className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                    title="مشاهده سریع"
                  >
                    <FaEye className="text-lg" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (inComparison) {
                        removeFromComparison(product.id);
                        toast.success('از لیست مقایسه حذف شد');
                      } else if (canAddMore) {
                        addToComparison(product);
                        toast.success('به لیست مقایسه اضافه شد');
                      } else {
                        toast.error('حداکثر 4 محصول قابل مقایسه است');
                      }
                    }}
                    className={`p-2.5 rounded-full hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg ${inComparison
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white'
                      }`}
                    title={inComparison ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
                  >
                    <FaExchangeAlt className="text-lg" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
                    }}
                    className={`p-2.5 rounded-full hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg ${inWishlist
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    title={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                  >
                    <FaHeart className="text-lg" />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="bg-accent text-white px-6 py-2.5 rounded-full hover:bg-accent-dark hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
                    disabled={!product.inStock || isAdding}
                    title="افزودن به سبد خرید"
                  >
                    {isAdding ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaShoppingCart className="text-lg" />
                        <span className="hidden sm:inline">افزودن به سبد</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick View Modal */}
        <QuickViewModal
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-primary/20 flex flex-col h-[480px]">
        <Link href={`/product/${product.slug}`}>
          <div className="relative h-64 overflow-hidden bg-white flex-shrink-0">
            <img
              src={product.images[0] || '/images/placeholder.jpg'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
            />
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-sale text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10 animate-pulse">
                {discount}% تخفیف
              </span>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-lg font-bold bg-gray-900 px-4 py-2 rounded-lg">ناموجود</span>
              </div>
            )}
            {product.featured && (
              <span className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                ویژه
              </span>
            )}

            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm text-secondary py-3 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
            >
              <FaEye />
              <span>مشاهده سریع</span>
            </button>
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-1">
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-lg font-semibold text-secondary mb-2 hover:text-primary transition-colors line-clamp-2 h-14">
              {product.name}
            </h3>
          </Link>

          {product.rating && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="text-sm text-gray-600 mr-1">{toPersianNumbers(product.rating)}</span>
              </div>
              <span className="text-xs text-gray-500">({toPersianNumbers(product.reviewCount || 0)} نظر)</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through block">
                  {formatPricePersian(product.originalPrice)} تومان
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {formatPricePersian(product.price)} تومان
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (inComparison) {
                    removeFromComparison(product.id);
                    toast.success('از لیست مقایسه حذف شد');
                  } else if (canAddMore) {
                    addToComparison(product);
                    toast.success('به لیست مقایسه اضافه شد');
                  } else {
                    toast.error('حداکثر 4 محصول قابل مقایسه است');
                  }
                }}
                className={`p-2.5 rounded-full hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg ${inComparison
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white'
                  }`}
                title={inComparison ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
              >
                <FaExchangeAlt className="text-lg" />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
                }}
                className={`p-2.5 rounded-full hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg ${inWishlist
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                title={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              >
                <FaHeart className="text-lg" />
              </button>

              <button
                onClick={handleAddToCart}
                className="bg-accent text-white p-2.5 rounded-full hover:bg-accent-dark hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={!product.inStock || isAdding}
                title="افزودن به سبد خرید"
              >
                {isAdding ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <FaShoppingCart className="text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
