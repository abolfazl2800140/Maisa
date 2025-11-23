'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBox, FaTruck, FaCheck, FaTimes } from 'react-icons/fa';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('maysa-orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const getStatusInfo = (status: Order['status']) => {
    const statusMap = {
      pending: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-800', icon: FaBox },
      processing: { label: 'در حال پردازش', color: 'bg-blue-100 text-blue-800', icon: FaBox },
      shipped: { label: 'ارسال شده', color: 'bg-purple-100 text-purple-800', icon: FaTruck },
      delivered: { label: 'تحویل داده شده', color: 'bg-green-100 text-green-800', icon: FaCheck },
      cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800', icon: FaTimes },
    };
    return statusMap[status];
  };

  if (isLoading) {
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
      <Breadcrumb
        items={[
          { label: 'حساب کاربری', href: '/account' },
          { label: 'سفارشات من' },
        ]}
      />

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-secondary mb-6">سفارشات من</h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={<FaBox className="text-6xl text-gray-400" />}
            title="سفارشی ثبت نشده است"
            description="هنوز سفارشی ثبت نکرده‌اید"
            actionLabel="مشاهده محصولات"
            actionHref="/shop"
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">شماره سفارش</p>
                      <p className="font-bold text-lg">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">تاریخ ثبت</p>
                      <p className="font-semibold">{new Date(order.date).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${statusInfo.color}`}>
                        <StatusIcon />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-secondary">{item.name}</h3>
                          <p className="text-sm text-gray-600">تعداد: {item.quantity}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-primary">
                            {item.price.toLocaleString('fa-IR')} تومان
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">مبلغ کل</p>
                      <p className="text-2xl font-bold text-primary">
                        {order.total.toLocaleString('fa-IR')} تومان
                      </p>
                    </div>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      جزئیات سفارش
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
