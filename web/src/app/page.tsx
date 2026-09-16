
import ProductSection from "@/components/ProductsSection";
import CategorySection from "@/components/CategorySection";
export default function Home() {
  return (
    <>
      

      <CategorySection/>
      <ProductSection/>
      

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
