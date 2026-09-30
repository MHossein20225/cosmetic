"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Sprout,
  ShieldCheck,
  Recycle,
  Leaf,
  ArrowRight,
} from "lucide-react";

import { useCategoriedProducts, useProduct } from "@/hooks/productHooks";
import { useAuthUser } from "@/hooks/userHooks";
import { useAddToCart } from "@/hooks/cartHooks";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const { id } = use(params);

  const { product, isLoading, error } = useProduct(Number(id));

  const { categoriedProducts } = useCategoriedProducts(product?.category.name);

  const { user } = useAuthUser();

  const { addToCartMutate, isPending } = useAddToCart();

  function handleQtyChange(delta: number) {
    setQuantity((qty) => Math.min(10, Math.max(1, qty + delta)));
  }

  function handleAddToBag() {
    setJustAdded(true);

    addToCartMutate({ productId: Number(id), quantity });

    setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-serif text-gray-900">Product not found</h1>

        <Link
          href="/products"
          className="text-sm text-amber-800 hover:text-amber-900"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const total = product.price * quantity;
  const categoryName = product.category?.name;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-gray-500 text-xs uppercase tracking-wider mb-6 flex-wrap">
        <Link href="/" className="hover:text-amber-800 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/products/${product.category.name}`}
          className="hover:text-amber-800 transition-colors"
        >
          {product.category.name}
        </Link>

        <ChevronRight size={12} />

        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] bg-rose-50 rounded-lg overflow-hidden shadow-sm group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-all duration-700 ease-out"
            />

            {/* Product label */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
              <span className="text-xs uppercase tracking-widest text-amber-800">
                {product.category.name}
              </span>
            </div>

            {/* Zoom button */}
            <button
              type="button"
              aria-label="Zoom image"
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
            >
              <Maximize2 size={18} />
            </button>
          </div>

          {/* Thumbnail images
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={img.alt + i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative aspect-square rounded overflow-hidden bg-rose-50 transition-all ${
                  activeImage === i
                    ? "ring-2 ring-amber-800"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div> */}

          {/* Trust badges */}
          <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-3 p-4 bg-rose-50 rounded-lg text-center">
            <div className="flex flex-col items-center gap-1">
              <Sprout size={20} className="text-amber-800" />

              <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-gray-900">
                100% Botanical
              </span>

              <span className="text-xs text-gray-500 hidden sm:block">
                Cold-pressed actives
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={20} className="text-amber-800" />

              <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-gray-900">
                Dermatologist Tested
              </span>

              <span className="text-xs text-gray-500 hidden sm:block">
                Sensitive skin safe
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Recycle size={20} className="text-amber-800" />

              <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-gray-900">
                Infinite Glass
              </span>

              <span className="text-xs text-gray-500 hidden sm:block">
                100% recyclable
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRODUCT INFO
        ====================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Product title + price */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-amber-800">
                {product.category.name}
              </span>

              {/* Rating */}
              <div className="flex items-center gap-1 text-gray-900">
                <Star
                  size={16}
                  fill="currentColor"
                  className="text-amber-700"
                  strokeWidth={0}
                />

                <span className="text-sm font-semibold">4.9</span>

                <a
                  href="#reviews"
                  className="text-xs text-gray-500 hover:text-amber-800 transition-colors ml-1"
                >
                  (124 reviews)
                </a>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 tracking-tight mt-1">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl text-gray-900">
                ${product.price.toFixed(2)}
              </span>

              <span className="text-xs text-gray-500">Tax included</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-base text-gray-500 leading-relaxed">
            {product.description}
          </p>

          {/* Discount */}
          {product.discount > 0 && (
            <div className="flex items-center gap-2">
              <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-semibold">
                {product.discount}% OFF
              </span>

              <span className="text-sm text-gray-500">Limited time offer</span>
            </div>
          )}

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
              Quantity
            </span>

            <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
              {/* Quantity selector */}
              <div className="flex items-center bg-rose-50 rounded p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => handleQtyChange(-1)}
                  className="w-9 h-9 rounded flex items-center justify-center text-gray-900 hover:bg-white transition-colors"
                >
                  <Minus size={16} />
                </button>

                <span className="w-10 text-center text-base font-semibold text-gray-900 select-none">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => handleQtyChange(1)}
                  className="w-9 h-9 rounded flex items-center justify-center text-gray-900 hover:bg-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={`flex-1 min-w-[180px] py-3 px-4 rounded text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] ${
                    justAdded && isPending
                      ? "bg-rose-200 text-amber-900"
                      : "bg-amber-800 text-white hover:bg-amber-900"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check size={18} />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Add to Bag — ${total.toFixed(2)}
                    </>
                  )}
                </button>
              ) : (
                <Link href="/login">
                  <button
                    type="button"
                    onClick={handleAddToBag}
                    className={
                      "flex-1 min-w-[180px] py-3 px-4 rounded text-xs font-medium uppercase tracking-wider bg-amber-800 text-white hover:bg-amber-900 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                    }
                  >
                    you have to log in
                  </button>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-1 text-gray-500 text-xs">
              <Leaf size={14} className="text-amber-800" />

              <span>
                Complimentary signature organic samples with every order
              </span>
            </div>
          </div>

          {/* Accordions */}
          <div className="flex flex-col bg-white rounded-lg p-4 shadow-sm divide-y divide-gray-100">
            {/* Ingredients */}
            <div className="py-3 first:pt-0">
              <button
                type="button"
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="font-serif text-lg text-gray-900 group-hover:text-amber-800 transition-colors">
                  Product Details
                </span>

                <ChevronDown size={18} className="text-gray-500" />
              </button>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">
                {product.description}
              </p>
            </div>

            {/* Usage */}
            <div className="py-3">
              <button
                type="button"
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="font-serif text-lg text-gray-900 group-hover:text-amber-800 transition-colors">
                  The Daily Ritual
                </span>

                <ChevronDown size={18} className="text-gray-500" />
              </button>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">
                Use the product according to its intended purpose. Follow the
                product instructions provided with your order.
              </p>
            </div>

            {/* Shipping */}
            <div className="py-3 last:pb-0">
              <button
                type="button"
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="font-serif text-lg text-gray-900 group-hover:text-amber-800 transition-colors">
                  Shipping & Returns
                </span>

                <ChevronDown size={18} className="text-gray-500" />
              </button>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">
                Standard shipping is available on all orders. Please check your
                store&apos;s shipping and return policy for details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RELATED PRODUCTS
      ====================================================== */}
      <div className="mt-16 pt-8 md:pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-amber-800">
              Harmonious Pairings
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 mt-1">
              Complete the Radiance Ritual
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs font-medium uppercase tracking-wider text-amber-800 hover:text-amber-900 transition-colors inline-flex items-center gap-1"
          >
            Explore All Products
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(categoriedProducts ?? []).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-rose-50 rounded-lg p-4 flex flex-col group transition-all duration-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/5] bg-white rounded overflow-hidden mb-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                {categoryName}
              </span>

              <h3 className="font-serif text-lg text-gray-900 mb-2">
                {product.name}
              </h3>

              <span className="text-base font-semibold text-gray-900 mt-auto">
                ${product.price.toFixed(2)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
