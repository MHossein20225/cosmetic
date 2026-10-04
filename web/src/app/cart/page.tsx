'use client'
import { Check, ChevronLeft, Minus, Plus, ShoppingBag, Trash, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@/hooks/cartHooks";
import type { CartItem, Product } from "@/types";



export default function Cart() {
  const { items, count, subtotal, isLoading } = useCart();
  const { updateCartItemMutate } = useUpdateCartItem();
  const { removeCartItemMutate } = useRemoveCartItem();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="w-full min-h-screen pt-20 bg-[#fff8f6]">
      <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 sm:mb-8 gap-2">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1f1b1a]">
              Your Bag
            </h1>
            <span className="font-sans text-sm text-[#534340] italic">
              ({count} {count === 1 ? "item" : "items"})
            </span>
          </div>
          <a
            className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8b4e40] hover:text-[#58261b] transition-colors flex items-center gap-1.5"
            href="#"
            aria-label="Continue browsing"
          >
            <ChevronLeft size={14} />
            Continue browsing
          </a>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {items.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center">
                  <ShoppingBag size={22} className="text-rose-400" />
                </div>
                <h2 className="mt-4 font-serif text-lg text-[#1f1b1a]">
                  Your bag is empty
                </h2>
                <p className="mt-1 text-sm text-[#534340]">
                  Add a few products to see them here.
                </p>
              </div>
            ) : (
            items.map((item: CartItem) => (
              <div
                key={item.product.id}
                className="bg-white p-4 sm:p-5 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 transition-all duration-300"
              >
                <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-lg bg-[#fcf1ef] overflow-hidden shrink-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between self-stretch">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#8b4e40]">
                        {item.product.categoryId}
                      </span>
                      <h2 className="font-serif text-lg sm:text-xl text-[#1f1b1a] mt-1">
{item.product.name}
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-[#534340] mt-0.5">
                        {item.product.description}
                      </p>
                    </div>
                    <button
                      aria-label={`Remove ${item.product.name}`}
                      onClick={() => removeCartItemMutate(item.product.id)}
                      className="text-[#85736f] hover:text-[#b44a4a] transition-colors p-1 rounded shrink-0"
                      type="button"
                    >
                      <Trash size={18} className="text-red-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0e6e4]">
                    <div className="flex items-center bg-[#fcf1ef] rounded-lg p-1">
                      <button
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateCartItemMutate({
                            productId: item.product.id,
                            quantity: item.quantity - 1,
                          })
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#1f1b1a] hover:bg-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        type="button"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-sans text-sm font-semibold text-[#1f1b1a] select-none">
                        {item.quantity}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateCartItemMutate({
                            productId: item.product.id,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#1f1b1a] hover:bg-white rounded transition-colors"
                        type="button"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-sans text-base sm:text-lg font-semibold text-[#1f1b1a]">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
            )}

            {/* Gift Card */}
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
                  <span className="font-sans text-sm font-semibold text-[#1f1b1a]">
                    ${subtotal.toFixed(2)}
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
                  <span className="font-serif text-2xl text-[#1f1b1a]">
                    ${subtotal.toFixed(2)}
                  </span>
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
                <Check size={18} />
              </button>

              {/* Trust Badges */}

              {/* Security */}
              <div className="flex items-center justify-center gap-3 text-[#85736f] font-sans text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} />
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
