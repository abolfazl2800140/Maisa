'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/lib/hooks/useProducts';
import { Product } from '@/types';
import { Search, SlidersHorizontal, X, LayoutGrid, List, ChevronDown, ChevronUp, Package } from 'lucide-react';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { toPersianNumbers, formatPricePersian } from '@/lib/utils/persianNumbers';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const { data: allProducts = [], isLoading } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryOpen, setCategoryOpen] = useState(true);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  useEffect(() => {
    if (filterDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [filterDrawerOpen]);

  useEffect(() => {
    if (!allProducts.length) return;

    let result = [...allProducts];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'popular': result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }

    setFilteredProducts(result);
  }, [allProducts, selectedCategory, sortBy, priceRange, searchQuery]);

  const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'price-low', label: 'ارزان‌ترین' },
    { value: 'price-high', label: 'گران‌ترین' },
    { value: 'popular', label: 'پرفروش‌ترین' },
    { value: 'rating', label: 'بالاترین امتیاز' },
  ];

  const categories = [
    { value: 'all', label: 'همه محصولات' },
    { value: 'backpacks', label: 'کوله پشتی' },
    { value: 'laptop-bags', label: 'کیف لپ‌تاپ' },
    { value: 'school-bags', label: 'کیف مدرسه' },
  ];

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 10000000]);
    setSortBy('newest');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || priceRange[1] < 10000000;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} type="product" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">فروشگاه</h1>
          <span className="text-sm text-gray-500">
            {toPersianNumbers(filteredProducts.length)} محصول
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 sticky top-24">
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو..."
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">دسته‌بندی</span>
                  {categoryOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {categoryOpen && (
                  <div className="px-4 pb-4 space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.value
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">محدوده قیمت</h4>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="500000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>۰</span>
                  <span>{formatPricePersian(priceRange[1])} تومان</span>
                </div>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <div className="p-4">
                  <button
                    onClick={resetFilters}
                    className="w-full h-10 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    پاک کردن فیلترها
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-6">
              <div className="flex items-center justify-between gap-3">
                {/* Sort Options */}
                <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        sortBy === option.value
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* View Mode & Filter Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterDrawerOpen(true)}
                    className="lg:hidden flex items-center gap-2 h-10 px-3 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>فیلتر</span>
                  </button>
                  <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-900 font-medium mb-1">محصولی یافت نشد</p>
                <p className="text-gray-500 text-sm mb-6">فیلترهای دیگری را امتحان کنید</p>
                <button
                  onClick={resetFilters}
                  className="h-10 px-6 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setFilterDrawerOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 lg:hidden ${
        filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-semibold text-gray-900">فیلترها</span>
          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">دسته‌بندی</h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">محدوده قیمت</h4>
            <input
              type="range"
              min="0"
              max="10000000"
              step="500000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>۰</span>
              <span>{formatPricePersian(priceRange[1])} تومان</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 space-y-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full h-10 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              پاک کردن فیلترها
            </button>
          )}
          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="w-full h-12 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            نمایش {toPersianNumbers(filteredProducts.length)} محصول
          </button>
        </div>
      </div>
    </>
  );
}
