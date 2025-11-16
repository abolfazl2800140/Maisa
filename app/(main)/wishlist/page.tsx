'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCart } from '@/lib/context/CartContext';

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
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center py-16">
                    <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">
                        لیست علاقه‌مندی‌های شما خالی است
                    </h2>
                    <p className="text-gray-500 mb-8">
                        محصولات مورد علاقه خود را به این لیست اضافه کنید
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
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-secondary flex items-center gap-2">
                    <FaHeart className="text-primary" />
                    لیست علاقه‌مندی‌ها
                </h1>
                <button
                    onClick={clearWishlist}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
                >
                    <FaTrash />
                    پاک کردن همه
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((product) => {
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
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(product.id);
                                        }}
                                        className="absolute top-3 left-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        title="حذف از علاقه‌مندی‌ها"
                                    >
                                        <FaTrash className="text-sm" />
                                    </button>
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
                                            <span className="text-yellow-400">★</span>
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
                                        onClick={() => addToCart(product)}
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
