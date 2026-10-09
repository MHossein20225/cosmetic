'use client'
import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/Loading";
import ProductsView from "@/components/ProductsView";
import { useSearchProducts } from "@/hooks/productHooks";
import type { ProductSort, SearchProductsParams } from "@/types";

export default function Products() {
  return <Suspense fallback={<Loading />}><ProductsFromUrl /></Suspense>;
}

function ProductsFromUrl() {
  const searchParams = useSearchParams();
  return <ProductsContent key={searchParams.toString()} initialSearch={searchParams.get("search") ?? ""} />;
}

function ProductsContent({ initialSearch }: { initialSearch: string }) {
  const [params, setParams] = useState<SearchProductsParams>({
    page: 1,
    limit: 12,
    search: initialSearch,
  });

  const { products, result, isLoading, isFetching, isError } = useSearchProducts(params);

  const handleParamsChange = useCallback(
    (next: { search?: string; sort?: ProductSort; page?: number }) => {
      setParams((current) => ({ ...current, ...next }));
    },
    []
  );

  if (isLoading) {
    return <Loading/>;
  }

  if (isError) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-16 flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-serif text-gray-900">
          Couldn&apos;t load products
        </h1>

        <p className="text-sm text-gray-500 max-w-md">
          Something went wrong while fetching the collection. Please try again.
        </p>

        <Link
          href="/"
          className="text-sm text-amber-800 hover:text-amber-900"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <ProductsView
      title="All Products"
      description="Every ritual, every category — the complete collection."
      products={products ?? []}
      result={result}
      sort={params.sort}
      search={params.search}
      isFetching={isFetching}
      onParamsChange={handleParamsChange}
    />
  );
}
