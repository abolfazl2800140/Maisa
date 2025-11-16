'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCheckCircle, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { useCart } from '@/lib/context/CartContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'online'
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && items.length === 0) {
      toast.error('سبد خرید شما خالی است');
      router.push('/cart');
    }
  }, [items, router, isMounted]);

  const shipping = totalPrice > 2000000 ? 0 : 50000;
  const total = totalPrice + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate shipping info
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city) {
        toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
        return;
      }
      setStep(2);
    } else {
      // Process payment
      handlePayment();
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment gateway
    setTimeout(() => {
      if (formData.paymentMethod === 'online') {
        // Simulate redirect to payment gateway
        toast.success('در حال انتقال به درگاه پرداخت...', { icon: '💳' });

        setTimeout(() => {
          // Simulate successful payment
          const orderId = Math.floor(Math.random() * 10000) + 1000;
          localStorage.setItem('last-order', JSON.stringify({
            orderId,
            date: new Date().toLocaleDateString('fa-IR'),
            total,
            items: items.length
          }));

          clearCart();
          toast.success('پرداخت با موفقیت انجام شد', { icon: '✅' });
          router.push(`/order-success?orderId=${orderId}`);
        }, 2000);
      } else {
        // COD - Cash on Delivery
        const orderId = Math.floor(Math.random() * 10000) + 1000;
        localStorage.setItem('last-order', JSON.stringify({
          orderId,
          date: new Date().toLocaleDateString('fa-IR'),
          total,
          items: items.length,
          paymentMethod: 'cod'
        }));

        clearCart();
        toast.success('سفارش شما با موفقیت ثبت شد', { icon: '✅' });
        router.push(`/order-success?orderId=${orderId}`);
      }
    }, 1500);
  };

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
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-secondary">تکمیل خرید</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300'}`}>
            {step > 1 ? <FaCheckCircle /> : '1'}
          </div>
          <span className="mr-2 font-semibold">اطلاعات ارسال</span>
        </div>
        <div className={`w-24 h-1 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`} />
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300'}`}>
            2
          </div>
          <span className="mr-2 font-semibold">پرداخت</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {step === 1 ? (
              <>
                <h2 className="text-xl font-bold mb-6">اطلاعات ارسال</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">نام *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">نام خانوادگی *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">ایمیل</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">شماره تماس *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="09123456789"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">آدرس کامل *</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary h-24 resize-none"
                    placeholder="آدرس کامل خود را وارد کنید"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">شهر *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="نام شهر"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">کد پستی</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="کد پستی 10 رقمی"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                >
                  ادامه به پرداخت
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-6">روش پرداخت</h2>

                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-5 h-5"
                    />
                    <FaCreditCard className="text-2xl text-primary" />
                    <div className="flex-1">
                      <h3 className="font-bold">پرداخت آنلاین</h3>
                      <p className="text-sm text-gray-600">پرداخت امن از طریق درگاه بانکی</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-5 h-5"
                    />
                    <FaMoneyBillWave className="text-2xl text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-bold">پرداخت در محل</h3>
                      <p className="text-sm text-gray-600">پرداخت هنگام تحویل کالا</p>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'online' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>توجه:</strong> پس از کلیک روی دکمه پرداخت، به درگاه بانکی منتقل خواهید شد.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        در حال پردازش...
                      </>
                    ) : (
                      formData.paymentMethod === 'online' ? 'پرداخت آنلاین' : 'ثبت سفارش'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 pb-3 border-b">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-1">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">تعداد: {item.quantity}</p>
                    <p className="text-sm font-bold text-primary">
                      {(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4 pt-4 border-t">
              <div className="flex justify-between">
                <span>جمع کل:</span>
                <span className="font-semibold">{totalPrice.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between">
                <span>هزینه ارسال:</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-600">رایگان</span>
                  ) : (
                    `${shipping.toLocaleString('fa-IR')} تومان`
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold pt-4 border-t">
              <span>مجموع:</span>
              <span className="text-primary">{total.toLocaleString('fa-IR')} تومان</span>
            </div>

            {totalPrice < 2000000 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                با خرید {(2000000 - totalPrice).toLocaleString('fa-IR')} تومان دیگر، ارسال رایگان!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
