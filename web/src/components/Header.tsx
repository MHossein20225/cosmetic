"use client";

import { useState } from "react";
import { Search, ShoppingBag, Menu, X, Flower, User } from "lucide-react";
import { NAV_LINKS } from "@/data";
import NavLinkItem from "./NavLinkItems";
import Link from "next/link";
import { useAuthUser } from "@/hooks/userHooks";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthUser();

  return (
    <header className="w-full bg-rose-50/60 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-[1360px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-rose-200 flex items-center justify-center">
            <span className="text-amber-800 text-lg">
              <Flower size={18} />
            </span>
          </span>
          <span className="font-serif text-xl text-gray-900">Store Name</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLinkItem key={link.href} link={link} />
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <button
            aria-label="Search"
            className="text-gray-700 hover:text-amber-800 transition-colors"
          >
            <Search size={20} />
          </button>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-gray-700 hover:text-amber-800 transition-colors"
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Link>

          {user ? (
            <User />
          ) : (
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider">
              <Link
                href="/login"
                className="text-gray-700 hover:text-amber-800 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-amber-800 text-white px-3 py-2 rounded hover:bg-amber-900 transition-colors"
              >
                Register
              </Link>
            </div>
          )}

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
          {NAV_LINKS.map((link) => (
            <NavLinkItem
              key={link.href}
              link={link}
              onClickFn={() => setIsMenuOpen(false)}
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
