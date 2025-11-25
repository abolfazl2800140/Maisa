'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, setAuthToken, removeAuthToken, getAuthToken } from '../api/client';

export type UserRole = 'customer' | 'admin' | 'super_admin';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string, name?: string, role?: UserRole) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load user from token
    useEffect(() => {
        setIsHydrated(true);
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = getAuthToken();
            if (token) {
                // دریافت اطلاعات کاربر از API
                const response = await apiClient.get<any>('/auth/me', token);
                const userData: User = {
                    id: response.id,
                    name: `${response.firstName || ''} ${response.lastName || ''}`.trim() || response.email,
                    email: response.email,
                    role: response.role,
                };
                setUser(userData);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            removeAuthToken();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string, name?: string, role: UserRole = 'customer') => {
        try {
            // لاگین با API واقعی
            const response = await apiClient.post<any>('/auth/login', { email, password });
            const token = response.token || response.access_token;
            setAuthToken(token);
            
            const userData: User = {
                id: response.user.id,
                name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || response.user.email,
                email: response.user.email,
                role: response.user.role,
            };
            setUser(userData);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        removeAuthToken();
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const isSuperAdmin = user?.role === 'super_admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin,
                isSuperAdmin,
                loading,
                login,
                logout,
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
