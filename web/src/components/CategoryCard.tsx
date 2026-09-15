import { ArrowUpRight } from "lucide-react";

export interface Category {
  id: string;
  title: string;
  description: string;
  count: string;
  image: string;
}

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <article className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-rose-50">
        <img
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          alt={category.title}
          src={category.image}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full">
          <span className="text-xs text-gray-500 tracking-wider uppercase">
            {category.count}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif text-xl text-gray-900 tracking-tight group-hover:text-amber-800 transition-colors">
            {category.title}
          </h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {category.description}
          </p>
        </div>
        <div className="pt-6 mt-4 flex items-center justify-between">
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-[0.15em] text-amber-800 flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            <span>Discover</span>
            <ArrowUpRight size={14} />
          </a>
          {typeof index === "number" && (
            <span className="text-gray-300 text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
