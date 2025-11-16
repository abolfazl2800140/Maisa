import { Product } from '@/types';
import productsData from '@/data/products.json';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(): Promise<Product[]> {
  await delay(500); // Simulate network delay
  return productsData as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay(300);
  const products = productsData as Product[];
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  await delay(400);
  const products = productsData as Product[];
  return products.filter((p) => p.category === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(400);
  const products = productsData as Product[];
  return products.filter((p) => p.featured);
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(500);
  const products = productsData as Product[];
  const lowerQuery = query.toLowerCase();
  
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}
