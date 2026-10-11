"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useOrder } from "@/hooks/orderHooks"
import { useAuthUser } from "@/hooks/userHooks"
import { ArrowLeft, Check } from "lucide-react"
import { formatToman } from "@/lib/pricing"

const STATUS_LABELS: Record<string, string> = {
  QUEUE: "در صف",
  PREPARED: "پردازش شد",
  DELIVERED: "تحویل داده شده",
}

const STATUS_COLORS: Record<string, string> = {
  QUEUE: "bg-yellow-800/15 text-yellow-800",
  PREPARED: "bg-blue-800/15 text-blue-800",
  DELIVERED: "bg-green-800/15 text-green-800",
}

export default function OrderDetail() {
  const params = useParams()
  const { user, isLoading: userLoading } = useAuthUser()

  const orderId = params.id as string

  const { data: order, isLoading: loading, error: orderError } = useOrder(orderId, user?.id)
  const error = orderError?.message

  if (userLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#85736f]">در حال دریافت اطلاعات شما...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-[#85736f]">ابتدا وارد حساب خود شوید</p>
        <Link
          href="/login"
          className="text-sm text-amber-800 hover:underline mt-2"
        >
          ورود به حساب
        </Link>
      </div>
    )
  }

  if (loading && !order) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#85736f]">در حال بارگذاری...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">{error || "سفارش یافت نشد"}</p>
        <Link
          href="/orders"
          className="text-sm text-amber-800 hover:underline mt-2"
        >
          بازگشت به لیست سفارشات
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
          برگشت به سفارشات
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-[#e8dfdc] overflow-hidden">
          <div className="p-6 border-b border-[#e8dfdc]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl text-[#1f1b1a]">
                  شماره سفارش #{order.id}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  تاریخ سفارش
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
                  نام گیرنده
                </p>
                <p className="font-sans text-sm text-[#1f1b1a]">
                  {order.recipientName}
                </p>
              </div>
              <div className="bg-[#faf6f3] p-4 rounded-lg">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  شماره شیرو
                </p>
                <p className="font-sans text-sm text-[#1f1b1a]">
                  {order.phoneNumber}
                </p>
              </div>
              <div className="bg-[#faf6f3] p-4 rounded-lg">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  آدرس
                </p>
                <p className="font-sans text-sm text-[#1f1b1a] mt-1">
                  {order.address}
                </p>
              </div>
              <div className="bg-[#faf6f3] p-4 rounded-lg">
                <p className="text-xs text-[#85736f] uppercase tracking-wider">
                  زمان تحویل
                </p>
                <p className="font-sans text-sm text-[#1f1b1a]">
                  {order.deliveryTime
                    ? new Date(order.deliveryTime).toLocaleDateString("fa-IR")
                    : "تجویز نهایی نشده"}
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-lg text-[#1f1b1a] mb-4">
                آیتم‌های سفارش
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-[#f0e6e4]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-[#1f1b1a]">
                        {item.productName}
                      </p>
                      <p className="text-xs text-[#85736f]">
                        حجم: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-sm text-[#1f1b1a]">
                        {formatToman(item.unitPrice * item.quantity)}
                      </p>
                      <p className="text-xs text-[#85736f]">
                        هر عدد: {formatToman(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between border-t border-[#f0e6e4] pt-4">
                <span className="font-serif text-xl text-[#1f1b1a]">
                  مجموع
                </span>
                <span className="font-serif text-2xl text-[#1f1b1a]">
                  {formatToman(order.totalPrice)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/orders"
                className="flex-1 bg-rose-800 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-rose-900 transition-colors text-center"
              >
                <Check size={18} className="inline me-2" />
                بستن
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
