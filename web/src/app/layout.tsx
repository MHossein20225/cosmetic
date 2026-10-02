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
  title: "Store Name Cosmetics",
  description:
    "Intentional beauty rituals and clean botanical formulas designed for skin wellness and quiet luxury.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getSession();
  // const user = session ? { id: session.user.id, name: session.user.name } : null;
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="[font-family:var(--font-geist-sans)] bg-rose-50/40 text-gray-900 antialiased min-h-screen flex flex-col selection:bg-rose-200 selection:text-gray-900">
        <QueryClientProvider>
          <Header />
          {children}
          <Footer />
        </QueryClientProvider>
        <Toaster position="top-right"/>
      </body>
    </html>
  );
}
