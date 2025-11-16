import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/components/providers/QueryProvider";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const metadata: Metadata = {
  title: "فروشگاه مایسا - خرید کیف و کوله پشتی",
  description: "فروشگاه آنلاین کیف و کوله پشتی مایسا - خرید انواع کوله پشتی، کیف لپ‌تاپ و کیف مدرسه با بهترین کیفیت و قیمت",
  keywords: "کیف، کوله پشتی، کیف لپ‌تاپ، کیف مدرسه، مایسا، خرید آنلاین",
  authors: [{ name: "Maysa Shop" }],
  openGraph: {
    title: "فروشگاه مایسا",
    description: "خرید آنلاین کیف و کوله پشتی",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              {children}
            </WishlistProvider>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
