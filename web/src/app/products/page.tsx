'use client'
import ProductsView from "@/components/ProductsView";
import { useProducts } from "@/hooks/productHooks";

export default function Products() {
  const { products, isLoading } = useProducts();

  return (
    <>
      {isLoading ? (
        <p>وایسا....</p>
      ) : (
        <ProductsView
          title="All Products"
          description="Every ritual, every category — the complete collection."
          products={products ?? []}
        />
      )}
    </>
  );
}
