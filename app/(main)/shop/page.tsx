'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/lib/hooks/useProducts';
import { Product } from '@/types';
import { FaFilter, FaTimes, FaTh, FaList, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

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
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [categoryParam, searchParam]);

  useEffect(() => {
    if (filterDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

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

  const sortOptions = [
    { value: 'newest', label: 'همه' },
    { value: 'price-low', label: 'ارزان‌ترین' },
    { value: 'price-high', label: 'گران‌ترین' },
    { value: 'popular', label: 'پرمخاطب‌ترین' },
    { value: 'rating', label: 'بیشترین امتیاز' },
  ];

  const categories = [
    { value: 'all', label: 'همه محصولات' },
    { value: 'backpacks', label: 'کوله پشتی' },
    { value: 'laptop-bags', label: 'کیف لپ‌تاپ' },
    { value: 'school-bags', label: 'کیف مدرسه' },
  ];


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-sm"></span>
            <h1 className="text-xl font-bold text-secondary">محصولات</h1>
          </div>
          <p className="text-gray-500 text-sm">{filteredProducts.length} محصول</p>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-6">
          {/* Sidebar Filters - Right Side */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24">
              {/* Search in sidebar */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو بین محصولات"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:bg-white transition-all text-sm"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-secondary">دسته بندی محصولات</span>
                  {categoryOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                </button>
                {categoryOpen && (
                  <div className="px-4 pb-4 space-y-2">
                    {categories.map((cat) => (
                      <label
                        key={cat.value}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedCategory === cat.value ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={selectedCategory === cat.value}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="accent-primary"
                        />
                        <span className="text-sm">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-semibold text-secondary mb-4">محدوده قیمت</h4>
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
                  <span>۰ تومان</span>
                  <span>{priceRange[1].toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>

              {/* Reset Filters */}
              {(selectedCategory !== 'all' || searchQuery || priceRange[1] < 10000000) && (
                <div className="p-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setPriceRange([0, 10000000]);
                      setSortBy('newest');
                    }}
                    className="w-full py-2.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    پاک کردن فیلترها
                  </button>
                </div>
              )}
            </div>
          </aside>


          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar - Top */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Sort Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  <span className="text-gray-500 text-sm ml-2 hidden sm:inline">مرتب سازی:</span>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${sortBy === option.value
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* View Mode & Mobile Filter */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterDrawerOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <FaFilter />
                    <span>فیلتر</span>
                  </button>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'
                        }`}
                      aria-label="نمایش شبکه‌ای"
                    >
                      <FaTh />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'
                        }`}
                      aria-label="نمایش لیستی"
                    >
                      <FaList />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600 text-lg mb-2">محصولی یافت نشد</p>
                <p className="text-gray-400 text-sm mb-6">
                  فیلترهای دیگری را امتحان کنید
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setPriceRange([0, 10000000]);
                  }}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Mobile Filter Drawer Overlay */}
      {filterDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={() => setFilterDrawerOpen(false)}
        />
      )}

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 lg:hidden overflow-y-auto ${filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-secondary">فیلترها</h2>
          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="text-gray-500 hover:text-primary transition-colors p-2"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بین محصولات"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-secondary mb-3">دسته بندی</h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selectedCategory === cat.value ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="category-mobile"
                    value={cat.value}
                    checked={selectedCategory === cat.value}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-semibold text-secondary mb-3">محدوده قیمت</h4>
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
              <span>۰ تومان</span>
              <span>{priceRange[1].toLocaleString('fa-IR')} تومان</span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 space-y-2">
          {(selectedCategory !== 'all' || searchQuery || priceRange[1] < 10000000) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceRange([0, 10000000]);
              }}
              className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm"
            >
              پاک کردن فیلترها
            </button>
          )}
          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium"
          >
            نمایش {filteredProducts.length} محصول
          </button>
        </div>
      </div>
    </>
  );
}
