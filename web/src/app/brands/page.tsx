import { BRANDS } from "@/data/data";
import Image from "next/image";

export default function BrandsPage() {
  return (
    <main className="w-full min-h-screen bg-[#faf9f7]">
      {/* Brands Section */}
      <section className="w-full max-w-[1360px] mx-auto px-6 py-16 md:py-24">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 block mb-2">
              The Collection
            </span>

            <h1 className="font-serif text-3xl md:text-4xl text-gray-900">
              Cosmetic Brands
            </h1>
          </div>

          <p className="text-sm text-gray-500 mt-3 md:mt-0">
            8 Selected Brands · Modern Beauty
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANDS.map((brand) => (
            <article key={brand.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ece8]">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

                {/* Bottom Content */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4">
                  {/* Brand Name */}
                  <h2 className="font-serif text-2xl md:text-3xl text-white drop-shadow-md">
                    {brand.name}
                  </h2>

                  {/* Explore Button */}
                  <button
                    type="button"
                    className="
                    shrink-0
                    inline-flex items-center gap-2
                    bg-white/95 backdrop-blur-sm
                    px-4 py-3
                    text-xs font-medium uppercase tracking-[0.15em]
                    text-gray-900
                    opacity-0
                    translate-y-2
                    pointer-events-none
                    transition-all duration-300
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    group-hover:pointer-events-auto
                    hover:bg-white"
                  >
                    <span>Explore</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom Intro */}
      <section className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
              Curated Beauty
            </span>

            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-gray-900 leading-tight">
              Discover brands built around thoughtful beauty.
            </h2>

            <p className="mt-5 text-sm md:text-base leading-7 text-gray-500 max-w-xl">
              Explore a carefully selected collection of cosmetic brands, from
              everyday skincare to expressive color cosmetics. Each brand brings
              its own approach to modern beauty and personal ritual.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
