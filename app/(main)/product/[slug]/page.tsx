'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import ProductCarousel from '@/components/carousel/ProductCarousel';
import ProductReviews from '@/components/product/ProductReviews';
import StickyAddToCart from '@/components/product/StickyAddToCart';
import SizeGuide from '@/components/product/SizeGuide';
import { useProduct, useProducts } from '@/lib/hooks/useProducts';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaSearchPlus, FaTruck, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: product, isLoading } = useProduct(slug);
  const { data: allProducts = [] } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = product ? isInWishlist(product.id) : false;

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Add to recently viewed when product loads
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAdding(true);
    addToCart(product, quantity);

    toast.success(
      `${quantity} عدد ${product.name} به سبد خرید اضافه شد`,
      {
        icon: '🛒',
        duration: 3000,
      }
    );

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">محصول یافت نشد</h1>
        <a href="/shop" className="text-primary hover:underline">
          بازگشت به فروشگاه
        </a>
      </div>
    );
  }

  const relatedProducts = allProducts.filter(
    p => p.category === product.category && p.id !== product.id
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 pt-6 pb-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'فروشگاه', href: '/shop' },
            { label: product.name }
          ]} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            {/* Main Image Carousel */}
            <div className="relative group">
              <Swiper
                modules={[Navigation, Thumbs, Zoom]}
                navigation
                zoom={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="rounded-lg overflow-hidden mb-4"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-zoom-container">
                      <div className="relative aspect-square">
                        <Image
                          src={image}
                          alt={`${product.name} - تصویر ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaSearchPlus className="text-primary" />
                  <span>برای بزرگنمایی کلیک کنید</span>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                className="thumbs-swiper"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                      <Image
                        src={image}
                        alt={`${product.name} - بندانگشتی ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-gray-600 mr-2">{product.rating}</span>
                </div>
                <span className="text-gray-500">({product.reviewCount} نظر)</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {product.originalPrice && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    {discount}% تخفیف
                  </span>
                </div>
              )}
              <div className="text-4xl font-bold text-primary">
                {product.price.toLocaleString('fa-IR')} تومان
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="text-green-600 font-semibold">✓ موجود در انبار</span>
              ) : (
                <span className="text-red-600 font-semibold">ناموجود</span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">توضیحات محصول</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="font-semibold mb-2 block">تعداد:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    در حال افزودن...
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    افزودن به سبد خرید
                  </>
                )}
              </button>
              <button
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-12 h-12 rounded-lg transition-all flex items-center justify-center ${inWishlist
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                title={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              >
                <FaHeart className={inWishlist ? 'text-white' : 'text-gray-600'} />
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('لینک محصول کپی شد');
                  }
                }}
                className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                title="اشتراک‌گذاری"
              >
                <FaShare className="text-gray-600" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaTruck className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-2">ارسال سریع</h3>
                  <p className="text-sm text-green-800 mb-2">
                    تحویل 2-3 روز کاری در تهران و کرج
                  </p>
                  <p className="text-xs text-green-700">
                    ارسال به سراسر کشور: 3-7 روز کاری
                  </p>
                </div>
              </div>
            </div>

            {/* Size Guide */}
            <div className="mb-6">
              <SizeGuide category={product.category} />
            </div>

            {/* Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3">ویژگی‌های محصول</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>ضمانت اصالت کالا</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>ارسال سریع به سراسر کشور</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>7 روز ضمانت بازگشت</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>پشتیبانی 24 ساعته</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} productName={product.name} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <ProductCarousel
              products={relatedProducts}
              title="محصولات مرتبط"
            />
          </div>
        )}
      </div>

      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart product={product} />
    </div>
  );
}
