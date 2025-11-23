'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, name?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load user from localStorage
    useEffect(() => {
        setIsHydrated(true);
        const savedUser = localStorage.getItem('maysa-user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error loading user:', error);
            }
        }
    }, []);

    const login = (email: string, password: string, name?: string) => {
        const userData: User = {
            name: name || email.split('@')[0],
            email,
        };
        setUser(userData);
        if (isHydrated) {
            localStorage.setItem('maysa-user', JSON.stringify(userData));
        }
    };

    const logout = () => {
        setUser(null);
        if (isHydrated) {
            localStorage.removeItem('maysa-user');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
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
