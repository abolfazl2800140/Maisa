'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { FaTimes, FaStar, FaShoppingCart, FaHeart, FaExternalLinkAlt } from 'react-icons/fa';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import toast from 'react-hot-toast';

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
    toast.success(`${quantity} عدد ${product.name} به سبد خرید اضافه شد`, {
      icon: '🛒',
    });
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-secondary">مشاهده سریع</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="بستن"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Images */}
              <div>
                {/* Main Image */}
                <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {discount > 0 && (
                    <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                      {discount}% تخفیف
                    </span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-lg font-bold bg-gray-900 px-6 py-3 rounded-lg">
                        ناموجود
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-secondary mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(product.rating!)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                      <span className="text-gray-600 mr-2">{product.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({product.reviewCount} نظر)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  {product.originalPrice && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl text-gray-400 line-through">
                        {product.originalPrice.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-primary">
                    {product.price.toLocaleString('fa-IR')} تومان
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">توضیحات</h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="font-semibold">موجود در انبار</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="font-semibold">ناموجود</span>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                {product.inStock && (
                  <div className="mb-6">
                    <label className="font-semibold mb-2 block">تعداد:</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="w-16 text-center font-semibold text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAdding}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAdding ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        در حال افزودن...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart />
                        افزودن به سبد خرید
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`w-12 h-12 rounded-lg transition-all flex items-center justify-center ${
                      inWishlist
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                    title={
                      inWishlist
                        ? 'حذف از علاقه‌مندی‌ها'
                        : 'افزودن به علاقه‌مندی‌ها'
                    }
                  >
                    <FaHeart
                      className={inWishlist ? 'text-white' : 'text-gray-600'}
                    />
                  </button>
                </div>

                {/* View Full Details */}
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 text-primary font-semibold hover:gap-3 transition-all py-3 border border-primary rounded-lg hover:bg-primary/5"
                >
                  <span>مشاهده جزئیات کامل</span>
                  <FaExternalLinkAlt className="text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
