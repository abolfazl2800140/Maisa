import Link from 'next/link';
import { FaHome, FaShoppingBag } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="max-w-2xl mx-auto">
                    {/* 404 Number */}
                    <h1 className="text-9xl font-bold text-primary mb-4">404</h1>

                    {/* Message */}
                    <h2 className="text-3xl font-bold text-secondary mb-4">
                        صفحه مورد نظر یافت نشد!
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <FaHome />
                            بازگشت به صفحه اصلی
                        </Link>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all duration-200"
                        >
                            <FaShoppingBag />
                            مشاهده فروشگاه
                        </Link>
                    </div>

                    {/* Popular Links */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-bold text-lg mb-4 text-secondary">لینک‌های پرکاربرد</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/shop" className="text-primary hover:underline">
                                فروشگاه
                            </Link>
                            <Link href="/blog" className="text-primary hover:underline">
                                بلاگ
                            </Link>
                            <Link href="/about" className="text-primary hover:underline">
                                درباره ما
                            </Link>
                            <Link href="/contact" className="text-primary hover:underline">
                                تماس با ما
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
