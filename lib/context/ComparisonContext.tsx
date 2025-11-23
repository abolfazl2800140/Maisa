'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

interface ComparisonContextType {
  items: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_ITEMS = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem('maysa-comparison');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading comparison:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('maysa-comparison', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToComparison = (product: Product) => {
    setItems((prev) => {
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        return prev;
      }
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearComparison = () => {
    setItems([]);
  };

  const isInComparison = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const canAddMore = items.length < MAX_COMPARISON_ITEMS;

  return (
    <ComparisonContext.Provider
      value={{
        items,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
}
