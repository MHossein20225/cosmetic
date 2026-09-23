import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-rose-50">
        <Image
          src={category.image || "/nonProduct.jpg"}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif text-xl text-gray-900 tracking-tight group-hover:text-amber-800 transition-colors">
            {category.name}
          </h3>
        </div>
        <div className="pt-6 mt-4 flex items-center gap-1 text-xs font-medium uppercase tracking-[0.15em] text-amber-800 group-hover:gap-2 transition-all">
          <span>Discover</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </article>
  );
}
