import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { ProductCardProduct } from "@/data/types";

interface ProductsViewProps {
  title: string;
  description?: string;
  products: ProductCardProduct[];
  categoryLabel?: string;
}

export default function ProductsView({
  title,
  description,
  products,
  categoryLabel,
}: ProductsViewProps) {
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

      <div className="mb-10 pb-3 border-b border-gray-200">
        <h1 className="font-serif text-3xl sm:text-4xl text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 mt-2 max-w-xl">{description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

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
    </div>
  );
}
