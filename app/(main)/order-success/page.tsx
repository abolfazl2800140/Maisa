'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const [orderData, setOrderData] = useState<any>(null);

    useEffect(() => {
        if (!orderId) {
            router.push('/');
            return;
        }

        const lastOrder = localStorage.getItem('last-order');
        if (lastOrder) {
            setOrderData(JSON.parse(lastOrder));
        }
    }, [orderId, router]);

    if (!orderData) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                        <FaCheckCircle className="text-5xl text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-secondary mb-2">
                        {orderData.paymentMethod === 'cod' ? 'سفارش شما ثبت شد!' : 'پرداخت موفق!'}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {orderData.paymentMethod === 'cod'
                            ? 'سفارش شما با موفقیت ثبت شد و به زودی ارسال خواهد شد'
                            : 'پرداخت شما با موفقیت انجام شد'}
                    </p>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <h2 className="text-xl font-bold mb-6 pb-4 border-b">جزئیات سفارش</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">شماره سفارش:</span>
                            <span className="font-bold">#{orderData.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">تاریخ ثبت:</span>
                            <span className="font-semibold">{orderData.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">تعداد محصولات:</span>
                            <span className="font-semibold">{orderData.items} عدد</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">روش پرداخت:</span>
                            <span className="font-semibold">
                                {orderData.paymentMethod === 'cod' ? 'پرداخت در محل' : 'پرداخت آنلاین'}
                            </span>
                        </div>
                        <div className="flex justify-between text-lg pt-4 border-t">
                            <span className="font-bold">مبلغ کل:</span>
                            <span className="font-bold text-primary">
                                {orderData.total.toLocaleString('fa-IR')} تومان
                            </span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-bold mb-3">مراحل بعدی:</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>✓ ایمیل تایید سفارش برای شما ارسال شد</li>
                        <li>✓ سفارش شما در حال آماده‌سازی است</li>
                        <li>✓ پس از ارسال، کد رهگیری برای شما پیامک می‌شود</li>
                        <li>✓ زمان تحویل: 1-4 روز کاری</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/shop"
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                    >
                        <FaShoppingBag />
                        ادامه خرید
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors"
                    >
                        <FaHome />
                        بازگشت به صفحه اصلی
                    </Link>
                </div>

                {/* Support */}
                <div className="text-center mt-8 text-gray-600">
                    <p>در صورت داشتن سوال با پشتیبانی تماس بگیرید:</p>
                    <p className="font-bold text-primary mt-2">021-12345678</p>
                </div>
            </div>
        </div>
    );
}
