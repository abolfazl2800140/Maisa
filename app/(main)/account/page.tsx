'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('maysa-user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('maysa-user');
    toast.success('با موفقیت خارج شدید', { icon: '👋' });
    router.push('/');
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

  if (!user) return null;

  const orders = [
    {
      id: '1001',
      date: '1403/08/15',
      total: 2550000,
      status: 'تحویل شده',
      items: 2
    },
    {
      id: '1002',
      date: '1403/08/20',
      total: 980000,
      status: 'در حال پردازش',
      items: 1
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-secondary">حساب کاربری</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center mb-6 pb-6 border-b">
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
              >
                <FaUser />
                <span>اطلاعات حساب</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
              >
                <FaShoppingBag />
                <span>سفارشات</span>
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'wishlist' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
              >
                <FaHeart />
                <span>علاقه‌مندی‌ها</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
              >
                <FaCog />
                <span>تنظیمات</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FaSignOutAlt />
                <span>خروج</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">اطلاعات حساب کاربری</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">نام و نام خانوادگی</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">ایمیل</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">شماره تماس</label>
                    <input
                      type="tel"
                      defaultValue={user.phone}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                  >
                    ذخیره تغییرات
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">سفارشات من</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">سفارش #{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'تحویل شده' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">{order.items} محصول</p>
                          <p className="font-bold text-primary">{order.total.toLocaleString('fa-IR')} تومان</p>
                        </div>
                        <button className="text-primary font-semibold hover:underline">
                          مشاهده جزئیات
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">علاقه‌مندی‌ها</h2>
                <p className="text-gray-500 text-center py-12">
                  برای مشاهده لیست علاقه‌مندی‌های خود به{' '}
                  <Link href="/wishlist" className="text-primary font-bold hover:underline">
                    صفحه علاقه‌مندی‌ها
                  </Link>{' '}
                  بروید
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">تنظیمات</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold mb-3">تغییر رمز عبور</h3>
                    <form className="space-y-3">
                      <input
                        type="password"
                        placeholder="رمز عبور فعلی"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="password"
                        placeholder="رمز عبور جدید"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="password"
                        placeholder="تکرار رمز عبور جدید"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                      >
                        تغییر رمز عبور
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
