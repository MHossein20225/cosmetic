import CategoryCard, {type Category} from "./CategoryCard";



const categories: Category[] = [
  {
    id: "skincare",
    title: "Skincare",
    description:
      "Hydrating serums, botanical oils, and gentle cleansing balms formulated for deep barrier restoration.",
    count: "18 Products",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRpP1bSSV8_GmKGs2kJO0S4OsoiB4teVJIKZ_MkFISTBJsmHd8CUqFnKLoWpRKI5FwQszLVzVrk8w1GuXkSszg1GVn_TsgE44RuUYZcUPJ52a00yPUez7r0c1PaSlU40-Lw8GraQwTT0erpihaio9K697WBhc8INNTpDGEvKPcUuta_7PoRnBqborFupdHkzIdQ8FSGc-DpHEelGNbzKqvMQdg8tVrd1724S-B3RplWFI4RfKO6CnA6A",
  },
  {
    id: "makeup",
    title: "Makeup",
    description:
      "Featherlight tints, sheer luminizers, and dewy flush balms that enhance innate complexion.",
    count: "12 Products",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwb6IEENjs3ZCsfuWJKqXSzCrYVemb3mCEC4d_KOTo8AeaQOyrqHOcX2eIhy561O1K_dpH6rGl2sW7vuAdIO7Smazf2ASfwUVVRK1ImJJZYaIliO1AYI5ZIjgONZWbsDelr3OPRXgHgrW2fm5VzfyCflReOuMERwIWackdGgaGJcBRcjgYOo7KYs00eagyJ50Fi-i7HJk1jucB3Ng_4x-hshhCIZk0BdEhxOxUURhu0q5dkXANsYJUaA",
  },
  {
    id: "fragrance",
    title: "Fragrance",
    description:
      "Subtle botanical notes, warm cedarwood undertones, and ethereal hints of morning dewy rose.",
    count: "8 Fragrances",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5RmMa_k2LWEPuXdp2iTevFRXd02nEcBxbZvFW7csGdzaa7D-R2jG_huw3kC8bb3hglC7n75WgohccbovIa8xqWfL2x0bTKhryg0X15hSBYnsNX23P0YYzEMtHjW775bwb-f6wJHBIKPAm7BPNuPI1ofBwP-UPSnkfh_zY24ynbiqRuobWh09qMqSUvN0yoQW2bWGKwV84butxTTlRlBk1A0bLXiMkqp1Ngpy82i7_UpcN3OmfOtmKNw",
  },
  {
    id: "bath-body",
    title: "Bath & Body",
    description:
      "Silkening body washes and whipped body soufflés infused with skin-loving botanical squalane.",
    count: "10 Formulas",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYAF2LpBQMlkSXAXzJpDz8UedblG1XOcHALstI_I6YkjEe6-wbAASs_Ax8ddQkiK3RF9NgfKzUxayfR7aVY_0Ps0JB2g35IxC5F4G_9-rtl1GgJzlps3TqbTSc_WiWGb6hp1Vd5DvBJ07JfxoaOHdcVAlm_aZk1fFckC8jlxX5HWX6WDDExaQ5I2jT55O-oynC1XxhyJwBrPhLpbCoxm3SGxsZeTPjoK7xbF3OWVg776BwhG7suxy_Ug",
  },
];

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
            {categories.map((category, i) => (
              <CategoryCard key={category.id} category={category} index={i} />
            ))}
          </div>
        </section>

    )
}