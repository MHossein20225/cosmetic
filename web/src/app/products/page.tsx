'use client'
import Loading from "@/components/Loading";
import ProductsView from "@/components/ProductsView";
import { useProducts } from "@/hooks/productHooks";

export default function Products() {
  const { products, isLoading } = useProducts();

  return (
    <>
      {isLoading ? (
        <Loading/>
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
