'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaEye } from 'react-icons/fa';
import { adminApi, Order } from '@/lib/api/admin';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

interface OrderDisplay {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    itemsCount: number;
    createdAt: string;
}

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<OrderStatus, string> = {
    pending: 'در انتظار',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل داده شده',
    cancelled: 'لغو شده',
};

const paymentStatusColors: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
    pending: 'در انتظار',
    paid: 'پرداخت شده',
    failed: 'ناموفق',
    refunded: 'بازگشت داده شده',
};


export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminApi.getOrders();
            
            // تبدیل داده‌های API به فرمت نمایشی
            const displayOrders: OrderDisplay[] = (response.data || response as unknown as Order[]).map((order: Order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.user 
                    ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'بدون نام'
                    : 'بدون نام',
                customerEmail: order.user?.email || '-',
                totalAmount: Number(order.totalAmount),
                status: order.status as OrderStatus,
                paymentStatus: order.paymentStatus as PaymentStatus,
                itemsCount: order.items?.length || 0,
                createdAt: order.createdAt,
            }));
            
            setOrders(displayOrders);
        } catch (err: any) {
            console.error('خطا در دریافت سفارشات:', err);
            setError(err.message || 'خطا در دریافت سفارشات');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعت پیش`;
        return `${Math.floor(diffInMinutes / 1440)} روز پیش`;
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    تلاش مجدد
                </button>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">مدیریت سفارشات</h1>
                    <p className="text-gray-600 mt-1">{filteredOrders.length} سفارش</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(['all', 'pending', 'processing', 'shipped', 'delivered'] as const).map((status) => {
                    const count =
                        status === 'all'
                            ? orders.length
                            : orders.filter((o) => o.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`p-4 rounded-lg border-2 transition-all ${filterStatus === status
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <p className="text-2xl font-bold">{count}</p>
                            <p className="text-sm mt-1">
                                {status === 'all' ? 'همه' : statusLabels[status]}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="relative">
                    <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="جستجو بر اساس شماره سفارش، نام یا ایمیل مشتری..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    شماره سفارش
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    مشتری
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    تعداد آیتم
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    مبلغ کل
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    وضعیت سفارش
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    وضعیت پرداخت
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    زمان ثبت
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{order.orderNumber}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{order.customerName}</p>
                                            <p className="text-sm text-gray-600">{order.customerEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {order.itemsCount} آیتم
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-800">
                                            {order.totalAmount.toLocaleString('fa-IR')} تومان
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 text-sm rounded-full ${statusColors[order.status]}`}
                                        >
                                            {statusLabels[order.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 text-sm rounded-full ${paymentStatusColors[order.paymentStatus]}`}
                                        >
                                            {paymentStatusLabels[order.paymentStatus]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {getRelativeTime(order.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary hover:text-white rounded transition-colors"
                                        >
                                            <FaEye />
                                            <span>جزئیات</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">سفارشی یافت نشد</p>
                    </div>
                )}
            </div>
        </div>
    );
}
