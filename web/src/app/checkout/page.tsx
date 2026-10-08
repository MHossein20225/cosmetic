"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, MapPin } from "lucide-react";
import { useCart } from "@/hooks/cartHooks";
import { CartItem, orderSchema } from "@/types";
import { useCreateOrder } from "@/hooks/orderHooks";
import { redirect } from "next/navigation";

import { toast } from "sonner";

export default function Checkout() {
  const { isLoading, items, subtotal, count } = useCart();
  const { orderMutate, isPending } = useCreateOrder();

  async function submitHandle(e: React.SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);

    const order = {
      recipientName: formData.get("recipientName"),
      address: formData.get("address"),
      phoneNumber: formData.get("phoneNumber"),
    };

    const result = orderSchema.safeParse(order);

    if (!result.success) {
      return null;
    }

    orderMutate(result.data, {
      onSuccess: () => {
        toast.success("(...ØµØ¨Ø± Ú©Ù†ÛŒØ¯) Ø³ÙØ§Ø±Ø´ Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø«Ø¨Øª Ø´Ø¯");
        setTimeout(() => {
          redirect("/");
        }, 2000);
      },
    });
  }

  return (
    <main className="w-full min-h-screen pt-20 bg-[#fff8f6]">
      <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 sm:mb-8 gap-2">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1f1b1a]">
              Checkout
            </h1>
            <span className="font-sans text-sm text-[#534340] italic">
              {count}
            </span>
          </div>
          <Link
            className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8b4e40] hover:text-[#58261b] transition-colors flex items-center gap-1.5"
            href="/cart"
          >
            Ø¨Ø§Ø²Ú¯Ø´Øª Ø¨Ù‡ Ø³Ø¨Ø¯ Ø®Ø±ÛŒØ¯
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Steps */}
        <ol className="flex items-center gap-2 sm:gap-4 mb-8 font-sans text-[11px] font-semibold uppercase tracking-wider">
          <li className="text-[#8b4e40]">Bag</li>
          <li className="h-px w-6 sm:w-10 bg-[#e3cbc5]" />
          <li className="text-[#1f1b1a]">Address</li>
          <li className="h-px w-6 sm:w-10 bg-[#e3cbc5]" />
          <li className="text-[#85736f]">Payment</li>
        </ol>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: Address */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <form
              id="submitOrder"
              onSubmit={(e) => submitHandle(e)}
              method="post"
              className="bg-white p-5 sm:p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#8b4e40]">
                  <MapPin size={18} />
                </span>

                <h2 className="font-serif text-xl text-[#1f1b1a]">
                  Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#534340]">
                    Ù†Ø§Ù… Ú¯ÛŒØ±Ù†Ø¯Ù‡
                  </span>

                  <input
                    className="bg-[#fcf1ef] px-4 py-2.5 text-[#1f1b1a] font-sans text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#8b4e40] placeholder:text-[#85736f]"
                    type="text"
                    name="recipientName"
                  />
                </label>

                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#534340]">
                    Ø¢Ø¯Ø±Ø³
                  </span>

                  <textarea
                    className="bg-[#fcf1ef] px-4 py-2.5 text-[#1f1b1a] font-sans text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#8b4e40] placeholder:text-[#85736f] min-h-24 resize-y"
                    placeholder="Street, building, unit number"
                    name="address"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#534340]">
                    Ø´Ù…Ø§Ø±Ù‡ ØªÙ„ÙÙ†
                  </span>

                  <input
                    className="bg-[#fcf1ef] px-4 py-2.5 text-[#1f1b1a] font-sans text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#8b4e40] placeholder:text-[#85736f]"
                    placeholder="09xxxxxxxxx"
                    type="text"
                    name="phoneNumber"
                  />
                </label>
              </div>
            </form>

            {/* Payment */}
            <section className="bg-white p-5 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#8b4e40]">
                  <Check size={18} />
                </span>

                <h2 className="font-serif text-xl text-[#1f1b1a]">
                  Payment Method
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  {
                    id: "cod",
                    label: "Cash on Delivery",
                    hint: "Pay when your order arrives",
                    disabled: false,
                  },
                  {
                    id: "card",
                    label: "Credit / Debit Card",
                    hint: "Not available at this time",
                    disabled: true,
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 bg-[#fcf1ef] px-4 py-3 rounded-lg cursor-pointer hover:bg-[#f8ebe7] transition-colors ${method.disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <input
                      className="accent-[#8b4e40]"
                      defaultChecked={method.id === "cod"}
                      name="payment"
                      type="radio"
                      value={method.id}
                      disabled={method.disabled}
                    />

                    <span className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-[#1f1b1a]">
                        {method.label}
                      </span>

                      <span className="font-sans text-xs text-[#85736f]">
                        {method.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Order */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-[#1f1b1a]">
                  Your Order
                </h2>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#85736f]">
                  USD
                </span>
              </div>

              {!items.length || isLoading ? (
                <p className="font-sans text-sm text-[#534340] py-6 text-center">
                  .Ø³Ø¨Ø¯ Ø´Ù…Ø§ Ø®Ø§Ù„ÛŒ Ø§Ø³Øª
                </p>
              ) : (
                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                  {items.length &&
                    items.map((item: CartItem) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3"
                      >
                        <div className="relative w-14 h-16 rounded-lg bg-[#fcf1ef] overflow-hidden shrink-0">
                          <Image
                            src={item.product.imageUrl ?? "/images/nonProduct.jpg"}
                            alt={item.product.name}
                            fill
                            loading="eager"
                            sizes="56px"
                            className="object-cover"
                          />

                          <span className="absolute top-0 right-0 bg-[#8b4e40] text-white text-[10px] w-5 h-5 rounded-bl-lg flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-sans text-sm font-semibold text-[#1f1b1a] truncate">
                            {item.product.name}
                          </h3>

                          <p className="font-sans text-xs text-[#85736f]">
                            {item.product.price.toFixed(2)}
                          </p>
                        </div>

                        <span className="font-sans text-sm font-semibold text-[#1f1b1a]">
                          {(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              <div className="h-px bg-[#f0e6e4]" />

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center font-sans text-sm text-[#534340]">
                  <span>Subtotal</span>
                  <span className="font-sans text-sm font-semibold text-[#1f1b1a]">
                    {subtotal}
                  </span>
                </div>

                <div className="flex justify-between items-center font-sans text-sm text-[#534340]">
                  <span>Shipping</span>
                  <span className="font-sans text-sm font-semibold text-green-700">
                    Free
                  </span>
                </div>
              </div>

              <div className="h-px bg-[#f0e6e4]" />

              <div className="flex justify-between items-baseline">
                <span className="font-serif text-xl text-[#1f1b1a]">Ù‚ÛŒÙ…Øª Ú©Ù„</span>
                <span className="font-serif text-2xl text-[#1f1b1a]">
                  {subtotal}
                </span>
              </div>

              <button
                className="w-full bg-[#8b4e40] text-white py-4 px-6 font-sans text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#58261b] transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-md disabled:bg-[#85736f] disabled:cursor-not-allowed"
                type="button"
                form="submitOrder"
              >
                {isPending ? "ØµØ¨Ø± Ú©Ù†ÛŒØ¯" : "Ø«Ø¨Øª Ø³ÙØ§Ø±Ø´"}
                <span className="material-symbols-outlined text-base">
                  <Check />
                </span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[#85736f] font-sans text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    lock
                  </span>
                  256-Bit Encrypted
                </span>
                <span>â€¢</span>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
