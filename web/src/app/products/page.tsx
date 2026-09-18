import ProductsView from "@/components/ProductsView";
import { PRODUCTS } from "@/data/data";

export default function Products() {
  return (
    <ProductsView
      title="All Products"
      description="Every ritual, every category — the complete collection."
      products={PRODUCTS}
    />
  );
}
