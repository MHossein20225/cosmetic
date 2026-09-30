"use client";

import { use } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";
import ProductsView from "@/components/ProductsView";
import { useCategoriedProducts } from "@/hooks/productHooks";

interface CategoriedProductProps {
  params: Promise<{ category: string }>;
}

export default function CategoriedProduct({ params }: CategoriedProductProps) {
  const { category } = use(params);
  const { categoriedProducts, isLoading, isError } = useCategoriedProducts(
    category
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-16 flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-serif text-gray-900">Category not found</h1>

        <p className="text-sm text-gray-500 max-w-md">
          We couldn&apos;t load &quot;{category}&quot;. It may have been removed
          or renamed.
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
      products={categoriedProducts ?? []}
      description={`${category} Products`}
      categoryLabel={category}
    />
  );
}
