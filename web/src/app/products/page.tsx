import ProductCard from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/data/data";




export default function Products() {

  return (
    <main className="w-full min-h-screen pt-20 bg-[#fff8f6]">
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#ffdad3]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-[#fddbd2]/30 rounded-full blur-3xl pointer-events-none" />

        <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-16 pb-6 sm:pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 pb-6 sm:pb-8">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-1 sm:gap-2 text-[#8b4e40]">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest">
                  Rituals &amp; Formulations
                </span>
                <span className="w-8 h-[1px] bg-[#8b4e40]/40" />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#534340]">
                  Clean Botanicals
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1f1b1a]">
                Skincare &amp; Cosmetics
              </h1>
              <p className="font-sans text-sm sm:text-base leading-6 text-[#534340]">
                Intentional formulas sculpted with botanical lipid complexes,
                bioactive extracts, and soft mineral pigments for luminous,
                sovereign skin.
              </p>
            </div>
          </div>

          <div className="bg-[#fcf1ef] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={"px-3 sm:px-4 py-1.5 rounded-lg font-sans text-[11px] font-semibold uppercase tracking-wider transition-all text-[#534340] hover:text-[#1f1b1a]"
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#85736f] hidden sm:inline">
                Sort:
              </span>
              <div className="relative">
                {/* filter */}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 flex flex-col items-center justify-center gap-4 sm:gap-5">
            <div className="w-full max-w-48 h-1 bg-[#f0e6e4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8b4e40] rounded-full transition-all duration-500"
              />
            </div>
        
              <button
                className="mt-1 px-6 sm:px-8 py-2 bg-[#fcf1ef] hover:bg-[#f6ecea] text-[#1f1b1a] font-sans text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                type="button"
              >
                <span>Load Remaining Rituals</span>
                <span className="material-symbols-outlined text-[18px]">
                  keyboard_arrow_down
                </span>
              </button>
            
          </div>
        </section>
      </div>
    </main>
  );
}