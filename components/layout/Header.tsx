'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
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
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی محصولات..."
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-secondary hover:text-primary transition-colors">
              <FaUser className="text-xl" />
            </Link>
            <Link href="/wishlist" className="relative text-secondary hover:text-primary transition-colors group">
              <FaHeart className="text-xl group-hover:scale-110 transition-transform" />
              {wishlistItems > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                  {wishlistItems}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative text-secondary hover:text-primary transition-colors group">
              <FaShoppingCart className="text-xl group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -left-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block border-t md:border-0 py-4`}>
          <ul className="flex flex-col md:flex-row md:items-center md:justify-center gap-6">
            <li>
              <Link href="/" className="text-secondary hover:text-primary transition-colors font-medium">
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-secondary hover:text-primary transition-colors font-medium">
                فروشگاه
              </Link>
            </li>
            <li>
              <Link href="/shop?category=backpack" className="text-secondary hover:text-primary transition-colors font-medium">
                کوله پشتی
              </Link>
            </li>
            <li>
              <Link href="/shop?category=laptop-bag" className="text-secondary hover:text-primary transition-colors font-medium">
                کیف لپ‌تاپ
              </Link>
            </li>
            <li>
              <Link href="/shop?category=school-bag" className="text-secondary hover:text-primary transition-colors font-medium">
                کیف مدرسه
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-secondary hover:text-primary transition-colors font-medium">
                بلاگ
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-secondary hover:text-primary transition-colors font-medium">
                درباره ما
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-secondary hover:text-primary transition-colors font-medium">
                تماس با ما
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
