"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { ProductSort, SearchProductsResult } from "@/types";

interface ProductsViewProps {
  title: string;
  description?: string;
  products: SearchProductsResult["products"];
  result?: SearchProductsResult;
  sort?: ProductSort;
  categoryLabel?: string;
  isFetching?: boolean;
  onParamsChange: (params: { search?: string; sort?: ProductSort; page?: number }) => void;
}

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount-desc", label: "Biggest Discount" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function ProductsView({
  title,
  description,
  products,
  result,
  sort,
  categoryLabel,
  isFetching,
  onParamsChange,
}: ProductsViewProps) {
  const [search, setSearch] = useState("");

  const total = result?.total ?? 0;
  const page = result?.page ?? 1;
  const totalPages = result?.totalPages ?? 1;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onParamsChange({ search, page: 1 });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, onParamsChange]);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-8 md:py-12">
      <nav className="flex items-center gap-1 text-gray-500 text-xs uppercase tracking-wider mb-6 flex-wrap">
        <Link href="/" className="hover:text-amber-800 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href="/products"
          className="hover:text-amber-800 transition-colors"
        >
          Shop
        </Link>
        {categoryLabel && (
          <>
            <ChevronRight size={12} />
            <span className="text-gray-900">{categoryLabel}</span>
          </>
        )}
      </nav>

      <div className="mb-6 pb-3 border-b border-gray-200">
        <h1 className="font-serif text-3xl sm:text-4xl text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 mt-2 max-w-xl">{description}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full bg-white pl-11 pr-10 py-2.5 text-sm text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-800"
            type="search"
          />

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-800 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={sort ?? "featured"}
          onChange={(event) =>
            onParamsChange({
              sort: event.target.value as ProductSort,
              page: 1,
            })
          }
          aria-label="Sort products"
          className="bg-white px-4 py-2.5 text-sm text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-800"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {total} {total === 1 ? "product" : "products"}
        {search && ` matching "${search}"`}
        {isFetching && <span className="ml-2 text-gray-400">updating...</span>}
      </p>

      {products.length === 0 ? (
        <p className="text-gray-500 text-sm py-12 text-center">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onParamsChange({ page: page - 1 })}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:border-amber-800 hover:text-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onParamsChange({ page: index + 1 })}
              aria-current={page === index + 1 ? "page" : undefined}
              className={`w-9 h-9 text-sm font-medium rounded-lg border transition-colors ${
                page === index + 1
                  ? "bg-amber-800 text-white border-amber-800"
                  : "border-gray-200 text-gray-700 hover:border-amber-800 hover:text-amber-800"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            type="button"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onParamsChange({ page: page + 1 })}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:border-amber-800 hover:text-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
