"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useAuthUser } from "@/hooks/userHooks"
import { ArrowLeft, Check, MapPin, Clock, User, Phone } from "lucide-react"

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

const STATUS_LABELS: Record<string, string> = {
  QUEUE: "Ø¯Ø± ØµÙ",
  PREPARED: "Ù¾Ø±Ø¯Ø§Ø²Ø´ Ø´Ø¯",
  DELIVERED: "ØªØ­ÙˆÛŒÙ„ Ø¯Ø§Ø¯Ù‡ Ø´Ø¯Ù‡",
}

const STATUS_COLORS: Record<string, string> = {
  QUEUE: "bg-yellow-800/15 text-yellow-800",
  PREPARED: "bg-blue-800/15 text-blue-800",
  DELIVERED: "bg-green-800/15 text-green-800",
}

export default function OrderDetail() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: userLoading } = useAuthUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = params.id as string

  const {
    data: userData,
    isLoading: userQueryLoading,
    error: userQueryError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user/me")
      if (!res.ok) return null
      return res.json()
    },
  })

  useEffect(() => {
    if (userQueryError) {
      setError("Ø®Ø·Ø§ Ø¯Ø± Ø¯Ø±ÛŒØ§ÙØª Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ú©Ø§Ø±Ø¨Ø±")
      setLoading(false)
    }
  }, [userQueryError])

  const { data: orderData, isLoading, isError, error: orderError } = useQuery({
    queryKey: ["orders", "my", orderId],
    queryFn: async () => {
      if (!userData?.id) return null
      const res = await fetch(`/api/order/${orderId}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Ø³ÙØ§Ø±Ø´ ÛŒØ§ÙØª Ù†Ø´Ø¯")
        }
        if (res.status === 403) {
          throw new Error("Ø¯Ø³ØªØ±Ø³ÛŒ ØºÛŒØ± Ù…Ø¬Ø§Ø²")
        }
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Ø¯Ø±ÛŒØ§ÙØª Ø³ÙØ§Ø±Ø´ Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯")
      }
      return res.json()
    },
  })

  useEffect(() => {
    if (userQueryLoading) return
    if (userQueryError) {
      setError(userQueryError.message)
      setLoading(false)
      return
    }

    if (isLoading) return
    if (isError) {
      setError(orderError?.message || "Ø®Ø·Ø§ Ø¯Ø± Ø¯Ø±ÛŒØ§ÙØª Ø³ÙØ§Ø±Ø´")
      setLoading(false)
      return
    }

    if (orderData) {
      setOrder(orderData)
    }
    setLoading(false)
  }, [
    userQueryLoading,
    userQueryError,
    isLoading,
    isError,
    orderError,
    orderData,
    userData?.id,
  ])

  if (userLoading || userQueryLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#85736f]">Ø¯Ø± Ø­Ø§Ù„ Ø¯Ø±ÛŒØ§ÙØª Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ø´Ù…Ø§...</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-[#85736f]">Ø§Ø¨ØªØ¯Ø§ ÙˆØ§Ø±Ø¯ Ø­Ø³Ø§Ø¨ Ø®ÙˆØ¯ Ø´ÙˆÛŒØ¯</p>
        <Link
          href="/login"
          className="text-sm text-amber-800 hover:underline mt-2"
        >
          ÙˆØ±ÙˆØ¯ Ø¨Ù‡ Ø­Ø³Ø§Ø¨
        </Link>
      </div>
    )
  }

  if (loading && !order) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#85736f]">Ø¯Ø± Ø­Ø§Ù„ Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±ÛŒ...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">{error || "Ø³ÙØ§Ø±Ø´ ÛŒØ§ÙØª Ù†Ø´Ø¯"}</p>
        <Link
          href="/orders"
          className="text-sm text-amber-800 hover:underline mt-2"
        >
          Ø¨Ø§Ø²Ú¯Ø´Øª Ø¨Ù‡ Ù„ÛŒØ³Øª Ø³ÙØ§Ø±Ø´Ø§Øª
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/orders"
          className="text-sm text-[#85736f] hover:text-[#1f1b1a]"
        >
          <ArrowLeft size={18} />
          Ø¨Ø±Ú¯Ø´Øª Ø¨Ù‡ Ø³ÙØ§Ø±Ø´Ø§Øª
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-[#e8dfdc] overflow-hidden">
          <div className="p-6 border-b border-[#e8dfdc]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl text-[#1f1b1a]">
                  Ø´Ù…Ø§Ø±Ù‡ Ø³ÙØ§Ø±Ø´ #{order.id}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  ØªØ§Ø±ÛŒØ® Ø³ÙØ§Ø±Ø´
                </p>
                <p className="font-serif text-lg text-[#1f1b1a]">
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#faf6f3] p-4 rounded-lg">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  Ù†Ø§Ù… Ú¯ÛŒØ±Ù†Ø¯Ù‡
                </p>
                <p className="font-sans text-sm text-[#1f1b1a]">
                  {order.recipientName}
                </p>
              </div>
              <div className="bg-[#faf6f3] p-4 rounded-lg">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  Ø´Ù…Ø§Ø±Ù‡ Ø´ÛŒØ±Ùˆ
                </p>
                <p className="font-sans text-sm text-[#1f1b1a]">
                  {order.phoneNumber}
                </p>
              </div>
              <div className="bg-[#faf6f3] p-4 rounded-lg">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  Ø¢Ø¯Ø±Ø³
                </p>
                <p className="font-sans text-sm text-[#1f1b1a] mt-1">
                  {order.address}
                </p>
              </div>
              <div className="bg-[#faf6f3] p-4 rounded-lg">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  Ø²Ù…Ø§Ù† ØªØ­ÙˆÛŒÙ„
                </p>
                <p className="font-sans text-sm text-[#1f1b1a]">
                  {order.deliveryTime
                    ? new Date(order.deliveryTime).toLocaleDateString("fa-IR")
                    : "ØªØ¬ÙˆÛŒØ² Ù†Ù‡Ø§ÛŒÛŒ Ù†Ø´Ø¯Ù‡"}
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-lg text-[#1f1b1a] mb-4">
                Ø¢ÛŒØªÙ…â€ŒÙ‡Ø§ÛŒ Ø³ÙØ§Ø±Ø´
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
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
                    <div className="text-right">
                      <p className="font-sans text-sm text-[#1f1b1a]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-[#85736f]">
                        ÙˆØ§Ø­Ø¯: ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between border-t border-[#f0e6e4] pt-4">
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
                href="/orders"
                className="flex-1 bg-rose-800 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-rose-900 transition-colors text-center"
              >
                <Check size={18} className="inline mr-2" />
                Ø¨Ø³ØªÙ†
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
