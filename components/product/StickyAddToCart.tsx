'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/lib/context/CartContext';
import toast from 'react-hot-toast';

interface StickyAddToCartProps {
  product: Product;
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    toast.success(`${product.name} به سبد خرید اضافه شد`, { icon: '🛒' });
    setTimeout(() => setIsAdding(false), 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-up">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1">قیمت:</div>
            <div className="text-xl font-bold text-primary">
              {product.price.toLocaleString('fa-IR')} تومان
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isAdding ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FaShoppingCart />
                <span>افزودن به سبد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
