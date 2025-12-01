'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCarousel from '@/components/carousel/ProductCarousel';
import ProductReviews from '@/components/product/ProductReviews';
import StickyAddToCart from '@/components/product/StickyAddToCart';
import SizeGuide from '@/components/product/SizeGuide';
import ImageMagnifier from '@/components/product/ImageMagnifier';
import { useProduct, useProducts } from '@/lib/hooks/useProducts';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';
import { Star, ShoppingCart, Heart, Share2, Truck, Minus, Plus, Check, Shield, RotateCcw, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: product, isLoading } = useProduct(slug);
  const { data: allProducts = [] } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAdding(true);
    addToCart(product, quantity);

    toast.success(`${quantity} عدد ${product.name} به سبد خرید اضافه شد`);

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">محصول یافت نشد</h2>
          <p className="text-gray-500 mb-6">محصول مورد نظر وجود ندارد</p>
          <Link
            href="/shop"
            className="h-12 px-6 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = allProducts.filter(
    p => p.category === product.category && p.id !== product.id
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'backpack': 'کوله پشتی',
      'backpacks': 'کوله پشتی',
      'laptop-bag': 'کیف لپ‌تاپ',
      'laptop-bags': 'کیف لپ‌تاپ',
      'school-bag': 'کیف مدرسه',
      'school-bags': 'کیف مدرسه',
    };
    return categories[category] || category;
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={[
          { label: 'فروشگاه', href: '/shop' },
          { label: getCategoryName(product.category), href: `/shop?category=${product.category}` },
          { label: product.name }
        ]} />

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
                <ImageMagnifier
                  src={product.images[selectedImage] || '/images/placeholder.jpg'}
                  alt={`${product.name} - تصویر ${selectedImage + 1}`}
                  magnifierSize={200}
                  zoomLevel={4}
                />
                {discount > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full z-20">
                    {toPersianNumbers(discount)}% تخفیف
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - تصویر ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-contain p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{toPersianNumbers(product.rating)}</span>
                  <span className="text-sm text-gray-400">({toPersianNumbers(product.reviewCount || 0)} نظر)</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                {product.originalPrice && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-gray-400 line-through">
                      {formatPricePersian(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-lg">
                      {toPersianNumbers(discount)}% تخفیف
                    </span>
                  </div>
                )}
                <div className="text-2xl lg:text-3xl font-bold text-primary">
                  {formatPricePersian(product.price)} <span className="text-base font-medium">تومان</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <Check className="w-4 h-4" />
                    موجود در انبار
                  </span>
                ) : (
                  <span className="text-sm text-red-500 font-medium">ناموجود</span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">توضیحات</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-900 mb-2 block">تعداد</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-medium text-gray-900">{toPersianNumbers(quantity)}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className="flex-1 h-12 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      در حال افزودن...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      افزودن به سبد خرید
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (inWishlist) {
                      removeFromWishlist(product.id);
                      toast.success('از علاقه‌مندی‌ها حذف شد');
                    } else {
                      addToWishlist(product);
                      toast.success('به علاقه‌مندی‌ها اضافه شد');
                    }
                  }}
                  className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center ${
                    inWishlist
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
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
                  className="w-12 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">ارسال سریع</p>
                    <p className="text-xs text-green-600">تحویل ۲ تا ۳ روز کاری</p>
                  </div>
                </div>
              </div>

              {/* Size Guide */}
              <div className="mb-6">
                <SizeGuide category={product.category} />
              </div>

              {/* Features */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">ویژگی‌های محصول</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>ضمانت اصالت</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-green-500" />
                    <span>ارسال سریع</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RotateCcw className="w-4 h-4 text-green-500" />
                    <span>۷ روز ضمانت بازگشت</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Headphones className="w-4 h-4 text-green-500" />
                    <span>پشتیبانی ۲۴ ساعته</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-8 mb-6">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-8">
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
