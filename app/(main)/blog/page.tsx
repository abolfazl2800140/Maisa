import Image from 'next/image';
import Link from 'next/link';
import blogPosts from '@/data/blog.json';
import { FaCalendar, FaArrowLeft, FaBookOpen, FaClock } from 'react-icons/fa';

export const metadata = {
  title: 'بلاگ مایسا - مقالات و راهنمای خرید',
  description: 'مقالات آموزشی و راهنمای خرید کیف و کوله پشتی - بیش از 1000 کلمه در هر مقاله'
};

export default function BlogPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
              <FaBookOpen />
              <span className="text-sm font-medium">بلاگ مایسا</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              دنیای کیف و کوله‌پشتی
            </h1>
            <p className="text-lg text-gray-300">
              مقالات تخصصی، راهنمای خرید و نکات نگهداری از محصولات
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post: any) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 origin-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <FaCalendar className="text-primary" />
                    {post.date}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-primary" />
                    ۵ دقیقه
                  </span>
                </div>

                <span className="inline-block bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 w-fit">
                  {post.category}
                </span>

                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-4 transition-all mt-auto"
                >
                  ادامه مطلب
                  <FaArrowLeft size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBookOpen className="text-primary text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">عضویت در خبرنامه</h2>
            <p className="text-gray-400 mb-8">
              جدیدترین مقالات و راهنماهای خرید را مستقیم در ایمیل خود دریافت کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/20 transition-all"
              />
              <button className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                عضویت
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
