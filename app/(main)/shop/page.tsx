'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/lib/hooks/useProducts';
import { Product } from '@/types';
import { FaFilter } from 'react-icons/fa';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const { data: allProducts = [], isLoading } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [categoryParam, searchParam]);

  useEffect(() => {
    if (!allProducts.length) return;

    let result = [...allProducts];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [allProducts, selectedCategory, sortBy, priceRange, searchQuery]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری محصولات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-secondary">فروشگاه</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaFilter className="text-primary" />
              فیلترها
            </h3>

            {/* Search */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">جستجو</h4>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی محصول..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">دسته‌بندی</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-primary"
                  />
                  <span>همه محصولات</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="backpack"
                    checked={selectedCategory === 'backpack'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-primary"
                  />
                  <span>کوله پشتی</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="laptop-bag"
                    checked={selectedCategory === 'laptop-bag'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-primary"
                  />
                  <span>کیف لپ‌تاپ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="school-bag"
                    checked={selectedCategory === 'school-bag'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-primary"
                  />
                  <span>کیف مدرسه</span>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">محدوده قیمت</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0</span>
                  <span>{priceRange[1].toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="font-semibold mb-3">مرتب‌سازی</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="newest">جدیدترین</option>
                <option value="popular">محبوب‌ترین</option>
                <option value="rating">بیشترین امتیاز</option>
                <option value="price-low">ارزان‌ترین</option>
                <option value="price-high">گران‌ترین</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== 'all' || searchQuery || priceRange[1] < 2000000) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceRange([0, 2000000]);
                  setSortBy('newest');
                }}
                className="w-full mt-4 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              {filteredProducts.length} محصول یافت شد
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-500">
                نتایج جستجو برای: <span className="font-semibold">{searchQuery}</span>
              </p>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg mb-4">محصولی یافت نشد</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceRange([0, 2000000]);
                }}
                className="text-primary hover:underline"
              >
                پاک کردن فیلترها
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
