'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { Lightbulb, Sparkles } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 lg:p-6 border border-blue-100">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {title}
          </h2>
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
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
              slidesPerView: 3,
            },
            1024: {
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
      <div className="mt-6 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p>
            با خرید این محصولات، از <span className="font-medium text-primary">تخفیف ویژه</span> و 
            <span className="font-medium text-green-600"> ارسال رایگان</span> بهره‌مند شوید!
          </p>
        </div>
      </div>
    </div>
  );
}
