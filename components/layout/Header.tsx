'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  MapPin,
  ChevronDown,
  GitCompare,
  Package
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useComparison } from '@/lib/context/ComparisonContext';
import { useAuth } from '@/lib/context/AuthContext';
import MegaMenu from './MegaMenu';
import AuthModal from '@/components/auth/AuthModal';
import toast from 'react-hot-toast';
import { toPersianNumbers } from '@/lib/utils/persianNumbers';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

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
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success('با موفقیت خارج شدید');
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'صفحه اصلی' },
    { href: '/shop', label: 'فروشگاه' },
    { href: '/blog', label: 'بلاگ' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'تماس با ما' },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Right Section - Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                <Image
                  src="/logo.svg"
                  alt="مایسا"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden sm:block text-xl font-bold text-gray-900">مایسا</span>
            </Link>

            {/* Center Section - Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href 
                      ? 'text-primary bg-primary/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <MegaMenu />
            </nav>

            {/* Left Section - Search & Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className={`relative transition-all duration-300 ${searchFocused ? 'w-72' : 'w-56'}`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="جستجو..."
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </form>

              {/* Mobile Search */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => router.push('/shop')}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Comparison */}
              <Link
                href="/comparison"
                className="hidden sm:flex relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <GitCompare className="w-5 h-5" />
                {comparisonItems.length > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {toPersianNumbers(comparisonItems.length)}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {toPersianNumbers(wishlistItems)}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {toPersianNumbers(totalItems)}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden lg:block text-sm font-medium max-w-24 truncate">
                        {user?.name}
                      </span>
                      <ChevronDown className={`hidden lg:block w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                          <div className="p-3 bg-gray-50 border-b border-gray-100">
                            <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
                          </div>
                          
                          <div className="p-1">
                            {(user?.role === 'admin' || user?.role === 'super_admin') && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Package className="w-4 h-4" />
                                پنل مدیریت
                              </Link>
                            )}
                            <Link
                              href="/account"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              حساب کاربری
                            </Link>
                            <Link
                              href="/account/orders"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <ShoppingBag className="w-4 h-4" />
                              سفارشات
                            </Link>
                            <Link
                              href="/account/addresses"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <MapPin className="w-4 h-4" />
                              آدرس‌ها
                            </Link>
                          </div>
                          
                          <div className="p-1 border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              خروج
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="hidden sm:flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>ورود</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-bold text-gray-900">منو</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch}>
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
          </form>
        </div>

        <nav className="p-2 overflow-y-auto h-[calc(100vh-180px)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-primary bg-primary/5'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="my-2 border-t border-gray-100" />
          
          <Link
            href="/comparison"
            className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>مقایسه</span>
            {comparisonItems.length > 0 && (
              <span className="w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {toPersianNumbers(comparisonItems.length)}
              </span>
            )}
          </Link>

          {!isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full mt-4 mx-4 flex items-center justify-center gap-2 h-10 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
              style={{ width: 'calc(100% - 32px)' }}
            >
              <User className="w-4 h-4" />
              ورود / ثبت‌نام
            </button>
          )}
        </nav>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
