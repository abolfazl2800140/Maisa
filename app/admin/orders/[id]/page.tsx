'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowRight, FaSave, FaPrint } from 'react-icons/fa';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderDetails {
    id: string;
    orderNumber: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    address: {
        fullName: string;
        phone: string;
        province: string;
        city: string;
        postalCode: string;
        addressLine: string;
    };
    items: Array<{
        id: string;
        productName: string;
        variantDetails: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    taxAmount: number;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: string;
    paymentMethod: string;
    trackingCode: string;
    notes: string;
    adminNotes: string;
    createdAt: string;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<OrderStatus>('pending');
    const [trackingCode, setTrackingCode] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [params.id]);

    const fetchOrderDetails = async () => {
        try {
            // TODO: داده‌های نمونه
            setTimeout(() => {
                const mockOrder: OrderDetails = {
                    id: params.id as string,
                    orderNumber: 'ORD-1001',
                    customer: {
                        name: 'علی احمدی',
                        email: 'ali@example.com',
                        phone: '09123456789',
                    },
                    address: {
                        fullName: 'علی احمدی',
                        phone: '09123456789',
                        province: 'تهران',
                        city: 'تهران',
                        postalCode: '1234567890',
                        addressLine: 'خیابان ولیعصر، پلاک 123',
                    },
                    items: [
                        {
                            id: '1',
                            productName: 'کوله پشتی لپ‌تاپ مدل X',
                            variantDetails: 'رنگ: مشکی، سایز: L',
                            quantity: 2,
                            unitPrice: 500000,
                            totalPrice: 1000000,
                        },
                        {
                            id: '2',
                            productName: 'کیف دستی چرمی',
                            variantDetails: 'رنگ: قهوه‌ای',
                            quantity: 1,
                            unitPrice: 750000,
                            totalPrice: 750000,
                        },
                    ],
                    subtotal: 1750000,
                    discountAmount: 175000,
                    shippingCost: 50000,
                    taxAmount: 0,
                    totalAmount: 1625000,
                    status: 'pending',
                    paymentStatus: 'paid',
                    paymentMethod: 'آنلاین',
                    trackingCode: '',
                    notes: 'لطفاً با دقت بسته‌بندی شود',
                    adminNotes: '',
                    createdAt: new Date().toISOString(),
                };
                setOrder(mockOrder);
                setStatus(mockOrder.status);
                setTrackingCode(mockOrder.trackingCode);
                setAdminNotes(mockOrder.adminNotes);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('خطا در دریافت جزئیات سفارش:', error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: API call
            console.log('Updating order:', { status, trackingCode, adminNotes });
            setTimeout(() => {
                alert('سفارش با موفقیت به‌روزرسانی شد');
                setSaving(false);
            }, 1000);
        } catch (error) {
            alert('خطا در به‌روزرسانی سفارش');
            setSaving(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">سفارش یافت نشد</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaArrowRight size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            جزئیات سفارش {order.orderNumber}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            ثبت شده در {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <FaPrint />
                    <span>چاپ</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">
                                آیتم‌های سفارش
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between py-4 border-b last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">
                                                {item.productName}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.variantDetails}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                تعداد: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-800">
                                                {item.totalPrice.toLocaleString('fa-IR')} تومان
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {item.unitPrice.toLocaleString('fa-IR')} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="mt-6 pt-6 border-t space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>جمع جزء:</span>
                                    <span>{order.subtotal.toLocaleString('fa-IR')} تومان</span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>تخفیف:</span>
                                        <span>-{order.discountAmount.toLocaleString('fa-IR')} تومان</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>هزینه ارسال:</span>
                                    <span>{order.shippingCost.toLocaleString('fa-IR')} تومان</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                                    <span>مبلغ کل:</span>
                                    <span>{order.totalAmount.toLocaleString('fa-IR')} تومان</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                اطلاعات مشتری
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="text-gray-600">نام:</span>{' '}
                                    <span className="font-medium">{order.customer.name}</span>
                                </p>
                                <p>
                                    <span className="text-gray-600">ایمیل:</span>{' '}
                                    <span className="font-medium">{order.customer.email}</span>
                                </p>
                                <p>
                                    <span className="text-gray-600">تلفن:</span>{' '}
                                    <span className="font-medium">{order.customer.phone}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                آدرس ارسال
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="font-medium">{order.address.fullName}</p>
                                <p className="text-gray-600">{order.address.phone}</p>
                                <p className="text-gray-600">
                                    {order.address.province}، {order.address.city}
                                </p>
                                <p className="text-gray-600">{order.address.addressLine}</p>
                                <p className="text-gray-600">
                                    کد پستی: {order.address.postalCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                یادداشت مشتری
                            </h3>
                            <p className="text-gray-600">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            وضعیت سفارش
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    وضعیت
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="pending">در انتظار</option>
                                    <option value="processing">در حال پردازش</option>
                                    <option value="shipped">ارسال شده</option>
                                    <option value="delivered">تحویل داده شده</option>
                                    <option value="cancelled">لغو شده</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    کد رهگیری
                                </label>
                                <input
                                    type="text"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="کد رهگیری پست"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    یادداشت ادمین
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="یادداشت داخلی..."
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                            >
                                <FaSave />
                                <span>{saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            اطلاعات پرداخت
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">روش پرداخت:</span>
                                <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">وضعیت:</span>
                                <span
                                    className={`px-2 py-1 rounded text-xs ${order.paymentStatus === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {order.paymentStatus === 'paid' ? 'پرداخت شده' : 'در انتظار'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
