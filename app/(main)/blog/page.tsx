import Image from 'next/image';
import Link from 'next/link';
import blogPosts from '@/data/blog.json';
import { FaCalendar, FaUser, FaArrowLeft } from 'react-icons/fa';

export const metadata = {
  title: 'بلاگ مایسا - مقالات و راهنمای خرید',
  description: 'مقالات آموزشی و راهنمای خرید کیف و کوله پشتی - بیش از 1000 کلمه در هر مقاله'
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-secondary">بلاگ مایسا</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          مقالات تخصصی و راهنمای‌های جامع درباره انتخاب، خرید و نگهداری کیف و کوله پشتی
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post: any) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
            <Link href={`/blog/${post.slug}`}>
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <FaCalendar className="text-primary" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <FaUser className="text-primary" />
                  {post.author}
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                  {post.category}
                </span>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold mb-3 hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>

              <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                ادامه مطلب
                <FaArrowLeft />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 bg-primary text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">آخرین مقالات را دریافت کنید</h2>
        <p className="mb-6 text-lg">
          برای دریافت مقالات جدید و نکات مفید درباره کیف و کوله پشتی، ایمیل خود را وارد کنید
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            className="flex-1 px-4 py-3 rounded-lg text-secondary focus:outline-none"
          />
          <button className="bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary-light transition-colors">
            عضویت
          </button>
        </div>
      </div>
    </div>
  );
}
