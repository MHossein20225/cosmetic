import { ShoppingBag, ArrowUpRight, Star } from "lucide-react";
const products = [
  {
    id: "botanical-gold-oil",
    category: "Skincare",
    title: "Botanical Gold Facial Oil",
    price: 48,
    oldPrice: null,
    rating: 4.8,
    reviews: 126,
    badge: "Bestseller",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRpP1bSSV8_GmKGs2kJO0S4OsoiB4teVJIKZ_MkFISTBJsmHd8CUqFnKLoWpRKI5FwQszLVzVrk8w1GuXkSszg1GVn_TsgE44RuUYZcUPJ52a00yPUez7r0c1PaSlU40-Lw8GraQwTT0erpihaio9K697WBhc8INNTpDGEvKPcUuta_7PoRnBqborFupdHkzIdQ8FSGc-DpHEelGNbzKqvMQdg8tVrd1724S-B3RplWFI4RfKO6CnA6A",
  },
  {
    id: "dewy-flush-blush",
    category: "Makeup",
    title: "Dewy Flush Blush",
    price: 32,
    oldPrice: null,
    rating: 4.6,
    reviews: 84,
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwb6IEENjs3ZCsfuWJKqXSzCrYVemb3mCEC4d_KOTo8AeaQOyrqHOcX2eIhy561O1K_dpH6rGl2sW7vuAdIO7Smazf2ASfwUVVRK1ImJJZYaIliO1AYI5ZIjgONZWbsDelr3OPRXgHgrW2fm5VzfyCflReOuMERwIWackdGgaGJcBRcjgYOo7KYs00eagyJ50Fi-i7HJk1jucB3Ng_4x-hshhCIZk0BdEhxOxUURhu0q5dkXANsYJUaA",
  },
  {
    id: "aura-nocturne-edp",
    category: "Fragrance",
    title: "Aura Nocturne EDP",
    price: 86,
    oldPrice: 98,
    rating: 4.9,
    reviews: 203,
    badge: "Sale",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5RmMa_k2LWEPuXdp2iTevFRXd02nEcBxbZvFW7csGdzaa7D-R2jG_huw3kC8bb3hglC7n75WgohccbovIa8xqWfL2x0bTKhryg0X15hSBYnsNX23P0YYzEMtHjW775bwb-f6wJHBIKPAm7BPNuPI1ofBwP-UPSnkfh_zY24ynbiqRuobWh09qMqSUvN0yoQW2bWGKwV84butxTTlRlBk1A0bLXiMkqp1Ngpy82i7_UpcN3OmfOtmKNw",
  },
  {
    id: "whipped-body-souffle",
    category: "Bath & Body",
    title: "Whipped Body Soufflé",
    price: 28,
    oldPrice: null,
    rating: 4.7,
    reviews: 59,
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYAF2LpBQMlkSXAXzJpDz8UedblG1XOcHALstI_I6YkjEe6-wbAASs_Ax8ddQkiK3RF9NgfKzUxayfR7aVY_0Ps0JB2g35IxC5F4G_9-rtl1GgJzlps3TqbTSc_WiWGb6hp1Vd5DvBJ07JfxoaOHdcVAlm_aZk1fFckC8jlxX5HWX6WDDExaQ5I2jT55O-oynC1XxhyJwBrPhLpbCoxm3SGxsZeTPjoK7xbF3OWVg776BwhG7suxy_Ug",
  },
];

const badgeStyles = {
  Bestseller: "bg-amber-800 text-white",
  New: "bg-emerald-700 text-white",
  Sale: "bg-rose-600 text-white",
};

export default function ProductSection(){
    return (
        <section className="w-full max-w-[1360px] mx-auto px-6 pb-16 md:pb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-3 border-b border-gray-200">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 block mb-1">
                Bestsellers
              </span>
              <h2 className="font-serif text-3xl text-gray-900">
                Featured Products
              </h2>
            </div>
            <a
              href="#"
              className="text-xs font-medium uppercase tracking-[0.15em] text-amber-800 flex items-center gap-1 mt-2 md:mt-0 hover:gap-2 transition-all"
            >
              <span>View All</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    alt={product.title}
                    src={product.image}
                    loading="lazy"
                  />

                  {product.badge && (
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full ${
                        badgeStyles[product.badge]
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label={`Add ${product.title} to cart`}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-800 hover:text-white"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>

                <div className="p-5 flex flex-col gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-lg text-gray-900 leading-snug">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-1 text-amber-700">
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                    <span className="text-xs text-gray-600">
                      {product.rating}{" "}
                      <span className="text-gray-400">
                        ({product.reviews})
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
    )
}