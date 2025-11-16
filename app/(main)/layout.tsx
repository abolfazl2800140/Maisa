import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Toaster } from "react-hot-toast";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
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
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </>
    );
}
