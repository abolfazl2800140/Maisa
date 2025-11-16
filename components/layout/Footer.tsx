import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaTelegram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-20 border-t-4 border-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.svg"
                  alt="Maysa Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              فروشگاه آنلاین کیف و کوله پشتی مایسا، ارائه دهنده بهترین محصولات با کیفیت بالا و قیمت مناسب
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  بلاگ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">خدمات مشتریان</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  حساب کاربری
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  سبد خرید
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  راهنمای خرید
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <FaPhone className="text-primary" />
                <span>021-12345678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <FaEnvelope className="text-primary" />
                <span>info@maysa.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <FaMapMarkerAlt className="text-primary mt-1" />
                <span>تهران، خیابان ولیعصر</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-primary hover:scale-110 transition-all duration-200 shadow-md" aria-label="Instagram">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-primary hover:scale-110 transition-all duration-200 shadow-md" aria-label="Telegram">
                <FaTelegram className="text-lg" />
              </a>
              <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-primary hover:scale-110 transition-all duration-200 shadow-md" aria-label="WhatsApp">
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2024 فروشگاه مایسا. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
