'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-primary/20">
      <Link href={`/product/${product.slug}`}>
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10 animate-pulse">
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
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-semibold text-secondary mb-2 hover:text-primary transition-colors">
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

          <div className="flex gap-2">
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
              className="bg-primary text-white p-2.5 rounded-full hover:bg-primary-dark hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
  );
}
