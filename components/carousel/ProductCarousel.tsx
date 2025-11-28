'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  variant?: 'default' | 'light';
}

export default function ProductCarousel({ products, title, variant = 'default' }: ProductCarouselProps) {
  const uniqueId = `carousel-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full relative">
      {title && (
        <h2 className={`text-xl md:text-2xl font-bold mb-4 ${variant === 'light' ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
      )}

      <div className="relative group">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={12}
          slidesPerView={2}
          navigation={{
            prevEl: `.${uniqueId}-prev`,
            nextEl: `.${uniqueId}-next`,
          }}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 12 },
            640: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 16 },
          }}
          className="!overflow-visible"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} compact />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <button className={`${uniqueId}-prev absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -mr-2 hover:bg-gray-50`}>
          <FaChevronRight className="text-gray-600" />
        </button>
        <button className={`${uniqueId}-next absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -ml-2 hover:bg-gray-50`}>
          <FaChevronLeft className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
