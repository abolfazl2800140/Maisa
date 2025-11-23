'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/lib/hooks/useProducts';
import { Product } from '@/types';
import { FaFilter, FaTimes, FaTh, FaList } from 'react-icons/fa';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [categoryParam, searchParam]);

  // Prevent body scroll when filter drawer is open
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

  const FilterContent = () => (
    <>
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
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0</span>
            <span>{priceRange[1].toLocaleString('fa-IR')} تومان</span>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
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
            setFilterDrawerOpen(false);
          }}
          className="w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          پاک کردن فیلترها
        </button>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-secondary">فروشگاه</h1>
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
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'فروشگاه' }]} />
        <h1 className="text-3xl font-bold mb-6 text-secondary">فروشگاه</h1>

        {/* Mobile Filter Button & View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FaFilter />
            <span>فیلترها</span>
            {(selectedCategory !== 'all' || searchQuery || priceRange[1] < 2000000) && (
              <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                !
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="نمایش شبکه‌ای"
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="نمایش لیستی"
            >
              <FaList />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg mb-4">محصولی یافت نشد</p>
                <p className="text-gray-400 text-sm mb-6">
                  متأسفانه محصولی با این مشخصات پیدا نشد. لطفاً فیلترهای دیگری را امتحان کنید.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setPriceRange([0, 2000000]);
                  }}
                  className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 lg:hidden overflow-y-auto ${
          filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-secondary">فیلترها</h2>
          <button 
            onClick={() => setFilterDrawerOpen(false)}
            className="text-gray-600 hover:text-primary transition-colors"
            aria-label="بستن فیلترها"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <div className="p-4">
          <FilterContent />
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            نمایش {filteredProducts.length} محصول
          </button>
        </div>
      </div>
    </>
  );
}
