'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '@/lib/context/CartContext';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleRemove = (productId: string, productName: string) => {
        removeFromCart(productId);
        toast.success(`${productName} از سبد خرید حذف شد`, {
            icon: '🗑️',
        });
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        updateQuantity(productId, newQuantity);
        if (newQuantity === 0) {
            toast.success('محصول از سبد خرید حذف شد', {
                icon: '🗑️',
            });
        }
    };

    const shipping = 50000;
    const total = totalPrice + shipping;

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
                    <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">
                        سبد خرید شما خالی است
                    </h2>
                    <Link
                        href="/shop"
                        className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                    >
                        بازگشت به فروشگاه
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-secondary">سبد خرید</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {items.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                                <Link href={`/product/${item.product.slug}`} className="relative w-24 h-24 flex-shrink-0">
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </Link>

                                <div className="flex-1">
                                    <Link href={`/product/${item.product.slug}`}>
                                        <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                                            {item.product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-primary font-bold mb-3">
                                        {item.product.price.toLocaleString('fa-IR')} تومان
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(item.product.id, item.product.name)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <p className="font-bold text-lg">
                                        {(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-secondary">
                            خلاصه سفارش
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">جمع کل:</span>
                                <span className="font-semibold">
                                    {totalPrice.toLocaleString('fa-IR')} تومان
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">هزینه ارسال:</span>
                                <span className="font-semibold">
                                    {shipping.toLocaleString('fa-IR')} تومان
                                </span>
                            </div>
                            <div className="border-t pt-4 flex justify-between text-lg">
                                <span className="font-bold">مجموع:</span>
                                <span className="font-bold text-primary">
                                    {total.toLocaleString('fa-IR')} تومان
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full bg-primary text-white text-center py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors mb-3"
                        >
                            ادامه فرآیند خرید
                        </Link>

                        <Link
                            href="/shop"
                            className="block w-full border border-gray-300 text-center py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                        >
                            بازگشت به فروشگاه
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
