'use client';

import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';
import ProductCarousel from '@/components/carousel/ProductCarousel';

export default function RecentlyViewedSection() {
  const { items } = useRecentlyViewed();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ProductCarousel
        products={items}
        title="محصولات اخیراً مشاهده شده"
        subtitle="محصولاتی که اخیراً دیده‌اید"
      />
    </div>
  );
}
