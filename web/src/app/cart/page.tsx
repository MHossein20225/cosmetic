import Image from "next/image";

const CART_ITEMS = [
  {
    id: 1,
    name: "Dew Elixir Facial Oil",
    category: "Botanical Elixir",
    detail: "Size: 30ml / 1.0 fl. oz • Cold-pressed Squalane & Rosehip",
    price: 68,
    qty: 1,
    image: "/nonImage.jpg",
  },
  {
    id: 2,
    name: "Petal Lip & Cheek Balm",
    category: "Nourishing Tint",
    detail: "Shade: Peony flush • Shea Butter & Hibiscus extract",
    price: 32,
    qty: 1,
    image: "/nonImage.jpg",
  },
];

export default function Cart() {
  return (
    <main className="w-full min-h-screen pt-20 bg-[#fff8f6]">
      <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Free Shipping Bar */}
        <div className="mb-8 sm:mb-10 bg-[#fcf1ef] p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#8b4e40] text-2xl">
              local_shipping
            </span>
            <div>
              <p className="font-sans text-sm font-semibold text-[#1f1b1a]">
                You have unlocked Complimentary Express Shipping
              </p>
              <p className="font-sans text-xs text-[#534340]">
                Qualified for orders exceeding $50.00
              </p>
            </div>
          </div>
          <div className="w-full md:w-64 shrink-0">
            <div className="flex justify-between font-sans text-[11px] font-semibold uppercase tracking-wider text-[#534340] mb-1.5">
              <span>Tier: Standard</span>
              <span className="text-[#8b4e40]">100% Achieved</span>
            </div>
            <div className="w-full h-1.5 bg-[#f0e6e4] rounded-full overflow-hidden">
              <div className="h-full bg-[#8b4e40] rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 sm:mb-8 gap-2">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1f1b1a]">
              Your Bag
            </h1>
            <span className="font-sans text-sm text-[#534340] italic">
              ({CART_ITEMS.length} items)
            </span>
          </div>
          <a
            className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8b4e40] hover:text-[#58261b] transition-colors flex items-center gap-1.5"
            href="#"
          >
            <span className="material-symbols-outlined text-sm">west</span>
            Continue Browsing
          </a>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {CART_ITEMS.map((cart) => (
              <div
                key={cart.id}
                className="bg-white p-4 sm:p-5 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 transition-all duration-300"
              >
                <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg bg-[#fcf1ef] overflow-hidden shrink-0">
                  <Image
                    src={cart.image}
                    alt={cart.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between self-stretch">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#8b4e40]">
                        {cart.category}
                      </span>
                      <h2 className="font-serif text-lg sm:text-xl text-[#1f1b1a] mt-1">
                        {cart.name}
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-[#534340] mt-0.5">
                        {cart.detail}
                      </p>
                    </div>
                    <button
                      aria-label={`Remove ${cart.name}`}
                      className="text-[#85736f] hover:text-[#b44a4a] transition-colors p-1 rounded shrink-0"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0e6e4]">
                    <div className="flex items-center bg-[#fcf1ef] rounded-lg p-1">
                      <button
                        aria-label="Decrease quantity"
                        className="w-8 h-8 flex items-center justify-center text-[#1f1b1a] hover:bg-white rounded transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">
                          remove
                        </span>
                      </button>
                      <span className="w-10 text-center font-sans text-sm font-semibold text-[#1f1b1a] select-none">
                        {cart.qty}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        className="w-8 h-8 flex items-center justify-center text-[#1f1b1a] hover:bg-white rounded transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">
                          add
                        </span>
                      </button>
                    </div>
                    <span className="font-sans text-base sm:text-lg font-semibold text-[#1f1b1a]">
                      ${cart.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Gift Sample */}
            <div className="bg-[rgba(139,78,64,0.08)] p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-[#8b4e40] shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-xl">
                    card_giftcard
                  </span>
                </div>
                <div>
                  <span className="bg-[#8b4e40] text-white font-sans text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                    Gift with Order
                  </span>
                  <p className="font-sans text-sm font-semibold text-[#1f1b1a] mt-1.5">
                    Complimentary Silk Cloud Cleanser mini (5ml) included
                  </p>
                  <p className="font-sans text-xs text-[#534340] mt-0.5">
                    Automatically added to your eco-luxe delivery parcel.
                  </p>
                </div>
              </div>
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8b4e40] shrink-0">
                Free
              </span>
            </div>

            {/* Ritual Note */}
            <div className="bg-[#fcf1ef] p-5 sm:p-6 rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-[#8b4e40] font-sans text-xs font-semibold uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">spa</span>
                The Mindful Ritual
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#1f1b1a]">
                Formulated for Serene Stillness
              </h3>
              <p className="font-sans text-sm leading-6 text-[#534340] max-w-xl">
                Each batch is hand-crafted with wild-harvested botanicals and
                organic cold-pressed oils to preserve peak cellular vitality.
                Free of synthetic fragrances, silicones, and parabens.
              </p>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md flex flex-col gap-5">
              {/* Title */}
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-[#1f1b1a]">
                  Order Summary
                </h2>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#85736f]">
                  USD
                </span>
              </div>

              {/* Breakdown */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center font-sans text-sm text-[#534340]">
                  <span>Subtotal</span>
                </div>
                <div className="flex justify-between items-center font-sans text-sm text-[#534340]">
                  <span className="flex items-center gap-1">
                    Estimated Shipping
                    <span
                      className="material-symbols-outlined text-xs text-[#85736f]"
                      title="Free standard shipping for orders over $50"
                    >
                      help_outline
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center font-sans text-sm text-[#534340]">
                  <span>Estimated Sales Tax</span>
                </div>

                {/* Promo */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-[#fcf1ef] px-4 py-2.5 text-[#1f1b1a] font-sans text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#8b4e40] placeholder:text-[#85736f]"
                      placeholder="Gift card or code"
                      type="text"
                    />
                    <button
                      className="bg-[#f0e6e4] text-[#1f1b1a] px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#fcf1ef] transition-colors shrink-0"
                      type="button"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#f0e6e4]" />

              {/* Total */}
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-xl text-[#1f1b1a]">Total</span>
                <div className="text-right">
                  <span className="font-serif text-2xl text-[#1f1b1a]"></span>
                  <p className="font-sans text-[11px] text-[#85736f] mt-0.5">
                    Including tax &amp; duties
                  </p>
                </div>
              </div>

              {/* Checkout */}
              <button
                className="w-full bg-[#8b4e40] text-white py-4 px-6 font-sans text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#58261b] transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-md"
                type="button"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </button>

              {/* Trust Badges */}
              <div className="bg-[#fcf1ef] p-4 rounded-lg flex flex-col gap-3">
                {[
                  {
                    icon: "local_shipping",
                    text: "Complimentary shipping over $50",
                  },
                  {
                    icon: "eco",
                    text: "Carbon neutral & recyclable packaging",
                  },
                  {
                    icon: "published_with_changes",
                    text: "30-day gentle guarantee & easy returns",
                  },
                ].map((badge) => (
                  <div key={badge.icon} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#8b4e40] text-lg">
                      {badge.icon}
                    </span>
                    <span className="font-sans text-xs text-[#534340]">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Security */}
              <div className="flex items-center justify-center gap-3 text-[#85736f] font-sans text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    lock
                  </span>
                  256-Bit Encrypted
                </span>
                <span>•</span>
                <span>Ethical Sourcing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
