import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/checkout/'],
    },
    sitemap: 'https://maysa-shop.com/sitemap.xml',
  };
}
