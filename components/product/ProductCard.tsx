'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { ShoppingBag, Heart, Eye, GitCompare, Star } from 'lucide-react';
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
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    toast.success(`${product.name} به سبد خرید اضافه شد`);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('از علاقه‌مندی‌ها حذف شد');
    } else {
      addToWishlist(product);
      toast.success('به علاقه‌مندی‌ها اضافه شد');
    }
  };

  const handleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(product.id);
      toast.success('از مقایسه حذف شد');
    } else if (canAddMore) {
      addToComparison(product);
      toast.success('به مقایسه اضافه شد');
    } else {
      toast.error('حداکثر ۴ محصول قابل مقایسه است');
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Compact mode for carousels
  if (compact) {
    return (
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200">
          <div className="relative aspect-square bg-gray-50">
            <img
              src={product.images[0] || '/images/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
            />
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                {toPersianNumbers(discount)}%
              </span>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <span className="text-gray-500 text-sm font-medium">ناموجود</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10 mb-2">
              {product.name}
            </h3>
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-500">{toPersianNumbers(product.rating)}</span>
              </div>
            )}
            <div className="space-y-1">
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through block">
                  {formatPricePersian(product.originalPrice)}
                </span>
              )}
              <span className="text-sm font-bold text-gray-900">
                {formatPricePersian(product.price)} <span className="text-xs font-normal text-gray-500">تومان</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // List view
  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <Link href={`/product/${product.slug}`} className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={product.images[0] || '/images/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
              {discount > 0 && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {toPersianNumbers(discount)}%
                </span>
              )}
            </Link>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors mb-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                {product.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{toPersianNumbers(product.rating)}</span>
                    </div>
                    <span className="text-xs text-gray-400">({toPersianNumbers(product.reviewCount || 0)} نظر)</span>
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQuickView}
                    className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    title="مشاهده سریع"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleComparison}
                    className={`p-2.5 rounded-xl transition-colors ${
                      inComparison 
                        ? 'text-blue-500 bg-blue-50' 
                        : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                    }`}
                    title="مقایسه"
                  >
                    <GitCompare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`p-2.5 rounded-xl transition-colors ${
                      inWishlist 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title="علاقه‌مندی"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAdding}
                    className="flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAdding ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">افزودن</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <QuickViewModal product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
      </>
    );
  }

  // Grid view (default)
  return (
    <>
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200 flex flex-col h-full">
        <Link href={`/product/${product.slug}`} className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                {toPersianNumbers(discount)}%
              </span>
            )}
            {product.featured && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                ویژه
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-gray-500 font-medium">ناموجود</span>
            </div>
          )}

          {/* Quick actions */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleQuickView}
              className="p-2 bg-white text-gray-600 hover:text-primary rounded-xl shadow-sm hover:shadow transition-all"
              title="مشاهده سریع"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleComparison}
              className={`p-2 rounded-xl shadow-sm hover:shadow transition-all ${
                inComparison 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:text-blue-500'
              }`}
              title="مقایسه"
            >
              <GitCompare className="w-4 h-4" />
            </button>
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-xl shadow-sm hover:shadow transition-all ${
                inWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
              title="علاقه‌مندی"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-1">
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10 mb-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{toPersianNumbers(product.rating)}</span>
              </div>
              <span className="text-xs text-gray-400">({toPersianNumbers(product.reviewCount || 0)} نظر)</span>
            </div>
          )}

          <div className="mt-auto">
            <div className="mb-3">
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through block">
                  {formatPricePersian(product.originalPrice)} تومان
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {formatPricePersian(product.price)} تومان
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className="w-full flex items-center justify-center gap-2 h-10 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              افزودن به سبد
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
