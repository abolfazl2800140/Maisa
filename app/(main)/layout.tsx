import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import BottomNav from "@/components/layout/BottomNav";
import LiveChat from "@/components/ui/LiveChat";
import { Toaster } from "react-hot-toast";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Skip to Content Link for Accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-lg focus:font-bold focus:shadow-xl"
            >
                پرش به محتوا
            </a>
            
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
            <Header />
            <main id="main-content" className="min-h-screen" tabIndex={-1}>
                {children}
            </main>
            <Footer />
            <ScrollToTop />
            <BottomNav />
            <LiveChat />
        </>
    );
}
