"use client";

import { use, useCallback, useState } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";
import ProductsView from "@/components/ProductsView";
import { useSearchProducts } from "@/hooks/productHooks";
import type { ProductSort, SearchProductsParams } from "@/types";

interface CategoriedProductProps {
  params: Promise<{ category: string }>;
}

export default function CategoriedProduct({ params }: CategoriedProductProps) {
  const { category: rawCategory } = use(params);

  const category = decodeURIComponent(rawCategory);

  const [searchParams, setSearchParams] = useState<SearchProductsParams>({
    page: 1,
    limit: 12,
    category,
  });

  const { products, result, isLoading, isFetching, isError } = useSearchProducts(searchParams);

  const handleParamsChange = useCallback(
    (next: { search?: string; sort?: ProductSort; page?: number }) => {
      setSearchParams((current) => ({ ...current, ...next }));
    },
    []
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-16 flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-serif text-gray-900">
          Couldn&apos;t load products
        </h1>

        <p className="text-sm text-gray-500 max-w-md">
          Something went wrong while fetching this category. Please try again.
        </p>

        <Link
          href="/products"
          className="text-sm text-amber-800 hover:text-amber-900"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <ProductsView
      title={`${category} Products`}
      products={products ?? []}
      result={result}
      sort={searchParams.sort}
      description={`${category} Products`}
      categoryLabel={category}
      isFetching={isFetching}
      onParamsChange={handleParamsChange}
    />
  );
}
