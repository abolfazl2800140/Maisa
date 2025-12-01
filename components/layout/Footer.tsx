import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Send, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* About */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="مایسا"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">مایسا</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              فروشگاه آنلاین کیف و کوله پشتی مایسا، ارائه دهنده بهترین محصولات با کیفیت بالا و قیمت مناسب
            </p>
            
            {/* Social Media */}
            <div className="flex gap-2 mt-6">
              <a 
                href="#" 
                className="p-2.5 bg-gray-800 text-gray-400 hover:bg-primary hover:text-white rounded-xl transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2.5 bg-gray-800 text-gray-400 hover:bg-primary hover:text-white rounded-xl transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">دسترسی سریع</h3>
            <ul className="space-y-3">
              {[
                { href: '/shop', label: 'فروشگاه' },
                { href: '/about', label: 'درباره ما' },
                { href: '/contact', label: 'تماس با ما' },
                { href: '/blog', label: 'بلاگ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">خدمات مشتریان</h3>
            <ul className="space-y-3">
              {[
                { href: '/account', label: 'حساب کاربری' },
                { href: '/cart', label: 'سبد خرید' },
                { href: '/faq', label: 'سوالات متداول' },
                { href: '/terms', label: 'قوانین و مقررات' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">تماس با ما</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-gray-400 text-sm">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-gray-400 text-sm">info@maysa.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-gray-400 text-sm">تهران، خیابان ولیعصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <p className="text-center text-sm text-gray-500">
            © ۱۴۰۳ فروشگاه مایسا. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
