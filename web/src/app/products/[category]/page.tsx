"use client";

import { use } from "react";
import Loading from "@/components/Loading";
import ProductsView from "@/components/ProductsView";
import { useCategoriedProducts } from "@/hooks/productHooks";

interface CategoriedProductProps {
  params: Promise<{ category: string }>;
}

export default function CategoriedProduct({ params }: CategoriedProductProps) {
  const { category } = use(params);
  const { categoriedProducts, isLoading } = useCategoriedProducts(category);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ProductsView
      title={`${category} Products`}
      products={categoriedProducts ?? []}
      categoryLabel={category}
    />
  );
}