"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useAuthUser } from "@/hooks/userHooks"
import { useRouter } from "next/navigation"
import { Check, ArrowRight, Clock, MapPin, Package } from "lucide-react"

interface OrderItem {
  id: string
  orderId: string
  productId: number
  quantity: number
  unitPrice: number
  product: {
    id: number
    name: string
  }
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  recipientName: string
  phoneNumber: string
  address: string
  totalPrice: number
  status: "QUEUE" | "PREPARED" | "DELIVERED"
  createdAt: Date
  deliveryTime: Date | null
}

export default function Orders() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useAuthUser()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: async () => {
      if (!user?.id) return []
      const res = await fetch(`/api/order?my=1`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Ø¯Ø±ÛŒØ§ÙØª Ø³ÙØ§Ø±Ø´Ø§Øª Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯")
      }
      return res.json()
    },
  })


  if (userLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#85736f]">Ø¯Ø± Ø­Ø§Ù„ Ø¯Ø±ÛŒØ§ÙØª Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ø´Ù…Ø§...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-[#85736f]">Ø¨Ø±Ø§ÛŒ Ø¯ÛŒØ¯Ù† Ø³ÙØ§Ø±Ø´Ø§ØªØŒ Ù„Ø·ÙØ§Ù‹ ÙˆØ§Ø±Ø¯ Ø´ÙˆÛŒØ¯</p>
        <Link
          href="/login"
          className="text-sm text-amber-800 hover:underline mt-2"
        >
          ÙˆØ±ÙˆØ¯ Ø¨Ù‡ Ø­Ø³Ø§Ø¨
        </Link>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">Ø®Ø·Ø§ Ø¯Ø± Ø¯Ø±ÛŒØ§ÙØª Ø³ÙØ§Ø±Ø´Ø§Øª</p>
        <p className="text-sm text-[#85736f]">{error?.message || "Ø®Ø·Ø§ÛŒ Ù†Ø§Ø´Ù†Ø§Ø®ØªÙ‡"}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-amber-800 hover:underline mt-2"
        >
          ØªÙ„Ø§Ø´ Ù…Ø¬Ø¯Ø¯
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-[#1f1b1a]">Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§ÛŒ Ù…Ù†</h1>
        <Link
          href="/cart"
          className="text-sm text-amber-800 hover:text-amber-900"
        >
          <Check size={16} className="inline mr-1" />
          Ø³Ø¨Ø¯ Ø®Ø±ÛŒØ¯
        </Link>
      </div>

      {orders?.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e8dfdc] p-8 text-center">
          <Package size={40} className="mx-auto text-[#85736f] mb-4" />
          <h2 className="font-serif text-lg text-[#1f1b1a]">Ù‡Ù†ÙˆØ² Ø³ÙØ§Ø±Ø´ÛŒ Ù†Ø¯Ø§Ø±ÛŒØ¯</h2>
          <p className="text-sm text-[#85736f] mt-1">
            Ø¨Ø±Ø§ÛŒ Ø´Ø±ÙˆØ¹ØŒ Ù…Ø­ØµÙˆÙ„Ø§Øª Ù…ÙˆØ±Ø¯ Ø¹Ù„Ø§Ù‚Ù‡ Ø®ÙˆØ¯ Ø±Ø§ Ø¨Ù‡ Ø³Ø¨Ø¯ Ø®Ø±ÛŒØ¯ Ø§Ø¶Ø§ÙÙ‡ Ú©Ù†ÛŒØ¯
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-amber-800 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-amber-900 transition-colors"
          >
            <Check size={18} />
            Ù…Ø´Ø§Ù‡Ø¯Ù‡ Ù…Ø­ØµÙˆÙ„Ø§Øª
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8dfdc] overflow-hidden">
          <ul className="divide-y divide-[#e8dfdc]">
            {orders.map((order: Order) => (
              <li
                key={order.id}
                className={`border-b border-[#f0e6e4] cursor-pointer ${selectedOrder === order.id ? "bg-[#faf6f3]" : ""}`}
                onClick={() => setSelectedOrder(order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-lg text-[#1f1b1a]">
                        {order.id}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === "QUEUE"
                            ? "bg-yellow-800/15 text-yellow-800"
                            : order.status === "PREPARED"
                            ? "bg-blue-800/15 text-blue-800"
                            : "bg-green-800/15 text-green-800"
                        }`}
                      >
                        {order.status === "QUEUE"
                          ? "Ø¯Ø± ØµÙ"
                          : order.status === "PREPARED"
                          ? "Ù¾Ø±Ø¯Ø§Ø²Ø´ Ø´Ø¯"
                          : "ØªØ­ÙˆÛŒÙ„ Ø¯Ø§Ø¯Ù‡ Ø´Ø¯"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#85736f]">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {order.address}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#f0e6e4]">
                      <p className="text-xs text-[#85736f]">
                        {order.items.length} Ø¢ÛŒØªÙ…
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-[#1f1b1a]">
                          {order.totalPrice.toLocaleString()} ØªÙˆÙ…Ø§Ù†
                        </span>
                        {selectedOrder === order.id && (
                          <Link
                            href={`/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs text-amber-800 hover:text-amber-900"
                          >
                            Ø¬Ø²Ø¦ÛŒØ§Øª <ArrowRight size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedOrder === order.id && (
                    <div className="sm:flex-shrink-0 flex flex-col sm:flex-row gap-3 text-xs text-[#85736f]">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-amber-800 hover:text-amber-900 underline"
                      >
                        Ù†Ù…Ø§ÛŒØ´ Ø¬Ø²Ø¦ÛŒØ§Øª
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedOrder && orders && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-[#1f1b1a]">
                  Ø¬Ø²Ø¦ÛŒØ§Øª Ø³ÙØ§Ø±Ø´ #{selectedOrder}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#85736f] hover:text-[#1f1b1a]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {orders.map((order: Order) => (
                order.id === selectedOrder && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#85736f] uppercase tracking-wider">
                          Ù†Ø§Ù… Ú¯ÛŒØ±Ù†Ø¯Ù‡
                        </p>
                        <p className="font-sans text-sm text-[#1f1b1a]">
                          {order.recipientName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#85736f] uppercase tracking-wider">
                          Ø´Ù…Ø§Ø±Ù‡ Ø´ÛŒØ±Ùˆ
                        </p>
                        <p className="font-sans text-sm text-[#1f1b1a]">
                          {order.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#85736f] uppercase tracking-wider">
                          Ø¢Ø¯Ø±Ø³
                        </p>
                        <p className="font-sans text-sm text-[#1f1b1a] mt-1">
                          {order.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#85736f] uppercase tracking-wider">
                          ØªØ§Ø±ÛŒØ® Ø³ÙØ§Ø±Ø´
                        </p>
                        <p className="font-sans text-sm text-[#1f1b1a]">
                          {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#85736f] uppercase tracking-wider">
                          Ø²Ù…Ø§Ù† ØªØ­ÙˆÛŒÙ„
                        </p>
                        <p className="font-sans text-sm text-[#1f1b1a]">
                          {order.deliveryTime
                            ? new Date(order.deliveryTime).toLocaleDateString("fa-IR")
                            : "ØªØ§Ø±ÛŒØ® Ù†Ø§Ù…Ø´Ø®Øµ"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#85736f] uppercase tracking-wider">
                          ÙˆØ¶Ø¹ÛŒØª
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "QUEUE"
                            ? "bg-yellow-800/15 text-yellow-800"
                            : order.status === "PREPARED"
                            ? "bg-blue-800/15 text-blue-800"
                            : "bg-green-800/15 text-green-800"
                          }`}
                        >
                          {order.status === "QUEUE"
                            ? "Ø¯Ø± ØµÙ"
                            : order.status === "PREPARED"
                            ? "Ù¾Ø±Ø¯Ø§Ø²Ø´ Ø´Ø¯"
                            : "ØªØ­ÙˆÛŒÙ„ Ø¯Ø§Ø¯Ù‡ Ø´Ø¯Ù‡"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg text-[#1f1b1a] mb-4">
                        Ø¢ÛŒØªÙ…â€ŒÙ‡Ø§ÛŒ Ø³ÙØ§Ø±Ø´
                      </h3>
                      <div className="space-y-3">
                        {order.items.map((item: OrderItem) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-3 border-b border-[#f0e6e4]"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-sm text-[#1f1b1a]">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-[#85736f]">
                                Ø­Ø¬Ù…: {item.quantity}
                              </p>
                            </div>
                            <span className="font-sans text-sm font-semibold text-[#1f1b1a]">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#f0e6e4] pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xl text-[#1f1b1a]">
                          Ù…Ø¬Ù…ÙˆØ¹
                        </span>
                        <span className="font-serif text-2xl text-[#1f1b1a]">
                          {order.totalPrice.toLocaleString()} ØªÙˆÙ…Ø§Ù†
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="bg-amber-800 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-amber-900 transition-colors flex items-center gap-2"
                      >
                        <Check size={18} />
                        Ø¨Ø³ØªÙ†
                      </Link>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
