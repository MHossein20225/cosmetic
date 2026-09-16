"use client";

import { useState } from "react";
import { User, Search, ShoppingBag, Menu, X, Flower } from "lucide-react";
import { NAV_LINKS } from "@/data/data";
import { usePathname } from "next/navigation";


export default function Header() {
  const pathName = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-rose-50/60 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-[1360px] mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-rose-200 flex items-center justify-center">
            <span className="text-amber-800 text-lg"><Flower/></span>
          </span>
          <span className="font-serif text-xl text-gray-900">Store Name</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                link.href === pathName
                  ? "text-amber-800"
                  : "text-gray-700 hover:text-amber-800"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <button
            aria-label="Search"
            className="text-gray-700 hover:text-amber-800 transition-colors"
          >
            <Search size={20} />
          </button>
          <button
            aria-label="Cart"
            className="relative text-gray-700 hover:text-amber-800 transition-colors"
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <button
            aria-label="Account"
            className="w-8 h-8 rounded-full overflow-hidden bg-rose-200 flex justify-center items-center flex-shrink-0"
          >
            <User size={16} className="text-amber-800" />
          </button>

          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden text-gray-700 hover:text-amber-800 transition-colors"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 pb-4 pt-2 border-t border-rose-200/60 bg-rose-50/95">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`py-2.5 text-sm font-medium uppercase tracking-wider transition-colors ${
                i === 0
                  ? "text-amber-800"
                  : "text-gray-700 hover:text-amber-800"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}