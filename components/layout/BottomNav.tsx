'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaShoppingBag, FaHeart, FaUser } from 'react-icons/fa';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  const navItems = [
    { href: '/', icon: FaHome, label: 'خانه' },
    { href: '/shop', icon: FaShoppingBag, label: 'فروشگاه' },
    { href: '/wishlist', icon: FaHeart, label: 'علاقه‌مندی', badge: wishlistItems.length },
    { href: '/account', icon: FaUser, label: 'حساب کاربری' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon className="text-xl" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
