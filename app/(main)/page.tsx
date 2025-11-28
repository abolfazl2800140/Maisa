'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ProductCarousel from '@/components/carousel/ProductCarousel';
import RecentlyViewed from '@/components/product/RecentlyViewed';
import categories from '@/data/categories.json';
import { FaTruck, FaShieldAlt, FaChevronLeft, FaChevronRight, FaFire, FaClock } from 'react-icons/fa';
import { useProducts, useFeaturedProducts } from '@/lib/hooks/useProducts';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';

const bannerSlides = [
  {
    id: 1,
    image: '/images/hero-bag.jpg',
    title: 'فروش ویژه کوله‌پشتی',
    subtitle: 'تا ۴۰٪ تخفیف',
    link: '/shop?category=backpacks',
    color: 'from-red-600 to-red-800',
  },
  {
    id: 2,
    image: '/images/categories/laptop-bags.jpg',
    title: 'کیف‌های لپ‌تاپ',
    subtitle: 'محافظت حرفه‌ای',
    link: '/shop?category=laptop-bags',
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 3,
    image: '/images/categories/school-bags.jpg',
    title: 'کیف مدرسه',
    subtitle: 'آماده بازگشایی مدارس',
    link: '/shop?category=school-bags',
    color: 'from-green-600 to-green-800',
  },
];

export default function Home() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: featuredProducts = [], isLoading: featuredLoading } = useFeaturedProducts();
  const { items: recentlyViewed } = useRecentlyViewed();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Slider */}
      <section className="relative">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Slider */}
            <div className="lg:col-span-2 relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
              {bannerSlides.map((slide, index) => (
                <Link
                  key={slide.id}
                  href={slide.link}
                  className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-l ${slide.color} opacity-60`} />
                  <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{slide.title}</h2>
                    <p className="text-xl md:text-2xl drop-shadow-md">{slide.subtitle}</p>
                  </div>
                </Link>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
              >
                <FaChevronRight className="text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
              >
                <FaChevronLeft className="text-gray-700" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Side Banners */}
            <div className="hidden lg:flex flex-col gap-4">
              <Link href="/shop?category=backpacks" className="relative h-[192px] rounded-2xl overflow-hidden group bg-gradient-to-br from-blue-600 to-blue-800">
                <div className="absolute inset-0 flex items-center p-5">
                  <div className="text-white">
                    <p className="text-xl font-bold mb-1">کوله‌پشتی‌های جدید</p>
                    <p className="text-sm opacity-80">مشاهده همه محصولات</p>
                  </div>
                </div>
              </Link>
              <Link href="/shop" className="relative h-[192px] rounded-2xl overflow-hidden group bg-gradient-to-br from-primary to-red-700 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <FaFire className="text-4xl mx-auto mb-2" />
                  <p className="text-xl font-bold">پیشنهاد ویژه</p>
                  <p className="text-sm opacity-80">تا ۵۰٪ تخفیف</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Category Icons - Digikala Style */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          {/* Mobile: scrollable, Desktop: flex row */}
          <div className="flex items-center justify-start md:justify-center overflow-x-auto md:overflow-visible gap-6 md:gap-12 pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="flex flex-col items-center min-w-[80px] md:min-w-0 group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-primary transition-colors mb-2">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs md:text-sm text-gray-700 text-center font-medium group-hover:text-primary transition-colors whitespace-nowrap">
                  {category.name}
                </span>
              </Link>
            ))}
            <Link
              href="/shop"
              className="flex flex-col items-center min-w-[80px] md:min-w-0 group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-2">
                <span className="text-2xl text-gray-400 group-hover:text-primary">+</span>
              </div>
              <span className="text-xs md:text-sm text-gray-700 text-center font-medium group-hover:text-primary transition-colors whitespace-nowrap">
                همه محصولات
              </span>
            </Link>
          </div>
        </div>
      </section>



      {/* Amazing Offers - Like Digikala */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-l from-red-600 to-red-500 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-lg p-2">
                  <FaFire className="text-red-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-white text-lg md:text-xl font-bold">پیشنهاد شگفت‌انگیز</h2>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <FaClock />
                    <span>فقط امروز</span>
                  </div>
                </div>
              </div>
              <Link href="/shop" className="text-white text-sm hover:underline hidden md:block">
                مشاهده همه
              </Link>
            </div>

            {featuredLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <ProductCarousel products={featuredProducts} variant="light" />
            )}
          </div>
        </div>
      </section>


      {/* Category Banners */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-gray-200 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">جدیدترین محصولات</h2>
            <Link href="/shop" className="text-primary text-sm hover:underline flex items-center gap-1">
              مشاهده همه
              <FaChevronLeft size={12} />
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <ProductCarousel products={products} />
          )}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden bg-gradient-to-l from-blue-600 to-blue-800">
              <div className="absolute inset-0 flex items-center justify-between p-6">
                <div className="text-white">
                  <p className="text-sm opacity-80 mb-1">ارسال رایگان</p>
                  <h3 className="text-2xl font-bold mb-2">خرید بالای ۵۰۰ هزار تومان</h3>
                  <Link href="/shop" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                    خرید کنید
                  </Link>
                </div>
                <FaTruck className="text-white/20 text-8xl" />
              </div>
            </div>
            <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden bg-gradient-to-l from-green-600 to-green-800">
              <div className="absolute inset-0 flex items-center justify-between p-6">
                <div className="text-white">
                  <p className="text-sm opacity-80 mb-1">ضمانت بازگشت</p>
                  <h3 className="text-2xl font-bold mb-2">۷ روز بدون قید و شرط</h3>
                  <Link href="/shop" className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                    اطلاعات بیشتر
                  </Link>
                </div>
                <FaShieldAlt className="text-white/20 text-8xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <RecentlyViewed products={recentlyViewed} />
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-10 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-2">عضویت در خبرنامه</h2>
            <p className="text-gray-400 mb-6">از تخفیف‌ها و محصولات جدید باخبر شوید</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                عضویت
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
