'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaHeart, FaTimes, FaExchangeAlt, FaSignOutAlt, FaUserCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useComparison } from '@/lib/context/ComparisonContext';
import { useAuth } from '@/lib/context/AuthContext';
import MegaMenu from './MegaMenu';
import AuthModal from '@/components/auth/AuthModal';
import toast from 'react-hot-toast';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { items: comparisonItems } = useComparison();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          setSearchFocused(true);
        }
      }
      // ESC to close search
      if (e.key === 'Escape') {
        setSearchFocused(false);
        setMobileSearchOpen(false);
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileSearchOpen(false);
      setSearchFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success('با موفقیت خارج شدید');
    router.push('/');
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.svg"
                  alt="Maysa Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="جستجوی محصولات..."
                  className="w-full px-4 py-2.5 pr-10 pl-20 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-all hover:scale-110"
                >
                  <FaSearch />
                </button>

                {/* Clear Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all hover:scale-110"
                    aria-label="پاک کردن جستجو"
                  >
                    <FaTimes />
                  </button>
                )}

                {/* Keyboard Shortcut Hint */}
                {!searchFocused && !searchQuery && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-xs text-gray-400 pointer-events-none">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">K</kbd>
                  </div>
                )}
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden text-secondary hover:text-primary transition-colors"
                aria-label="جستجو"
              >
                <FaSearch className="text-xl" />
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden sm:block relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                      aria-label="منوی کاربری"
                    >
                      <FaUserCircle className="text-2xl" />
                      <span className="text-sm font-semibold hidden lg:block">{user?.name}</span>
                    </button>

                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-scale-in">
                          {/* User Info Header */}
                          <div className="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <FaUserCircle className="text-3xl" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold truncate">{user?.name}</p>
                                <p className="text-xs text-white/80 truncate">{user?.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Quick Links */}
                          <div className="py-2">
                            {(user?.role === 'admin' || user?.role === 'super_admin') && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all group mx-2 rounded-lg mb-2"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <FaUserCircle className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">پنل مدیریت</span>
                              </Link>
                            )}
                            <Link
                              href="/account"
                              className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-primary/5 transition-all group"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <FaUser className="text-primary group-hover:scale-110 transition-transform" />
                              <span className="font-medium">حساب کاربری</span>
                            </Link>
                            <Link
                              href="/account/orders"
                              className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-primary/5 transition-all group"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <FaShoppingCart className="text-primary group-hover:scale-110 transition-transform" />
                              <span className="font-medium">سفارشات من</span>
                            </Link>
                            <Link
                              href="/wishlist"
                              className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-primary/5 transition-all group"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <FaHeart className="text-red-500 group-hover:scale-110 transition-transform" />
                              <div className="flex-1 flex items-center justify-between">
                                <span className="font-medium">علاقه‌مندی‌ها</span>
                                {wishlistItems > 0 && (
                                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                                    {wishlistItems}
                                  </span>
                                )}
                              </div>
                            </Link>
                            <Link
                              href="/account/addresses"
                              className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-primary/5 transition-all group"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <FaMapMarkerAlt className="text-primary group-hover:scale-110 transition-transform" />
                              <span className="font-medium">آدرس‌ها</span>
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="border-t">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all group"
                            >
                              <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                              <span className="font-medium">خروج از حساب</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <button 
                    onClick={() => setAuthModalOpen(true)}
                    className="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-all font-semibold" 
                    aria-label="ورود"
                  >
                    <FaUser className="text-lg" />
                    <span>ورود | ثبت نام</span>
                  </button>
                )}
              </div>
              <Link
                href="/comparison"
                className="hidden sm:block relative text-secondary hover:text-primary transition-all group p-2 rounded-lg hover:bg-primary/5"
                aria-label="مقایسه محصولات"
              >
                <FaExchangeAlt className="text-xl group-hover:scale-110 group-hover:rotate-12 transition-all" />
                {comparisonItems.length > 0 && (
                  <span className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {comparisonItems.length}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                className="relative text-secondary hover:text-primary transition-all group p-2 rounded-lg hover:bg-red-50"
                aria-label="علاقه‌مندی‌ها"
              >
                <FaHeart className="text-xl group-hover:scale-110 group-hover:text-red-500 transition-all" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {wishlistItems}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="relative text-secondary hover:text-primary transition-all group p-2 rounded-lg hover:bg-primary/5"
                aria-label="سبد خرید"
              >
                <FaShoppingCart className="text-xl group-hover:scale-110 transition-all" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -left-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden text-secondary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="منو"
              >
                {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-4 animate-slide-down">
              <form onSubmit={handleSearch}>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی محصولات..."
                    className="w-full px-4 py-2.5 pr-10 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-all hover:scale-110"
                  >
                    <FaSearch />
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all hover:scale-110"
                      aria-label="پاک کردن جستجو"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:block border-t py-4">
            <ul className="flex items-center justify-center gap-6">
              <li>
                <Link
                  href="/"
                  className={`transition-colors font-medium ${isActivePath('/') && pathname === '/' ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
                >
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <MegaMenu />
              </li>
              <li>
                <Link
                  href="/shop"
                  className={`transition-colors font-medium ${isActivePath('/shop') ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
                >
                  فروشگاه
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={`transition-colors font-medium ${isActivePath('/blog') ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
                >
                  بلاگ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`transition-colors font-medium ${isActivePath('/about') ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`transition-colors font-medium ${isActivePath('/contact') ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
                >
                  تماس با ما
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-all duration-300 ease-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
            <FaBars className="text-primary" />
            منو
          </h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-600 hover:text-primary transition-all hover:rotate-90 p-2 rounded-lg hover:bg-gray-100"
            aria-label="بستن منو"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-200px)]">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className={`block px-4 py-3 rounded-lg transition-all font-medium transform hover:translate-x-1 ${isActivePath('/') && pathname === '/' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'text-secondary hover:bg-gray-100'
                  }`}
              >
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className={`block px-4 py-3 rounded-lg transition-all font-medium transform hover:translate-x-1 ${isActivePath('/shop') ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'text-secondary hover:bg-gray-100'
                  }`}
              >
                فروشگاه
              </Link>
            </li>

            {/* Categories Section */}
            <li className="pt-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gray-300"></span>
                دسته‌بندی‌ها
                <span className="flex-1 h-0.5 bg-gray-300"></span>
              </div>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/shop?category=backpack"
                    className="block px-4 py-2 rounded-lg text-secondary hover:bg-primary/5 transition-all text-sm transform hover:translate-x-1"
                  >
                    🎒 کوله پشتی
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=laptop-bag"
                    className="block px-4 py-2 rounded-lg text-secondary hover:bg-primary/5 transition-all text-sm transform hover:translate-x-1"
                  >
                    💼 کیف لپ‌تاپ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=school-bag"
                    className="block px-4 py-2 rounded-lg text-secondary hover:bg-primary/5 transition-all text-sm transform hover:translate-x-1"
                  >
                    🎓 کیف مدرسه
                  </Link>
                </li>
              </ul>
            </li>

            <li className="pt-2">
              <Link
                href="/blog"
                className={`block px-4 py-3 rounded-lg transition-all font-medium transform hover:translate-x-1 ${isActivePath('/blog') ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'text-secondary hover:bg-gray-100'
                  }`}
              >
                بلاگ
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`block px-4 py-3 rounded-lg transition-all font-medium transform hover:translate-x-1 ${isActivePath('/about') ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'text-secondary hover:bg-gray-100'
                  }`}
              >
                درباره ما
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`block px-4 py-3 rounded-lg transition-all font-medium transform hover:translate-x-1 ${isActivePath('/contact') ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'text-secondary hover:bg-gray-100'
                  }`}
              >
                تماس با ما
              </Link>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 mb-2 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-2xl text-primary" />
                    <div>
                      <p className="font-semibold text-secondary">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-gray-100 transition-colors font-medium"
                >
                  <FaUser />
                  <span>حساب کاربری</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <FaSignOutAlt />
                  <span>خروج</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-gray-100 transition-colors font-medium w-full"
              >
                <FaUser />
                <span>ورود / ثبت نام</span>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
