import { useQuery } from '@tanstack/react-query';
import {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
} from '@/lib/api/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 2,
  });
}
