'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import blogPosts from '@/data/blog.json';
import { FaCalendar, FaUser, FaArrowRight } from 'react-icons/fa';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

// Blog content data
const blogContent: Record<string, string> = {
  'backpack-buying-guide': `# راهنمای جامع خرید کوله پشتی مناسب

## مقدمه
انتخاب کوله پشتی مناسب یکی از مهم‌ترین تصمیماتی است که می‌تواند تأثیر مستقیمی بر سلامت، راحتی و کارایی روزانه شما داشته باشد.

## چرا انتخاب کوله پشتی مناسب مهم است؟
کوله پشتی نامناسب می‌تواند باعث درد مزمن کمر و گردن، انحراف ستون فقرات و مشکلات عضلانی شود.

## انواع کوله پشتی
- کوله پشتی روزمره
- کوله پشتی لپ‌تاپ
- کوله پشتی کوهنوردی
- کوله پشتی ورزشی`,

  'leather-bag-care': `# راهنمای کامل نگهداری و تمیز کردن کیف چرمی

## مقدمه
کیف‌های چرمی با نگهداری صحیح می‌توانند سال‌ها دوام بیاورند.

## چرا نگهداری مهم است
- عمر کیف چندین برابر می‌شود
- ظاهر و زیبایی حفظ می‌شود
- ارزش مالی کاهش نمی‌یابد

## انواع چرم
- چرم تمام دانه
- چرم دانه‌دار
- چرم نوبوک`,

  'best-school-backpack': `# راهنمای انتخاب بهترین کوله پشتی مدرسه

## مقدمه
انتخاب کوله پشتی مناسب برای دانش‌آموزان یکی از مهم‌ترین تصمیماتی است.

## وزن مجاز
- کوله خالی: حداکثر 10% وزن بدن
- کوله پر: حداکثر 15% وزن بدن

## بر اساس سن
- دبستان: 15-20 لیتر
- راهنمایی: 20-25 لیتر
- دبیرستان: 25-30 لیتر`
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = blogPosts.find((p: BlogPost) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const content = blogContent[slug] || '';

  return (
    <div className="w-full bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            <FaArrowRight />
            بازگشت به بلاگ
          </Link>
        </div>
      </div>

      {/* Featured Image - Full Width */}
      <div className="relative h-96 w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Header - Full Width */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <FaCalendar className="text-primary" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <FaUser className="text-primary" />
              {post.author}
            </span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 text-secondary">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Article Content - Full Width */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-gray-700 space-y-6">
            {content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-secondary">
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-secondary">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="text-gray-700">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Author Info - Full Width */}
      <div className="bg-primary/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <h3 className="font-bold text-lg mb-2 text-secondary">درباره نویسنده</h3>
          <p className="text-gray-700">
            {post.author} - تیم متخصص فروشگاه مایسا که با سال‌ها تجربه در زمینه کیف و کوله پشتی، اطلاعات ارزشمند را برای شما تهیه می‌کند.
          </p>
        </div>
      </div>

      {/* Related Articles - Full Width */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold mb-8 text-secondary">مقالات مرتبط</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter((p: BlogPost) => p.slug !== slug)
              .slice(0, 2)
              .map((relatedPost: BlogPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2 hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* CTA - Full Width */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-bold mb-4">آیا سوالی دارید؟</h3>
          <p className="mb-6 text-lg">
            تیم کارشناسان مایسا آماده است تا به تمام سوالات شما پاسخ دهد.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            تماس با ما
          </Link>
        </div>
      </div>
    </div>
  );
}
