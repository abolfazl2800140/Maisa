'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import toast from 'react-hot-toast';
import { formatPricePersian } from '@/lib/utils/persianNumbers';

interface StickyAddToCartProps {
  product: Product;
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    toast.success(`${product.name} به سبد خرید اضافه شد`);
    setTimeout(() => setIsAdding(false), 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-100 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-0.5">قیمت</div>
            <div className="text-lg font-bold text-primary">
              {formatPricePersian(product.price)} تومان
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="flex-1 h-12 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>افزودن به سبد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
