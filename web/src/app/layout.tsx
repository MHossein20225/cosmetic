import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="[font-family:var(--font-geist-sans)] bg-rose-50/40 text-gray-900 antialiased min-h-screen flex flex-col selection:bg-rose-200 selection:text-gray-900">
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
