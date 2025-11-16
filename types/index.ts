// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'backpack' | 'laptop-bag' | 'school-bag';
  images: string[];
  inStock: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
