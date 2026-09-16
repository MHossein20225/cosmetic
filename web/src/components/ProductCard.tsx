import { ShoppingBag, Star } from "lucide-react";
import type { ProductCardProps } from "@/data/types";
import Image from "next/image";
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      key={product.id}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-rose-50">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <button
          type="button"
          aria-label={`Add ${product.title} to cart`}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-800 hover:text-white"
        >
          <ShoppingBag size={16} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-wider text-gray-400">
          {product.category}
        </span>
        <h3 className="font-serif text-lg text-gray-900 leading-snug">
          {product.title}
        </h3>

        <div className="flex items-center gap-1 text-amber-700">
          <Star size={12} fill="currentColor" strokeWidth={0} />
          <span className="text-xs text-gray-600">
            {product.rating}{" "}
            <span className="text-gray-400">({product.reviews})</span>
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
