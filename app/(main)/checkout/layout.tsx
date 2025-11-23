import { ReactNode } from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/components/providers/QueryProvider';
import { CartProvider } from '@/lib/context/CartContext';
import { WishlistProvider } from '@/lib/context/WishlistContext';
import '../../globals.css';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="fa" dir="rtl">
            <head>
                <link
                    href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
                    rel="stylesheet"
                    type="text/css"
                />
            </head>
            <body className="antialiased bg-gray-50 font-vazir">
                <QueryProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <Toaster
                                position="top-center"
                                reverseOrder={false}
                                toastOptions={{
                                    duration: 3000,
                                    style: {
                                        background: '#fff',
                                        color: '#1a1a1a',
                                        fontFamily: 'Vazirmatn, sans-serif',
                                        direction: 'rtl',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    },
                                    success: {
                                        duration: 3000,
                                        style: {
                                            border: '2px solid #10B981',
                                        },
                                        iconTheme: {
                                            primary: '#10B981',
                                            secondary: '#fff',
                                        },
                                    },
                                    error: {
                                        duration: 4000,
                                        style: {
                                            border: '2px solid #EF4444',
                                        },
                                        iconTheme: {
                                            primary: '#EF4444',
                                            secondary: '#fff',
                                        },
                                    },
                                }}
                            />
                            <div className="min-h-screen bg-gray-50">
                                {/* Simple Header for Checkout */}
                                <header className="bg-white shadow-sm sticky top-0 z-50">
                                    <div className="container mx-auto px-4 py-4">
                                        <div className="flex items-center justify-between">
                                            <Link href="/" className="text-2xl font-bold text-primary">
                                                مایسا
                                            </Link>
                                            <div className="text-sm text-gray-600">
                                                خرید امن و مطمئن
                                            </div>
                                        </div>
                                    </div>
                                </header>

                                {children}

                                {/* Simple Footer for Checkout */}
                                <footer className="bg-white border-t mt-12">
                                    <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
                                        <p>© 1403 فروشگاه مایسا. تمامی حقوق محفوظ است.</p>
                                    </div>
                                </footer>
                            </div>
                        </WishlistProvider>
                    </CartProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
