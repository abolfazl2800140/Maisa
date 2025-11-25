'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// ذخیره موقعیت اسکرول هر صفحه
const scrollPositions = new Map<string, number>();

export default function ScrollRestoration() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const isBackNavigation = useRef(false);

  // تشخیص navigation با دکمه back/forward
  useEffect(() => {
    const handlePopState = () => {
      isBackNavigation.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // ذخیره موقعیت اسکرول صفحه قبلی
    if (prevPathname.current && prevPathname.current !== pathname) {
      scrollPositions.set(prevPathname.current, window.scrollY);
    }

    // اگر با back برگشتیم، موقعیت قبلی رو restore کن
    if (isBackNavigation.current && scrollPositions.has(pathname)) {
      const savedPosition = scrollPositions.get(pathname) || 0;
      setTimeout(() => {
        window.scrollTo({ top: savedPosition, behavior: 'instant' });
      }, 0);
    } else {
      // اگر به صفحه جدید رفتیم، به بالا برو
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    prevPathname.current = pathname;
    isBackNavigation.current = false;
  }, [pathname]);

  return null;
}
