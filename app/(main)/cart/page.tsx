'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaShoppingBag, FaLightbulb, FaTruck } from 'react-icons/fa';
import { useCart } from '@/lib/context/CartContext';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';
import RelatedProducts from '@/components/product/RelatedProducts';
import { useProducts } from '@/lib/hooks/useProducts';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
    const [isMounted, setIsMounted] = useState(false);
    const { data: allProducts = [] } = useProducts();

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
            <Breadcrumb items={[{ label: 'سبد خرید' }]} />
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
                                        {formatPricePersian(item.product.price)} تومان
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
                                                {toPersianNumbers(item.quantity)}
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
                                        {formatPricePersian(item.product.price * item.quantity)} تومان
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

                        {/* Discount Code */}
                        <div className="mb-6 pb-6 border-b">
                            <h3 className="font-semibold mb-3 text-sm">کد تخفیف</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="کد تخفیف خود را وارد کنید"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                                />
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm whitespace-nowrap">
                                    اعمال
                                </button>
                            </div>
                            <div className="flex items-start gap-2 mt-2">
                                <FaLightbulb className="text-yellow-500 text-sm flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-500">
                                    کد تخفیف WELCOME10 برای 10% تخفیف
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">جمع کل:</span>
                                <span className="font-semibold">
                                    {formatPricePersian(totalPrice)} تومان
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">هزینه ارسال:</span>
                                <span className="font-semibold">
                                    {formatPricePersian(shipping)} تومان
                                </span>
                            </div>
                            <div className="border-t pt-4 flex justify-between text-lg">
                                <span className="font-bold">مجموع:</span>
                                <span className="font-bold text-primary">
                                    {formatPricePersian(total)} تومان
                                </span>
                            </div>
                        </div>

                        {/* Estimated Delivery */}
                        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FaTruck className="text-white text-sm" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-green-800">تحویل سریع</p>
                                    <p className="text-xs text-green-700">ارسال 2-3 روز کاری</p>
                                </div>
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

            {/* Related Products */}
            {items.length > 0 && (
                <div className="mt-12">
                    <RelatedProducts
                        products={getRelatedProducts()}
                        title="محصولات پیشنهادی"
                        subtitle="با خرید این محصولات، سبد خرید خود را کامل کنید"
                    />
                </div>
            )}
        </div>
    );

    // Helper function to get related products
    function getRelatedProducts() {
        if (!allProducts.length || !items.length) return [];

        // Get categories of items in cart
        const cartCategories = items.map(item => item.product.category);
        
        // Find products from same categories that are not in cart
        const cartProductIds = items.map(item => item.product.id);
        const related = allProducts.filter(
            product => 
                cartCategories.includes(product.category) && 
                !cartProductIds.includes(product.id) &&
                product.inStock
        );

        // Return up to 8 products
        return related.slice(0, 8);
    }
}
