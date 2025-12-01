'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, Share2, Package } from 'lucide-react';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCart } from '@/lib/context/CartContext';
import Breadcrumb from '@/components/ui/Breadcrumb';
import toast from 'react-hot-toast';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        <Breadcrumb items={[{ label: 'علاقه‌مندی‌ها' }]} />
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">لیست علاقه‌مندی خالی است</h2>
          <p className="text-gray-500 mb-6">محصولات مورد علاقه خود را به این لیست اضافه کنید</p>
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

  const handleShare = async () => {
    const wishlistData = {
      items: items.map(p => p.id),
      timestamp: Date.now()
    };
    
    const shareId = btoa(JSON.stringify(wishlistData));
    const shareUrl = `${window.location.origin}/wishlist/shared/${shareId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'لیست علاقه‌مندی‌های من',
          text: `${items.length} محصول در لیست علاقه‌مندی‌های من`,
          url: shareUrl,
        });
      } catch {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('لینک اشتراک‌گذاری کپی شد');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'علاقه‌مندی‌ها' }]} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">علاقه‌مندی‌ها</h1>
          <span className="text-sm text-gray-500">({toPersianNumbers(items.length)} محصول)</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 h-10 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>اشتراک‌گذاری</span>
          </button>
          <button
            onClick={() => {
              clearWishlist();
              toast.success('لیست علاقه‌مندی پاک شد');
            }}
            className="flex items-center gap-2 h-10 px-4 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">پاک کردن همه</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((product) => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
              {/* Image */}
              <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-gray-50">
                <img
                  src={product.images[0] || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                />
                
                {/* Badges */}
                {discount > 0 && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-medium px-2 py-1 rounded-full">
                    {toPersianNumbers(discount)}%
                  </span>
                )}
                
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-gray-900 px-3 py-1.5 rounded-lg">ناموجود</span>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product.id);
                    toast.success('از علاقه‌مندی‌ها حذف شد');
                  }}
                  className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>

              {/* Info */}
              <div className="p-3">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600">{toPersianNumbers(product.rating)}</span>
                    <span className="text-xs text-gray-400">({toPersianNumbers(product.reviewCount || 0)})</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through block">
                        {formatPricePersian(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-sm font-bold text-primary">
                      {formatPricePersian(product.price)} تومان
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success('به سبد خرید اضافه شد');
                    }}
                    disabled={!product.inStock}
                    className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
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
