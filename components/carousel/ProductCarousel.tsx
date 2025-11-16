'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-secondary">
          {title}
        </h2>
      )}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="product-carousel"
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
