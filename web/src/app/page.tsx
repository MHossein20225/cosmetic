export default function Home() {
  return (
    <>
      <header className="w-full bg-rose-50/60 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-[1360px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-rose-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-800 text-lg">
                spa
              </span>
            </span>
            <span className="font-serif text-xl text-gray-900">Store Name</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-xs font-medium uppercase tracking-wider text-amber-800">
              Home
            </a>
            <a href="#" className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors">
              Shop All
            </a>
            <a href="#" className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors">
              Skincare
            </a>
            <a href="#" className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors">
              Makeup
            </a>
            <a href="#" className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors">
              Fragrance
            </a>
            <a href="#" className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-amber-800 transition-colors">
              Bath &amp; Body
            </a>
          </nav>

          <div className="flex items-center gap-5">
            <button aria-label="Search" className="text-gray-700 hover:text-amber-800 transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button aria-label="Cart" className="relative text-gray-700 hover:text-amber-800 transition-colors">
              <span className="material-symbols-outlined">shopping_bag</span>
              <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <button aria-label="Account" className="w-8 h-8 rounded-full overflow-hidden bg-rose-200">
              <span className="material-symbols-outlined text-amber-800 text-lg leading-8">
                person
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <div>
          <section className="relative w-full bg-rose-100/50 overflow-hidden py-16 md:py-32">
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-rose-200/30 blur-3xl pointer-events-none"></div>
            <div className="absolute left-1/4 -bottom-20 w-80 h-80 rounded-full bg-white/40 blur-2xl pointer-events-none"></div>
            <div className="relative max-w-[1360px] mx-auto px-6 flex flex-col items-center text-center">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-800 mb-3">
                Botanical Formulation &amp; Intent
              </span>
              <h1 className="font-serif text-4xl md:text-6xl text-gray-900 max-w-2xl mx-auto tracking-tight font-normal leading-tight">
                Pure Rituals,{" "}
                <span className="italic font-normal text-amber-800">
                  Quiet Luxury
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 max-w-lg mt-4 mb-8">
                Thoughtful formulations crafted for luminous skin and
                intentional daily beauty rituals.
              </p>
              <a
                className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-gray-900 hover:text-amber-800 transition-colors pb-1"
                data-path="shop-all"
                href="#"
              >
                <span>Explore Collection</span>
                <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
            </div>
          </section>

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
              <article className="group relative flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt="Minimalist frosted glass dropper bottle filled with golden botanical oil standing gracefully on light cream travertine stone bathed in soft natural morning sunlight with subtle blush rose undertones."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRpP1bSSV8_GmKGs2kJO0S4OsoiB4teVJIKZ_MkFISTBJsmHd8CUqFnKLoWpRKI5FwQszLVzVrk8w1GuXkSszg1GVn_TsgE44RuUYZcUPJ52a00yPUez7r0c1PaSlU40-Lw8GraQwTT0erpihaio9K697WBhc8INNTpDGEvKPcUuta_7PoRnBqborFupdHkzIdQ8FSGc-DpHEelGNbzKqvMQdg8tVrd1724S-B3RplWFI4RfKO6CnA6A"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded">
                    <span className="text-xs text-gray-500 tracking-wider uppercase">
                      18 Products
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-serif text-xl text-gray-900 tracking-tight group-hover:text-amber-800 transition-colors">
                      Skincare
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Hydrating serums, botanical oils, and gentle cleansing
                      balms formulated for deep barrier restoration.
                    </p>
                  </div>
                  <div className="pt-6 mt-4 flex items-center justify-between">
                    <a
                      className="text-xs font-medium uppercase tracking-[0.15em] text-amber-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                      data-path="skincare"
                      href="#"
                    >
                      <span>Discover</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_outward
                      </span>
                    </a>
                    <span className="text-gray-300 text-xs">01</span>
                  </div>
                </div>
              </article>

              <article className="group relative flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt="Editorial still life of translucent neutral makeup cream blush compact and rose gold applicator resting on gentle pink silk background with delicate shadows."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwb6IEENjs3ZCsfuWJKqXSzCrYVemb3mCEC4d_KOTo8AeaQOyrqHOcX2eIhy561O1K_dpH6rGl2sW7vuAdIO7Smazf2ASfwUVVRK1ImJJZYaIliO1AYI5ZIjgONZWbsDelr3OPRXgHgrW2fm5VzfyCflReOuMERwIWackdGgaGJcBRcjgYOo7KYs00eagyJ50Fi-i7HJk1jucB3Ng_4x-hshhCIZk0BdEhxOxUURhu0q5dkXANsYJUaA"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded">
                    <span className="text-xs text-gray-500 tracking-wider uppercase">
                      12 Products
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-serif text-xl text-gray-900 tracking-tight group-hover:text-amber-800 transition-colors">
                      Makeup
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Featherlight tints, sheer luminizers, and dewy flush balms
                      that enhance innate complexion.
                    </p>
                  </div>
                  <div className="pt-6 mt-4 flex items-center justify-between">
                    <a
                      className="text-xs font-medium uppercase tracking-[0.15em] text-amber-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                      data-path="makeup"
                      href="#"
                    >
                      <span>Discover</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_outward
                      </span>
                    </a>
                    <span className="text-gray-300 text-xs">02</span>
                  </div>
                </div>
              </article>

              <article className="group relative flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt="Luxury amber and rose tinted square perfume bottle with a minimalist embossed cap resting beside dried rose petals on textured ivory linen surface."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5RmMa_k2LWEPuXdp2iTevFRXd02nEcBxbZvFW7csGdzaa7D-R2jG_huw3kC8bb3hglC7n75WgohccbovIa8xqWfL2x0bTKhryg0X15hSBYnsNX23P0YYzEMtHjW775bwb-f6wJHBIKPAm7BPNuPI1ofBwP-UPSnkfh_zY24ynbiqRuobWh09qMqSUvN0yoQW2bWGKwV84butxTTlRlBk1A0bLXiMkqp1Ngpy82i7_UpcN3OmfOtmKNw"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded">
                    <span className="text-xs text-gray-500 tracking-wider uppercase">
                      8 Fragrances
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-serif text-xl text-gray-900 tracking-tight group-hover:text-amber-800 transition-colors">
                      Fragrance
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Subtle botanical notes, warm cedarwood undertones, and
                      ethereal hints of morning dewy rose.
                    </p>
                  </div>
                  <div className="pt-6 mt-4 flex items-center justify-between">
                    <a
                      className="text-xs font-medium uppercase tracking-[0.15em] text-amber-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                      data-path="fragrance"
                      href="#"
                    >
                      <span>Discover</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_outward
                      </span>
                    </a>
                    <span className="text-gray-300 text-xs">03</span>
                  </div>
                </div>
              </article>

              <article className="group relative flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt="Ceramic jar of whipped white body cream next to a sleek ceramic lotion bottle on organic beige limestone pedestal with delicate botanical shadows."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYAF2LpBQMlkSXAXzJpDz8UedblG1XOcHALstI_I6YkjEe6-wbAASs_Ax8ddQkiK3RF9NgfKzUxayfR7aVY_0Ps0JB2g35IxC5F4G_9-rtl1GgJzlps3TqbTSc_WiWGb6hp1Vd5DvBJ07JfxoaOHdcVAlm_aZk1fFckC8jlxX5HWX6WDDExaQ5I2jT55O-oynC1XxhyJwBrPhLpbCoxm3SGxsZeTPjoK7xbF3OWVg776BwhG7suxy_Ug"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded">
                    <span className="text-xs text-gray-500 tracking-wider uppercase">
                      10 Formulas
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-serif text-xl text-gray-900 tracking-tight group-hover:text-amber-800 transition-colors">
                      Bath &amp; Body
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Silkening body washes and whipped body soufflés infused
                      with skin-loving botanical squalane.
                    </p>
                  </div>
                  <div className="pt-6 mt-4 flex items-center justify-between">
                    <a
                      className="text-xs font-medium uppercase tracking-[0.15em] text-amber-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                      data-path="bath-body"
                      href="#"
                    >
                      <span>Discover</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_outward
                      </span>
                    </a>
                    <span className="text-gray-300 text-xs">04</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

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
                className="text-xs font-medium uppercase tracking-[0.15em] text-amber-800 flex items-center gap-1 mt-2 md:mt-0"
              >
                <span>View All</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_outward
                </span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
                <div className="relative aspect-square w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt="Botanical Gold facial oil dropper bottle on a light travertine stone surface."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRpP1bSSV8_GmKGs2kJO0S4OsoiB4teVJIKZ_MkFISTBJsmHd8CUqFnKLoWpRKI5FwQszLVzVrk8w1GuXkSszg1GVn_TsgE44RuUYZcUPJ52a00yPUez7r0c1PaSlU40-Lw8GraQwTT0erpihaio9K697WBhc8INNTpDGEvKPcUuta_7PoRnBqborFupdHkzIdQ8FSGc-DpHEelGNbzKqvMQdg8tVrd1724S-B3RplWFI4RfKO6CnA6A"
                  />
                  <button
                    aria-label="Add to cart"
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-amber-800 text-lg">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">
                    Skincare
                  </span>
                  <h3 className="font-serif text-lg text-gray-900">
                    Botanical Gold Facial Oil
                  </h3>
                  <span className="text-sm text-gray-700 mt-1">$48.00</span>
                </div>
              </article>

              <article className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
                <div className="relative aspect-square w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt="Pressed powder blush compact with a rose gold brush on silk background."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwb6IEENjs3ZCsfuWJKqXSzCrYVemb3mCEC4d_KOTo8AeaQOyrqHOcX2eIhy561O1K_dpH6rGl2sW7vuAdIO7Smazf2ASfwUVVRK1ImJJZYaIliO1AYI5ZIjgONZWbsDelr3OPRXgHgrW2fm5VzfyCflReOuMERwIWackdGgaGJcBRcjgYOo7KYs00eagyJ50Fi-i7HJk1jucB3Ng_4x-hshhCIZk0BdEhxOxUURhu0q5dkXANsYJUaA"
                  />
                  <button
                    aria-label="Add to cart"
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-amber-800 text-lg">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">
                    Makeup
                  </span>
                  <h3 className="font-serif text-lg text-gray-900">
                    Dewy Flush Blush
                  </h3>
                  <span className="text-sm text-gray-700 mt-1">$32.00</span>
                </div>
              </article>

              <article className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
                <div className="relative aspect-square w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt="Aura Nocturne perfume bottle beside dried rose petals on ivory linen."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5RmMa_k2LWEPuXdp2iTevFRXd02nEcBxbZvFW7csGdzaa7D-R2jG_huw3kC8bb3hglC7n75WgohccbovIa8xqWfL2x0bTKhryg0X15hSBYnsNX23P0YYzEMtHjW775bwb-f6wJHBIKPAm7BPNuPI1ofBwP-UPSnkfh_zY24ynbiqRuobWh09qMqSUvN0yoQW2bWGKwV84butxTTlRlBk1A0bLXiMkqp1Ngpy82i7_UpcN3OmfOtmKNw"
                  />
                  <button
                    aria-label="Add to cart"
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-amber-800 text-lg">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">
                    Fragrance
                  </span>
                  <h3 className="font-serif text-lg text-gray-900">
                    Aura Nocturne EDP
                  </h3>
                  <span className="text-sm text-gray-700 mt-1">$86.00</span>
                </div>
              </article>

              <article className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
                <div className="relative aspect-square w-full overflow-hidden bg-rose-50">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt="Whipped body cream jar next to a ceramic lotion bottle on beige limestone."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYAF2LpBQMlkSXAXzJpDz8UedblG1XOcHALstI_I6YkjEe6-wbAASs_Ax8ddQkiK3RF9NgfKzUxayfR7aVY_0Ps0JB2g35IxC5F4G_9-rtl1GgJzlps3TqbTSc_WiWGb6hp1Vd5DvBJ07JfxoaOHdcVAlm_aZk1fFckC8jlxX5HWX6WDDExaQ5I2jT55O-oynC1XxhyJwBrPhLpbCoxm3SGxsZeTPjoK7xbF3OWVg776BwhG7suxy_Ug"
                  />
                  <button
                    aria-label="Add to cart"
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-amber-800 text-lg">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">
                    Bath &amp; Body
                  </span>
                  <h3 className="font-serif text-lg text-gray-900">
                    Whipped Body Soufflé
                  </h3>
                  <span className="text-sm text-gray-700 mt-1">$28.00</span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full bg-rose-50 mt-16">
        <div className="max-w-[1360px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16">
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="font-serif text-xl text-gray-900">
                Store Name
              </span>
              <p className="text-base text-gray-500 max-w-sm">
                Intentional beauty rituals and clean botanical formulas designed
                for skin wellness and quiet luxury.
              </p>
              <div className="mt-4 max-w-md">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 block">
                  Join the Inner Circle
                </span>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-white px-4 py-2 text-gray-900 text-sm rounded focus:outline-none focus:ring-1 focus:ring-amber-800 placeholder:text-gray-400"
                    placeholder="Your email address"
                    type="email"
                  />
                  <button
                    className="bg-amber-800 text-white px-4 py-2 text-xs font-medium uppercase tracking-wider rounded hover:bg-amber-900 transition-colors"
                    type="button"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:col-start-7 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
                Boutique
              </span>
              <nav className="flex flex-col gap-2">
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="shop-all" href="#">Shop All</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="skincare" href="#">Skincare</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="makeup" href="#">Makeup</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="fragrance" href="#">Fragrance</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="bath-body" href="#">Bath &amp; Body</a>
              </nav>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
                Client Care
              </span>
              <nav className="flex flex-col gap-2">
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="customer-care" href="#">Orders &amp; Shipping</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="customer-care" href="#">Returns &amp; Exchanges</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="customer-care" href="#">Ingredient Sourcing</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="customer-care" href="#">FAQ</a>
              </nav>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
                The House
              </span>
              <nav className="flex flex-col gap-2">
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="our-story" href="#">Our Story</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="sustainability" href="#">Sustainability</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="stores" href="#">Store Locations</a>
              </nav>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-sm border-t border-gray-200">
            <p>© 2025 Store Name Cosmetics. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-gray-900 transition-colors" data-path="privacy-policy" href="#">Privacy Policy</a>
              <a className="hover:text-gray-900 transition-colors" data-path="terms-of-service" href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
