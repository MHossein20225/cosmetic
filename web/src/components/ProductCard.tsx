import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  getProductPrice,
  getStockLabel,
  hasDiscount,
  isOutOfStock,
} from "@/lib/pricing";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const discounted = hasDiscount(product.discount);
  const outOfStock = isOutOfStock(product.stock);

  return (
    <Link key={product.id} href={`/product/${product.id}`}>
      <article className="group flex flex-col bg-white rounded-xl p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="relative w-full aspect-[4/5] bg-[#fcf1ef] rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={product.imageUrl || "/images/nonProduct.jpg"}
            alt={product.name}
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
              outOfStock ? "opacity-60" : ""
            }`}
          />

          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col items-start gap-1.5">
            {discounted && (
              <span className="bg-amber-800 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}

            {outOfStock && (
              <span className="bg-gray-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
                Out of stock
              </span>
            )}
          </div>

          <div className="absolute inset-x-2 sm:inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              disabled={outOfStock}
              className="w-full bg-[#8b4e40] text-white font-sans text-[11px] font-semibold uppercase tracking-wider py-2.5 rounded shadow-sm hover:bg-[#58261b] transition-colors flex items-center justify-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
              type="button"
            >
              {outOfStock ? "Out of stock" : "Add to Bag"}
            </button>
          </div>
        </div>

        <div className="pt-4 pb-1 px-1 flex flex-col flex-1 justify-between gap-1.5">
          <div>
            <h2 className="font-serif text-lg sm:text-xl text-[#1f1b1a] group-hover:text-[#8b4e40] transition-colors">
              {product.name}
            </h2>
            <p className="font-sans text-xs sm:text-sm leading-5 text-[#534340] mt-1">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-sans text-base sm:text-lg font-semibold text-[#1f1b1a]">
                <span className="text-[#85736f]">$</span>
                {getProductPrice(product).toFixed(2)}
                {discounted && (
                  <span className="text-xs font-normal text-[#85736f] line-through ml-2">
                    {product.price.toFixed(2)}
                  </span>
                )}
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#85736f] mt-1">
              {getStockLabel(product.stock)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
