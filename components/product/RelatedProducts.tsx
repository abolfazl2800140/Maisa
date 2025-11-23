'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { FaLightbulb } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function RelatedProducts({ 
  products, 
  title = "محصولات پیشنهادی",
  subtitle = "شاید این محصولات هم مورد علاقه شما باشد"
}: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <FaLightbulb className="text-white text-xl" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-secondary mb-2">
            {title}
          </h2>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="related-products-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="text-blue-600 font-bold">💡</span>
          <p>
            با خرید این محصولات، از <span className="font-bold text-primary">تخفیف ویژه</span> و 
            <span className="font-bold text-green-600"> ارسال رایگان</span> بهره‌مند شوید!
          </p>
        </div>
      </div>
    </div>
  );
}
