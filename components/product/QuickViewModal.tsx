'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { X, Star, ShoppingBag, Heart, ExternalLink, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import toast from 'react-hot-toast';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    toast.success(`${toPersianNumbers(quantity)} عدد ${product.name} به سبد خرید اضافه شد`);
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
      onClose();
    }, 500);
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('از علاقه‌مندی‌ها حذف شد');
    } else {
      addToWishlist(product);
      toast.success('به علاقه‌مندی‌ها اضافه شد');
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-semibold text-gray-900">مشاهده سریع</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images */}
              <div>
                <div className="relative aspect-square mb-3 rounded-2xl overflow-hidden bg-gray-50">
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                  {discount > 0 && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                      {toPersianNumbers(discount)}%
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {toPersianNumbers(product.rating)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      ({toPersianNumbers(product.reviewCount || 0)} نظر)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through block mb-1">
                      {formatPricePersian(product.originalPrice)} تومان
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary">
                    {formatPricePersian(product.price)} تومان
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">توضیحات</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">موجود در انبار</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-500">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">ناموجود</span>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                {product.inStock && (
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">تعداد</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900">
                        {toPersianNumbers(quantity)}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAdding}
                    className="flex-1 flex items-center justify-center gap-2 h-12 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAdding ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                    افزودن به سبد خرید
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-colors ${
                      inWishlist
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* View Full Details */}
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 mt-3 h-12 text-primary font-medium border border-primary rounded-xl hover:bg-primary/5 transition-colors"
                >
                  مشاهده جزئیات کامل
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
