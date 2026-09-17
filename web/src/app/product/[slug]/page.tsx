"use client";

import { useState } from "react";
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

interface SizeOption {
  id: string;
  label: string;
  sub: string;
  price: number;
}

const SIZE_OPTIONS: SizeOption[] = [
  { id: "30", label: "30 ml", sub: "1.0 fl oz", price: 68 },
  { id: "50", label: "50 ml", sub: "1.7 fl oz", price: 96 },
];

const GALLERY_IMAGES = [
  { src: "/nonProduct.jpg", alt: "Dew Elixir Facial Oil — bottle on pedestal" },
  { src: "/nonProduct.jpg", alt: "Dew Elixir Facial Oil — dropper detail" },
  { src: "/nonProduct.jpg", alt: "Dew Elixir Facial Oil — texture close-up" },
  { src: "/nonProduct.jpg", alt: "Dew Elixir Facial Oil — botanical ingredients" },
];

const INGREDIENTS = [
  {
    title: "Cold-Pressed Rosehip Seed",
    description:
      "Rich in natural trans-retinoic acid, linoleic acid, and vitamin C to refine skin grain and soften early fine lines.",
  },
  {
    title: "Sugar-Cane Squalane",
    description:
      "Weightless lipid mirroring your skin's natural sebum to seal deep cellular hydration without clogging pores.",
  },
  {
    title: "Meadowfoam Seed Oil",
    description:
      "Delivers long-chain antioxidant fatty acids creating a soft barrier that protects skin from environmental stressors.",
  },
];

const RELATED_PRODUCTS = [
  {
    step: "Step 1",
    category: "Hydrating Mist",
    title: "Petal Hydro Mist",
    price: 44,
    image: "/nonProduct.jpg",
  },
  {
    step: "Step 3",
    category: "Cellular Recovery",
    title: "Velvet Barrier Crème",
    price: 74,
    image: "/nonProduct.jpg",
  },
  {
    step: "Ritual Tool",
    category: "Sculpting Stone",
    title: "Blush Quartz Gua Sha",
    price: 36,
    image: "/nonProduct.jpg",
  },
];


export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState<SizeOption>(SIZE_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const total = (selectedSize.price * quantity).toFixed(2);

  function handleQtyChange(delta: number) {
    setQuantity((qty) => Math.min(10, Math.max(1, qty + delta)));
  }

  function handleAddToBag() {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }


  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-gray-500 text-xs uppercase tracking-wider mb-6 flex-wrap">
        <Link href="/" className="hover:text-amber-800 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products/skincare" className="hover:text-amber-800 transition-colors">
          Skincare
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-900">Dew Elixir Facial Oil</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] bg-rose-50 rounded-lg overflow-hidden shadow-sm group">
            <Image
              src={GALLERY_IMAGES[activeImage].src}
              alt={GALLERY_IMAGES[activeImage].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-all duration-700 ease-out"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
              <span className="text-xs uppercase tracking-widest text-amber-800">
                Botanical Formula
              </span>
            </div>
            <button
              type="button"
              aria-label="Zoom image"
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
            >
              <Maximize2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={img.alt}
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
          </div>

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

        {/* Product info */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-amber-800">
                Nourishing Elixir
              </span>
              <div className="flex items-center gap-1 text-gray-900">
                <Star size={16} fill="currentColor" className="text-amber-700" strokeWidth={0} />
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
              Dew Elixir Facial Oil
            </h1>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl text-gray-900">
                ${selectedSize.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">Tax included</span>
            </div>
          </div>

          <p className="text-base text-gray-500 leading-relaxed">
            A restorative, lightweight face oil blending cold-pressed
            rosehip, botanical squalane, and meadowfoam seed oil to impart a
            healthy morning glow without heaviness.
          </p>

          {/* Size selector */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
                Select Volume
              </span>
              <span className="text-xs text-gray-500">
                {selectedSize.label} / {selectedSize.sub}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`flex flex-col items-start p-3 rounded bg-rose-50 text-gray-900 transition-all ${
                    selectedSize.id === size.id
                      ? "ring-2 ring-amber-800"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className="text-base font-semibold">{size.label}</span>
                  <span className="text-xs text-gray-500">
                    {size.sub} · ${size.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + add to bag */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
              Quantity
            </span>
            <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
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

              <button
                type="button"
                onClick={handleAddToBag}
                className={`flex-1 min-w-[180px] py-3 px-4 rounded text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] ${
                  justAdded
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
                    Add to Bag — ${total}
                  </>
                )}
              </button>
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
            {(
              [
                {
                  key: "ingredients",
                  title: "Key Ingredients",
                  content: (
                    <div className="flex flex-col gap-3">
                      {INGREDIENTS.map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-800 mt-2 shrink-0" />
                          <div>
                            <span className="text-sm font-semibold text-gray-900">
                              {item.title}:
                            </span>{" "}
                            <span className="text-sm text-gray-500">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: "usage",
                  title: "The Daily Ritual",
                  content: (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Warm 3–4 drops between your palms and gently press onto
                      slightly damp, freshly cleansed skin morning and night.
                      Sweep upward over the neck and décolletage. Can be
                      blended directly into your favorite mineral sunscreen
                      or foundation for an elevated radiant slip.
                    </p>
                  ),
                },
                {
                  key: "shipping",
                  title: "Shipping & Returns",
                  content: (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Standard carbon-neutral shipping is complimentary on
                      all orders over $50. Orders ship within 24 business
                      hours from our botanical studio. Unopened bottles can
                      be returned within 30 days of receipt.
                    </p>
                  ),
                },
              ] as const
            ).map((section) => (
              <div key={section.key} className="py-3 first:pt-0 last:pb-0">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-serif text-lg text-gray-900 group-hover:text-amber-800 transition-colors">
                    {section.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={"text-gray-500 transition-transform duration-300"}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
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
            href="/products/skincare"
            className="text-xs font-medium uppercase tracking-wider text-amber-800 hover:text-amber-900 transition-colors inline-flex items-center gap-1"
          >
            Explore All Skincare <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {RELATED_PRODUCTS.map((product) => (
            <div
              key={product.title}
              className="bg-rose-50 rounded-lg p-4 flex flex-col group transition-all duration-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/5] bg-white rounded overflow-hidden mb-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-sm text-[10px] uppercase text-gray-900">
                  {product.step}
                </span>
              </div>
              <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                {product.category}
              </span>
              <h3 className="font-serif text-lg text-gray-900 mb-2">
                {product.title}
              </h3>
              <span className="text-base font-semibold text-gray-900 mt-auto">
                ${product.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}