// API functions برای پنل ادمین

import { apiClient, getAuthToken } from './client';
import { UserRole } from '../context/AuthContext';

// Types
export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalReviews: number;
    pendingOrders: number;
    lowStockProducts: number;
    pendingReviews: number;
    totalRevenue: number;
    recentOrders: any[];
    lowStockProductsList: any[];
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    basePrice: number;
    finalPrice: number;
    discountPercentage: number;
    category: {
        id: string;
        name: string;
    };
    brand?: {
        id: string;
        name: string;
    };
    images: Array<{
        id: string;
        imageUrl: string;
        isPrimary: boolean;
    }>;
    variants: Array<{
        id: string;
        sku: string;
        color?: string;
        size?: string;
        stockQuantity: number;
    }>;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    address: {
        fullName: string;
        phone: string;
        province: string;
        city: string;
        postalCode: string;
        addressLine: string;
    };
    items: Array<{
        id: string;
        productName: string;
        variantDetails: any;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    taxAmount: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    trackingCode?: string;
    notes?: string;
    adminNotes?: string;
    createdAt: string;
}

export interface Review {
    id: string;
    product: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    rating: number;
    title?: string;
    comment?: string;
    pros: string[];
    cons: string[];
    isApproved: boolean;
    isVerifiedPurchase: boolean;
    createdAt: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    loyaltyPoints: number;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId?: string;
    isActive: boolean;
    _count?: {
        products: number;
    };
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    _count?: {
        products: number;
    };
}

// Dashboard APIs
export const adminApi = {
    // Dashboard
    async getDashboardStats(): Promise<DashboardStats> {
        const token = getAuthToken();
        return apiClient.get('/admin/dashboard/stats', token || undefined);
    },

    // Products
    async getProducts(params?: {
        search?: string;
        status?: 'all' | 'active' | 'inactive';
        page?: number;
        limit?: number;
    }): Promise<{ data: Product[]; total: number }> {
        const token = getAuthToken();
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status && params.status !== 'all')
            queryParams.append('isActive', params.status === 'active' ? 'true' : 'false');
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        return apiClient.get(`/products${query ? `?${query}` : ''}`, token || undefined);
    },

    async getProduct(id: string): Promise<Product> {
        const token = getAuthToken();
        return apiClient.get(`/products/${id}`, token || undefined);
    },

    async createProduct(data: any): Promise<Product> {
        const token = getAuthToken();
        return apiClient.post('/products', data, token || undefined);
    },

    async updateProduct(id: string, data: any): Promise<Product> {
        const token = getAuthToken();
        return apiClient.patch(`/products/${id}`, data, token || undefined);
    },

    async deleteProduct(id: string): Promise<void> {
        const token = getAuthToken();
        return apiClient.delete(`/products/${id}`, token || undefined);
    },

    // Orders
    async getOrders(params?: {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{ data: Order[]; total: number }> {
        const token = getAuthToken();
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status && params.status !== 'all')
            queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        return apiClient.get(`/orders${query ? `?${query}` : ''}`, token || undefined);
    },

    async getOrder(id: string): Promise<Order> {
        const token = getAuthToken();
        return apiClient.get(`/orders/${id}`, token || undefined);
    },

    async updateOrderStatus(
        id: string,
        data: { status: string; trackingCode?: string; adminNotes?: string }
    ): Promise<Order> {
        const token = getAuthToken();
        return apiClient.patch(`/orders/${id}/status`, data, token || undefined);
    },

    // Reviews
    async getReviews(params?: {
        search?: string;
        status?: 'all' | 'pending' | 'approved';
        page?: number;
        limit?: number;
    }): Promise<{ data: Review[]; total: number }> {
        const token = getAuthToken();
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status && params.status !== 'all')
            queryParams.append('isApproved', params.status === 'approved' ? 'true' : 'false');
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        return apiClient.get(`/reviews${query ? `?${query}` : ''}`, token || undefined);
    },

    async approveReview(id: string): Promise<Review> {
        const token = getAuthToken();
        return apiClient.patch(`/reviews/${id}/approve`, {}, token || undefined);
    },

    async rejectReview(id: string): Promise<void> {
        const token = getAuthToken();
        return apiClient.delete(`/reviews/${id}`, token || undefined);
    },

    // Categories
    async getCategories(): Promise<Category[]> {
        const token = getAuthToken();
        return apiClient.get('/categories', token || undefined);
    },

    async createCategory(data: {
        name: string;
        slug: string;
        parentId?: string;
    }): Promise<Category> {
        const token = getAuthToken();
        return apiClient.post('/categories', data, token || undefined);
    },

    async updateCategory(
        id: string,
        data: { name: string; slug: string; parentId?: string }
    ): Promise<Category> {
        const token = getAuthToken();
        return apiClient.patch(`/categories/${id}`, data, token || undefined);
    },

    async deleteCategory(id: string): Promise<void> {
        const token = getAuthToken();
        return apiClient.delete(`/categories/${id}`, token || undefined);
    },

    async toggleCategoryStatus(id: string): Promise<Category> {
        const token = getAuthToken();
        return apiClient.patch(`/categories/${id}/toggle-status`, {}, token || undefined);
    },

    // Brands
    async getBrands(): Promise<Brand[]> {
        const token = getAuthToken();
        return apiClient.get('/brands', token || undefined);
    },

    async createBrand(data: {
        name: string;
        slug: string;
        description?: string;
    }): Promise<Brand> {
        const token = getAuthToken();
        return apiClient.post('/brands', data, token || undefined);
    },

    async updateBrand(
        id: string,
        data: { name: string; slug: string; description?: string }
    ): Promise<Brand> {
        const token = getAuthToken();
        return apiClient.patch(`/brands/${id}`, data, token || undefined);
    },

    async deleteBrand(id: string): Promise<void> {
        const token = getAuthToken();
        return apiClient.delete(`/brands/${id}`, token || undefined);
    },

    async toggleBrandStatus(id: string): Promise<Brand> {
        const token = getAuthToken();
        return apiClient.patch(`/brands/${id}/toggle-status`, {}, token || undefined);
    },

    // Users (Super Admin only)
    async getUsers(params?: {
        search?: string;
        role?: string;
        page?: number;
        limit?: number;
    }): Promise<{ data: User[]; total: number }> {
        const token = getAuthToken();
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.role && params.role !== 'all')
            queryParams.append('role', params.role);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        return apiClient.get(`/users${query ? `?${query}` : ''}`, token || undefined);
    },

    async updateUserRole(id: string, role: UserRole): Promise<User> {
        const token = getAuthToken();
        return apiClient.patch(`/users/${id}/role`, { role }, token || undefined);
    },

    async toggleUserStatus(id: string): Promise<User> {
        const token = getAuthToken();
        return apiClient.patch(`/users/${id}/toggle-status`, {}, token || undefined);
    },

    // Upload
    async uploadImage(file: File): Promise<{ url: string }> {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'خطا در آپلود تصویر');
        }

        return response.json();
    },

    async uploadImages(files: File[]): Promise<{ ids: string[]; urls: string[] }> {
        const token = getAuthToken();
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/upload/images`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'خطا در آپلود تصاویر');
        }

        return response.json();
    },
};
