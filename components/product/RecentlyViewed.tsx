'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { FaClock } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

interface RecentlyViewedProps {
  products: Product[];
}

export default function RecentlyViewed({ products }: RecentlyViewedProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
          <FaClock className="text-white text-lg" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-secondary">
            محصولات اخیراً مشاهده شده
          </h2>
          <p className="text-sm text-gray-600">
            بازگشت به محصولاتی که دیده‌اید
          </p>
        </div>
      </div>

      {/* Products Carousel */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
        className="recently-viewed-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
