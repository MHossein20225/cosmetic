"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/productHooks";
import ProductCard from "./ProductCard";

export default function ProductsSection() {
  const { products } = useProducts();

  return (
    <section className="w-full max-w-[1360px] mx-auto px-6 pb-16 md:pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-3 border-b border-gray-200">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 block mb-1">
            پرفروش‌ها
          </span>
          <h2 className="font-serif text-3xl text-gray-900">
            محصولات منتخب
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs font-medium uppercase tracking-[0.15em] text-amber-800 flex items-center gap-1 mt-2 md:mt-0 hover:gap-2 transition-all"
        >
          <span>مشاهده همه</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(products ?? []).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
