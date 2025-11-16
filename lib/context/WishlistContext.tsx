'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface WishlistContextType {
    items: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        const savedWishlist = localStorage.getItem('maysa-wishlist');
        if (savedWishlist) {
            try {
                setItems(JSON.parse(savedWishlist));
            } catch (error) {
                console.error('Error loading wishlist:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('maysa-wishlist', JSON.stringify(items));
        }
    }, [items, isHydrated]);

    const addToWishlist = (product: Product) => {
        setItems((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) {
                toast.error('این محصول قبلاً به لیست علاقه‌مندی‌ها اضافه شده است');
                return prev;
            }

            toast.success(`${product.name} به لیست علاقه‌مندی‌ها اضافه شد`, {
                icon: '❤️',
            });

            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId: string) => {
        setItems((prev) => {
            const product = prev.find(p => p.id === productId);
            if (product) {
                toast.success(`${product.name} از لیست علاقه‌مندی‌ها حذف شد`, {
                    icon: '💔',
                });
            }
            return prev.filter((item) => item.id !== productId);
        });
    };

    const isInWishlist = (productId: string) => {
        return items.some((item) => item.id === productId);
    };

    const clearWishlist = () => {
        setItems([]);
        toast.success('لیست علاقه‌مندی‌ها پاک شد');
    };

    const totalItems = items.length;

    return (
        <WishlistContext.Provider
            value={{
                items,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
                totalItems,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
}
