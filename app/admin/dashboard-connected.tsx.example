// مثال: Dashboard متصل به Backend
// این فایل یک نمونه است - می‌تونی محتوای app/admin/page.tsx رو با این جایگزین کنی

'use client';

import { useState, useEffect } from 'react';
import { adminApi, DashboardStats } from '@/lib/api/admin';
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaStar,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      const errorMessage = err.message || 'خطا در دریافت آمار';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('خطا در دریافت آمار:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'کل محصولات',
      value: stats.totalProducts,
      icon: FaBox,
      color: 'bg-blue-500',
      change: '+12%',
      isPositive: true,
    },
    {
      title: 'کل سفارشات',
      value: stats.totalOrders,
      icon: FaShoppingCart,
      color: 'bg-green-500',
      change: '+8%',
      isPositive: true,
    },
    {
      title: 'کل کاربران',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-purple-500',
      change: '+15%',
      isPositive: true,
    },
    {
      title: 'کل نظرات',
      value: stats.totalReviews,
      icon: FaStar,
      color: 'bg-yellow-500',
      change: '-3%',
      isPositive: false,
    },
  ];

  const alertCards = [
    {
      title: 'سفارشات در انتظار',
      value: stats.pendingOrders,
      color: 'bg-orange-100 text-orange-800',
      link: '/admin/orders?status=pending',
    },
    {
      title: 'محصولات کم موجودی',
      value: stats.lowStockProducts,
      color: 'bg-red-100 text-red-800',
      link: '/admin/products?filter=low-stock',
    },
    {
      title: 'نظرات در انتظار تایید',
      value: stats.pendingReviews,
      color: 'bg-blue-100 text-blue-800',
      link: '/admin/reviews?status=pending',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">خوش آمدید به پنل مدیریت! 👋</h1>
        <p className="text-primary-light">
          خلاصه‌ای از وضعیت فروشگاه شما
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} text-white p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    card.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {card.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                  <span>{card.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-800">
                {card.value.toLocaleString('fa-IR')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          درآمد کل (ماه جاری)
        </h3>
        <p className="text-3xl font-bold text-primary">
          {stats.totalRevenue.toLocaleString('fa-IR')} تومان
        </p>
        <div className="mt-4 flex items-center gap-2 text-green-600">
          <FaArrowUp />
          <span className="text-sm">23% نسبت به ماه قبل</span>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alertCards.map((card, index) => (
          <a
            key={index}
            href={card.link}
            className={`${card.color} rounded-lg shadow p-6 hover:shadow-lg transition-shadow`}
          >
            <h3 className="text-sm font-medium mb-2">{card.title}</h3>
            <p className="text-3xl font-bold">{card.value.toLocaleString('fa-IR')}</p>
            <p className="text-xs mt-2 opacity-75">کلیک برای مشاهده</p>
          </a>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              آخرین سفارشات
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        {order.totalAmount.toLocaleString('fa-IR')} تومان
                      </p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  سفارشی وجود ندارد
                </p>
              )}
            </div>
            <a
              href="/admin/orders"
              className="block text-center text-primary hover:underline mt-4"
            >
              مشاهده همه سفارشات
            </a>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              محصولات کم موجودی
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.lowStockProductsList && stats.lowStockProductsList.length > 0 ? (
                stats.lowStockProductsList.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-left">
                      <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                        {item.stockQuantity} عدد
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  همه محصولات موجودی کافی دارند
                </p>
              )}
            </div>
            <a
              href="/admin/products?filter=low-stock"
              className="block text-center text-primary hover:underline mt-4"
            >
              مشاهده همه محصولات
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
