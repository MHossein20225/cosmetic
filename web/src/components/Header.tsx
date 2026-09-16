import { User, Search, ShoppingBag } from "lucide-react";
export default function Header() {
  return (
    <header className="w-full bg-rose-50/60 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-[1360px] mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-rose-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-800 text-lg">
              spa
            </span>
          </span>
          <span className="font-serif text-xl text-gray-900">Store Name</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-wider text-amber-800"
          >
            Home
          </a>
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors"
          >
            Shop All
          </a>
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors"
          >
            Skincare
          </a>
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors"
          >
            Makeup
          </a>
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors"
          >
            Fragrance
          </a>
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors"
          >
            Bath &amp; Body
          </a>
        </nav>

        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            className="text-gray-700 hover:text-amber-800 transition-colors"
          >
            <Search />
          </button>
          <button
            aria-label="Cart"
            className="relative text-gray-700 hover:text-amber-800 transition-colors"
          >
            <ShoppingBag />
            <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <button
            aria-label="Account"
            className="w-8 h-8 rounded-full overflow-hidden bg-rose-200 flex justify-center items-center"
          >
            <User className="text-amber-800" />
          </button>
        </div>
      </div>
    </header>
  );
}
