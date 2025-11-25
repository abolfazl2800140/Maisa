'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCarousel from '@/components/carousel/ProductCarousel';
import RecentlyViewed from '@/components/product/RecentlyViewed';
import categories from '@/data/categories.json';
import { FaTruck, FaShieldAlt, FaHeadset, FaUndo } from 'react-icons/fa';
import { useProducts, useFeaturedProducts } from '@/lib/hooks/useProducts';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';

export default function Home() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: featuredProducts = [], isLoading: featuredLoading } = useFeaturedProducts();
  const { items: recentlyViewed } = useRecentlyViewed();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src="/images/hero-bag.jpg"
          alt="فروشگاه کیف و کوله پشتی مایسا"
          fill
          className="object-cover object-top brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="text-white max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              فروشگاه کیف و کوله پشتی مایسا
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100 drop-shadow-lg">
              بهترین کیفیت، بهترین قیمت، بهترین انتخاب
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6">
              <FaTruck className="text-4xl text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">ارسال سریع</h3>
              <p className="text-sm text-gray-600">ارسال به سراسر کشور</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <FaShieldAlt className="text-4xl text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">ضمانت اصالت</h3>
              <p className="text-sm text-gray-600">محصولات 100% اصل</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <FaHeadset className="text-4xl text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">پشتیبانی 24/7</h3>
              <p className="text-sm text-gray-600">پاسخگویی در تمام ساعات</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <FaUndo className="text-4xl text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">ضمانت بازگشت</h3>
              <p className="text-sm text-gray-600">7 روز ضمانت بازگشت کالا</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
            دسته‌بندی محصولات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 right-0 left-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {featuredLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative w-10 h-10">
                <div className="absolute w-10 h-10 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <ProductCarousel
              products={featuredProducts}
              title="محصولات ویژه"
            />
          )}
        </div>
      </section>

      {/* All Products Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative w-10 h-10">
                <div className="absolute w-10 h-10 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <ProductCarousel
              products={products}
              title="جدیدترین محصولات"
            />
          )}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <RecentlyViewed products={recentlyViewed} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            عضویت در خبرنامه مایسا
          </h2>
          <p className="text-lg mb-8">
            از جدیدترین محصولات و تخفیف‌های ویژه باخبر شوید
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              className="flex-1 px-4 py-3 rounded-lg text-secondary focus:outline-none"
            />
            <button className="bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary-light transition-colors">
              عضویت
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
