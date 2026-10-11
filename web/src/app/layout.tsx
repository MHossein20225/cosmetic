import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QueryClientProvider from "@/app/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "فروشگاه محصولات آرایشی و بهداشتی",
  description: "محصولات مراقبت از پوست و زیبایی با ترکیبات گیاهی و فرمول‌های سنجیده.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getSession();
  // const user = session ? { id: session.user.id, name: session.user.name } : null;
  return (
    <html lang="fa" dir="rtl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-rose-50/40 text-gray-900 antialiased min-h-screen flex flex-col selection:bg-rose-200 selection:text-gray-900">
        <QueryClientProvider>
          <Header />
          {children}
          <Footer />
        </QueryClientProvider>
        <Toaster position="top-left" />
      </body>
    </html>
  );
}
