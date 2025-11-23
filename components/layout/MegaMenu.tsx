'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaChevronDown, FaTags, FaFire, FaStar } from 'react-icons/fa';
import categories from '@/data/categories.json';

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium py-2">
        <span>دسته‌بندی محصولات</span>
        <FaChevronDown
          className={`text-sm transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-screen max-w-6xl z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-center">
          <div className="grid grid-cols-12 gap-0">
            {/* Categories */}
            <div className="col-span-8 p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <FaTags className="text-primary" />
                  دسته‌بندی‌ها
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.slug}`}
                    className="group"
                  >
                    <div className="relative h-40 rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-shadow">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 right-0 left-0 p-4">
                        <h4 className="text-white font-bold text-lg mb-1">
                          {category.name}
                        </h4>
                        <p className="text-white/90 text-sm line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <Link
                    href="/shop?featured=true"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <FaStar className="text-yellow-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-secondary">محصولات ویژه</h5>
                      <p className="text-xs text-gray-500">پیشنهادهای ویژه</p>
                    </div>
                  </Link>

                  <Link
                    href="/shop?sort=popular"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <FaFire className="text-red-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-secondary">پرفروش‌ترین‌ها</h5>
                      <p className="text-xs text-gray-500">محبوب‌ترین محصولات</p>
                    </div>
                  </Link>

                  <Link
                    href="/shop?discount=true"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <FaTags className="text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-secondary">تخفیف‌دار</h5>
                      <p className="text-xs text-gray-500">محصولات با تخفیف</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-4 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-secondary mb-2">
                  چرا مایسا؟
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  بهترین کیفیت، بهترین قیمت، بهترین خدمات
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">
                      ضمانت اصالت کالا
                    </h4>
                    <p className="text-xs text-gray-600">
                      تمام محصولات 100% اصل و با ضمانت
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">
                      ارسال سریع
                    </h4>
                    <p className="text-xs text-gray-600">
                      ارسال به سراسر کشور در کمترین زمان
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">
                      7 روز ضمانت بازگشت
                    </h4>
                    <p className="text-xs text-gray-600">
                      امکان بازگشت کالا تا 7 روز
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">
                      پشتیبانی 24/7
                    </h4>
                    <p className="text-xs text-gray-600">
                      پاسخگویی در تمام ساعات شبانه‌روز
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-primary/20">
                <Link
                  href="/shop"
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                >
                  مشاهده همه محصولات
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
