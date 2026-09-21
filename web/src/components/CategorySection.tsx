import CategoryCard from "./CategoryCard";
export default function CategorySection() {
    return(
        <section className="w-full max-w-[1360px] mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-3 border-b border-gray-200">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 block mb-1">
                Curation
              </span>
              <h2 className="font-serif text-3xl text-gray-900">
                Categories of Practice
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              4 Core Rituals · 48 Minimal Essentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))} */}
          </div>
        </section>
    )
}