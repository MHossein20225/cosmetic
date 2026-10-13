"use client";

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
  search?: string;
  categoryLabel?: string;
  isFetching?: boolean;
  onParamsChange: (params: { search?: string; sort?: ProductSort; page?: number }) => void;
}

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "منتخب" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "قیمت: از کم به زیاد" },
  { value: "price-desc", label: "قیمت: از زیاد به کم" },
  { value: "discount-desc", label: "بیشترین تخفیف" },
  { value: "name-asc", label: "نام: الف تا ی" },
];

export default function ProductsView({
  title,
  description,
  products,
  result,
  sort,
  search = "",
  categoryLabel,
  isFetching,
  onParamsChange,
}: ProductsViewProps) {
  const total = result?.total ?? 0;
  const page = result?.page ?? 1;
  const totalPages = result?.totalPages ?? 1;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-8 md:py-12">
      <nav className="flex items-center gap-1 text-gray-500 text-xs uppercase tracking-wider mb-6 flex-wrap">
        <Link href="/" className="hover:text-amber-800 transition-colors">
          خانه
        </Link>
        <ChevronLeft size={12} />
        <Link
          href="/products"
          className="hover:text-amber-800 transition-colors"
        >
          فروشگاه
        </Link>
        {categoryLabel && (
          <>
            <ChevronLeft size={12} />
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
            className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            value={search}
            onChange={(event) => onParamsChange({ search: event.target.value, page: 1 })}
            placeholder="جست‌وجوی محصولات"
            aria-label="جست‌وجوی محصولات"
            className="w-full bg-white ps-11 pe-10 py-2.5 text-sm text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-800"
            type="search"
          />

          {search && (
            <button
              type="button"
              aria-label="پاک کردن جست‌وجو"
              onClick={() => onParamsChange({ search: "", page: 1 })}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-800 transition-colors"
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
          aria-label="مرتب‌سازی محصولات"
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
        {total.toLocaleString("fa-IR")} محصول
        {search && ` برای «${search}»`}
        {isFetching && <span className="ms-2 text-gray-400">در حال به‌روزرسانی…</span>}
      </p>

      {products.length === 0 ? (
        <p className="text-gray-500 text-sm py-12 text-center">
          محصولی پیدا نشد.
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
            aria-label="صفحه قبل"
            disabled={page <= 1}
            onClick={() => onParamsChange({ page: page - 1 })}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:border-amber-800 hover:text-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
          >
            <ChevronRight size={16} />
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
            aria-label="صفحه بعد"
            disabled={page >= totalPages}
            onClick={() => onParamsChange({ page: page + 1 })}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:border-amber-800 hover:text-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
