import { useState, useEffect } from 'react';
import { Product } from '@/types';

const MAX_RECENTLY_VIEWED = 12;
const STORAGE_KEY = 'maysa-recently-viewed';

export function useRecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recently viewed:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToRecentlyViewed = (product: Product) => {
    setItems((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item.id !== product.id);
      // Add to beginning
      const updated = [product, ...filtered];
      // Keep only MAX_RECENTLY_VIEWED items
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  };

  const clearRecentlyViewed = () => {
    setItems([]);
  };

  return {
    items,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
}
