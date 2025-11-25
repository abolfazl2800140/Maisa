'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart, FaShoppingCart, FaTrash, FaShare } from 'react-icons/fa';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCart } from '@/lib/context/CartContext';
import Breadcrumb from '@/components/ui/Breadcrumb';
import toast from 'react-hot-toast';

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
                    <div className="relative">
                        <div className="w-14 h-14 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
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
            } catch (err) {
                // User cancelled or error
                copyToClipboard(shareUrl);
            }
        } else {
            copyToClipboard(shareUrl);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('لینک اشتراک‌گذاری کپی شد!', {
            icon: '🔗',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumb items={[{ label: 'علاقه‌مندی‌ها' }]} />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-secondary flex items-center gap-2">
                    <FaHeart className="text-primary" />
                    لیست علاقه‌مندی‌ها
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                        <FaShare />
                        <span>اشتراک‌گذاری</span>
                    </button>
                    <button
                        onClick={clearWishlist}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 px-4 py-2 border border-red-500 rounded-lg hover:bg-red-50"
                    >
                        <FaTrash />
                        <span className="hidden sm:inline">پاک کردن همه</span>
                    </button>
                </div>
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
                                    <img
                                        src={product.images[0] || '/images/placeholder.jpg'}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                        }}
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
