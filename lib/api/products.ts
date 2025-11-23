import { Product } from '@/types';
import { ApiClient } from './client';

interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string | number;
  discountPercentage: number;
  finalPrice: string | number | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
  }>;
  ratingAverage: string | number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  variants?: Array<{
    id: string;
    stock: number;
  }>;
}

interface ProductsResponse {
  data: BackendProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Map backend product to frontend product format
function mapBackendProduct(backendProduct: BackendProduct): Product {
  const totalStock = backendProduct.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const hasDiscount = backendProduct.discountPercentage > 0;
  
  // Calculate final price if null
  const basePrice = Number(backendProduct.basePrice);
  const finalPrice = backendProduct.finalPrice 
    ? Number(backendProduct.finalPrice)
    : basePrice * (1 - backendProduct.discountPercentage / 100);
  
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    slug: backendProduct.slug,
    description: backendProduct.description || '',
    price: finalPrice,
    originalPrice: hasDiscount ? basePrice : undefined,
    category: backendProduct.category.slug as 'backpack' | 'laptop-bag' | 'school-bag',
    images: backendProduct.images && backendProduct.images.length > 0
      ? backendProduct.images
          .sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : 0))
          .map(img => img.imageUrl)
      : ['/images/placeholder.jpg'],
    inStock: totalStock > 0 || true, // Default to true if no variants
    featured: backendProduct.isFeatured,
    rating: Number(backendProduct.ratingAverage) || undefined,
    reviewCount: backendProduct.reviewCount || undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await ApiClient.get<ProductsResponse>('/products?limit=100');
    return response.data.map(mapBackendProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const backendProduct = await ApiClient.get<BackendProduct>(`/products/slug/${slug}`);
    return mapBackendProduct(backendProduct);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const response = await ApiClient.get<ProductsResponse>(`/products?categoryId=${categoryId}&limit=100`);
    return response.data.map(mapBackendProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await ApiClient.get<ProductsResponse>('/products?isFeatured=true&limit=100');
    return response.data.map(mapBackendProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await ApiClient.get<ProductsResponse>(`/products?search=${encodeURIComponent(query)}&limit=100`);
    return response.data.map(mapBackendProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}
