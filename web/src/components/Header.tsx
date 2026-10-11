"use client";

import { useState, useCallback } from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Flower,
  User,
  ChevronDown,
} from "lucide-react";
import { NAV_LINKS } from "@/data";
import NavLinkItem from "./NavLinkItems";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatToman, getProductPrice } from "@/lib/pricing";
import { useAuthUser, useLogOut } from "@/hooks/userHooks";
import { useCart } from "@/hooks/cartHooks";
import { useSearchProducts } from "@/hooks/productHooks";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { products, isFetching } = useSearchProducts({
    search,
    page: 1,
    limit: 8,
  });

  const { user } = useAuthUser();
  const { logOutMutate, isPending: isLoggingOut } = useLogOut();
  const { count: cartCount } = useCart();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const value = search.trim();

      if (!value) return;

      router.push(`/products?search=${encodeURIComponent(value)}`);
    },
    [search, router],
  );

  const clearSearch = useCallback(() => {
    setSearch("");
  }, []);

  const closeMenus = useCallback(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-100/80 bg-rose-50/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-5 px-4 sm:px-6 lg:h-[72px]">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-200 transition-transform duration-200 group-hover:scale-105">
            <Flower
              size={18}
              className="text-amber-800"
              strokeWidth={1.8}
            />
          </span>

          <span className="hidden font-serif text-xl tracking-tight text-gray-900 sm:block">
            فروشگاه زیبایی
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden shrink-0 items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLinkItem key={link.href} link={link} />
          ))}
        </nav>

        {/* Search */}
        <div className="relative ms-auto hidden min-w-0 flex-1 sm:block lg:max-w-[420px]">
          <form
            method="get"
            action="/products"
            onSubmit={handleSearchSubmit}
            className="relative"
          >
            <Search
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              name="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="جست‌وجوی محصولات..."
              aria-label="جست‌وجوی محصولات"
              className="h-10 w-full rounded-full border border-gray-200 bg-white/80 pl-10 pr-10 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-800/10"
            />

            {search && (
              <button
                type="button"
                aria-label="پاک کردن جست‌وجو"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={15} />
              </button>
            )}
          </form>

          {/* Search suggestions */}
          {search.trim() && (
            <div className="absolute inset-x-0 top-12 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              {isFetching ? (
                <div className="px-4 py-5 text-center text-sm text-gray-400">
                  در حال جست‌وجو...
                </div>
              ) : products && products.length > 0 ? (
                <div className="py-2">
                  {products.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={clearSearch}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-rose-50"
                    >
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-rose-50" />
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {product.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatToman(getProductPrice(product))}
                        </p>
                      </div>
                    </Link>
                  ))}

                  <Link
                    href={`/products?search=${encodeURIComponent(search.trim())}`}
                    onClick={clearSearch}
                    className="block border-t border-gray-100 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-amber-800 transition-colors hover:bg-rose-50"
                  >
                    مشاهده همه نتایج
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-600">
                    محصولی پیدا نشد
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    عبارت دیگری را جست‌وجو کنید
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-3 sm:ml-0 sm:gap-4">
          <ThemeToggle />

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={
              cartCount > 0
                ? `سبد خرید، ${cartCount} کالا`
                : "Shopping cart"
            }
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-white hover:text-amber-800"
          >
            <ShoppingBag size={19} strokeWidth={1.8} />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-800 px-1 text-[9px] font-semibold leading-none text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button
                type="button"
                aria-label="منوی حساب کاربری"
                aria-expanded={isUserMenuOpen}
                onClick={() =>
                  setIsUserMenuOpen((open) => !open)
                }
                className="flex h-9 items-center gap-1.5 rounded-full px-2 text-gray-700 transition-colors hover:bg-white hover:text-amber-800"
              >
                <User size={19} strokeWidth={1.8} />

                <ChevronDown
                  size={13}
                  className={`hidden transition-transform sm:block ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="w-60 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xl">
                    {/* User info */}
                    <div className="px-4 py-4">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <div className="border-t border-gray-100" />

                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-rose-50"
                    >
                      سفارش‌های من
                    </Link>

                    {user.role === "ADMIN" && <Link href="/admin" onClick={closeMenus} className="block px-4 py-3 text-sm text-gray-700 hover:bg-rose-50">مدیریت فروشگاه</Link>}
                    <div className="border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={() => logOutMutate()}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-3 text-left text-sm text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50"
                    >
                      {isLoggingOut
                        ? "در حال خروج..."
                        : "خروج از حساب"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-white hover:text-amber-800"
              >
                ورود
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-amber-800 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-amber-900"
              >
                ثبت‌نام
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <button
            type="button"
            aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-white hover:text-amber-800 md:hidden"
          >
            {isMenuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="border-t border-rose-100/70 px-4 py-3 sm:hidden">
        <form
          method="get"
          action="/products"
          onSubmit={handleSearchSubmit}
          className="relative"
        >
          <Search
            size={17}
            className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            name="search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="جست‌وجوی محصولات..."
              aria-label="جست‌وجوی محصولات"
            className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-800/10"
          />

          {search && (
            <button
              type="button"
              aria-label="پاک کردن جست‌وجو"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-700"
            >
              <X size={15} />
            </button>
          )}
        </form>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          isMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-rose-100 bg-rose-50/95 px-4 pb-5 pt-3">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLinkItem
                key={link.href}
                link={link}
                onClickFn={() => setIsMenuOpen(false)}
              />
            ))}
          </div>

          {!user && (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-rose-200 pt-4">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl border border-gray-200 bg-white py-2.5 text-center text-xs font-medium uppercase tracking-wider text-gray-700"
              >
                ورود
              </Link>

              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl bg-amber-800 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
