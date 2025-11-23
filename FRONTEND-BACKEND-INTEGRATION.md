# 🔗 اتصال Frontend (Next.js) به Backend (NestJS)

## 📋 خلاصه

Frontend شما با Next.js 16 و Backend با NestJS 10 ساخته شده.
این راهنما نحوه اتصال و استفاده از API رو توضیح می‌ده.

---

## 🚀 راه‌اندازی

### 1. اجرای Backend

```bash
# Terminal 1 - Backend
npm run nest:dev
# Backend: http://localhost:4000
# Swagger: http://localhost:4000/api/docs
```

### 2. اجرای Frontend

```bash
# Terminal 2 - Frontend
npm run dev
# Frontend: http://localhost:3000
```

---

## 🔧 تنظیمات Frontend

### 1. ایجاد API Client

```typescript
// lib/api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_URL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'خطا در ارتباط با سرور');
    }

    return response.json();
  }

  // Auth
  async register(data: RegisterDto) {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginDto) {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // Products
  async getProducts(params?: ProductQueryParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<ProductsResponse>(`/products?${query}`);
  }

  async getProduct(id: string) {
    return this.request<Product>(`/products/${id}`);
  }

  async getProductBySlug(slug: string) {
    return this.request<Product>(`/products/slug/${slug}`);
  }

  // Orders
  async createOrder(data: CreateOrderDto) {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders() {
    return this.request<Order[]>('/orders');
  }

  async getOrder(id: string) {
    return this.request<Order>(`/orders/${id}`);
  }

  // Reviews
  async createReview(data: CreateReviewDto) {
    return this.request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProductReviews(productId: string) {
    return this.request<Review[]>(`/reviews/product/${productId}`);
  }

  // Categories
  async getCategories() {
    return this.request<Category[]>('/categories');
  }

  // Wishlist (می‌تونی بعداً اضافه کنی)
  // Admin endpoints...
}

export const apiClient = new ApiClient();

// Types
interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'customer' | 'admin' | 'super_admin';
  loyaltyPoints: number;
}

interface ProductQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isFeatured?: boolean;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category;
  brand?: Brand;
  ratingAverage: number;
  ratingCount: number;
  reviewCount: number;
}

// ... سایر types
```

### 2. استفاده در Components

```typescript
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login({ email, password });
      console.log('ورود موفق:', response.user);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">ورود به حساب کاربری</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">ایمیل</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>
    </div>
  );
}
```

### 3. استفاده با React Query

```typescript
// lib/api/queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

// Products
export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiClient.getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: () => apiClient.getProductBySlug(slug),
    enabled: !!slug,
  });
}

// Auth
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginDto) => apiClient.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterDto) => apiClient.register(data),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => apiClient.getMe(),
    retry: false,
  });
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.getOrders(),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderDto) => apiClient.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Reviews
export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => apiClient.getProductReviews(productId),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReviewDto) => apiClient.createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', variables.productId] 
      });
    },
  });
}
```

### 4. استفاده در Component با React Query

```typescript
// app/shop/page.tsx
'use client';

import { useProducts } from '@/lib/api/queries';
import { useState } from 'react';

export default function ShopPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useProducts({
    page,
    limit: 20,
    search,
  });

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا: {error.message}</div>;
  }

  return (
    <div>
      <h1>فروشگاه</h1>
      
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجو..."
        className="mb-4 px-4 py-2 border rounded"
      />

      <div className="grid grid-cols-4 gap-4">
        {data?.data.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <img 
              src={product.images[0]?.imageUrl || '/placeholder.jpg'} 
              alt={product.name}
              className="w-full h-48 object-cover mb-2"
            />
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-primary">
              {product.finalPrice.toLocaleString('fa-IR')} تومان
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex gap-2">
        {Array.from({ length: data?.meta.totalPages || 0 }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded ${
              page === i + 1 ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔐 مدیریت Authentication

### Auth Context

```typescript
// lib/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const userData = await apiClient.getMe();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await apiClient.login({ email, password });
    setUser(response.user);
  }

  function logout() {
    apiClient.logout();
    setUser(null);
  }

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### استفاده از Auth Context

```typescript
// app/layout.tsx
import { AuthProvider } from '@/lib/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// در هر component
import { useAuth } from '@/lib/context/AuthContext';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>سلام {user?.firstName}</span>
          <button onClick={logout}>خروج</button>
        </>
      ) : (
        <a href="/login">ورود</a>
      )}
    </header>
  );
}
```

---

## 🛡️ Protected Routes

```typescript
// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ 
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
}: { 
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}) {
  const { isAuthenticated, isAdmin, isSuperAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireSuperAdmin && !isSuperAdmin) {
        router.push('/');
      } else if (requireAdmin && !isAdmin) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, isSuperAdmin, loading]);

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <div>دسترسی ندارید</div>;
  }

  if (requireAdmin && !isAdmin) {
    return <div>دسترسی ندارید</div>;
  }

  return <>{children}</>;
}

// استفاده
// app/admin/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div>پنل ادمین</div>
    </ProtectedRoute>
  );
}
```

---

## 📝 نکات مهم

### 1. Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 2. CORS در Backend

Backend از قبل CORS رو برای `http://localhost:3000` فعال کرده.

### 3. Error Handling

همیشه خطاها رو handle کن:

```typescript
try {
  const data = await apiClient.getProducts();
} catch (error) {
  console.error('خطا:', error);
  toast.error('خطا در دریافت محصولات');
}
```

### 4. Loading States

همیشه loading state داشته باش:

```typescript
const { data, isLoading, error } = useProducts();

if (isLoading) return <Skeleton />;
if (error) return <Error />;
return <ProductList products={data} />;
```

---

## 🎯 مثال کامل: صفحه محصول

```typescript
// app/product/[slug]/page.tsx
'use client';

import { useProductBySlug, useProductReviews, useCreateReview } from '@/lib/api/queries';
import { useAuth } from '@/lib/context/AuthContext';
import { useState } from 'react';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product, isLoading } = useProductBySlug(params.slug);
  const { data: reviews } = useProductReviews(product?.id || '');
  const { isAuthenticated } = useAuth();
  const createReview = useCreateReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createReview.mutateAsync({
        productId: product!.id,
        rating,
        comment,
      });
      setComment('');
      toast.success('نظر شما ثبت شد');
    } catch (error) {
      toast.error('خطا در ثبت نظر');
    }
  };

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!product) return <div>محصول یافت نشد</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-2 gap-8">
        {/* تصاویر */}
        <div>
          <img 
            src={product.images[0]?.imageUrl} 
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        {/* اطلاعات */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="text-2xl font-bold text-primary mb-6">
            {product.finalPrice.toLocaleString('fa-IR')} تومان
          </div>

          <button className="w-full bg-primary text-white py-3 rounded-lg">
            افزودن به سبد خرید
          </button>
        </div>
      </div>

      {/* نظرات */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">نظرات کاربران</h2>

        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-4">ثبت نظر</h3>
            
            <div className="mb-4">
              <label>امتیاز</label>
              <select 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded"
              >
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{n} ستاره</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label>نظر شما</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                rows={4}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={createReview.isPending}
              className="bg-primary text-white px-6 py-2 rounded"
            >
              {createReview.isPending ? 'در حال ثبت...' : 'ثبت نظر'}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="p-4 border rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">
                  {review.user.firstName} {review.user.lastName}
                </span>
                <span className="text-yellow-500">
                  {'⭐'.repeat(review.rating)}
                </span>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Checklist اتصال

- [ ] Backend اجرا شده (port 4000)
- [ ] Frontend اجرا شده (port 3000)
- [ ] API Client ساخته شده
- [ ] Auth Context پیاده‌سازی شده
- [ ] React Query تنظیم شده
- [ ] Protected Routes ساخته شده
- [ ] Error Handling اضافه شده
- [ ] Loading States اضافه شده

---

**حالا Frontend و Backend کاملاً متصل هستند! 🎉**
