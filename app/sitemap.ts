import { MetadataRoute } from 'next';
import products from '@/data/products.json';
import blogPosts from '@/data/blog.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://maysa-shop.com';

  // Static pages
  const staticPages = [
    '',
    '/shop',
    '/blog',
    '/cart',
    '/checkout',
    '/account',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Blog pages
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
