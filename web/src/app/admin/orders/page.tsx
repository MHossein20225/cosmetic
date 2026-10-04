"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminOrders, useAdminAuth } from "@/hooks/adminHooks";
import { ShoppingCart, ChevronUp, ChevronDown, Loader2 } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  QUEUE: "در صف",
  PREPARED: "پردازش شد",
  DELIVERIED: "تحویل داده شد",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user: admin } = useAdminAuth();
  const { orders, isLoading, isError, error, refetch, updateOrderStatus, updateOrderStatusAsync } = useAdminOrders();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  async function handleStatus(id: string, current: string) {
    if (updatingId) return;
    const next = current === "QUEUE" ? "PREPARED" : current === "PREPARED" ? "DELIVERIED" : "QUEUE";
    setUpdatingId(id);
    try {
      await updateOrderStatusAsync({ id, status: next });
      refetch();
    } catch {
      alert("به‌روزرسانی سفارش انجام نشد");
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) return <p className="text-sm text-[#85736f]">در حال بارگذاری...</p>;

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">خطا در دریافت سفارشات</p>
        <p className="text-sm text-[#85736f]">{error?.message || "خطای ناشناخته"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-[#1f1b1a]">سفارشات</h1>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="text-sm text-[#85736f] hover:text-[#1f1b1a] transition-colors"
        >
          خروج از ادمین
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e8dfdc] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8dfdc]">
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">شماره سفارش</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">مشتری</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">آدرس</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">مجموع</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">وضعیت</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any) => (
              <OrderRow key={order.id} order={order} onStatus={handleStatus} updatingId={updatingId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderRow({ order, onStatus, updatingId }: { order: any; onStatus: (id: string, status: string) => void; updatingId: string | null }) {
  const [open, setOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);

  const items = order.items ?? [];
  const total = items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);

  return (
    <tr className="border-b border-[#f0e6e4]">
      <td className="py-3 px-2 font-medium">{order.id}</td>
      <td className="py-3 px-2">{order.recipientName}</td>
      <td className="py-3 px-2 text-[#85736f]">{order.address}</td>
      <td className="py-3 px-2 font-medium">{total} تومان</td>
      <td className="py-3 px-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            order.status === "QUEUE"
              ? "bg-yellow-800/15 text-yellow-800"
              : order.status === "PREPARED"
              ? "bg-blue-800/15 text-blue-800"
              : "bg-green-800/15 text-green-800"
          }`}
        >
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </td>
      <td className="py-3 px-2">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setItemOpen(false);
          }}
          className="text-sm text-amber-800 hover:text-amber-900"
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {open && (
          <div className="ml-6 mt-2 space-y-2 text-xs text-[#85736f]">
            <p className="font-semibold">{items.length} تک سفارش</p>
            {items.map((item: any) => (
              <p key={item.id} className="truncate">
                {item.product?.name} × {item.quantity}
              </p>
            ))}
          </div>
        )}
      </td>
      <td className="py-3 px-2">
        {updatingId === order.id ? (
          <Loader2 size={16} className="animate-spin text-amber-800" />
        ) : (
          <button
            type="button"
            onClick={() => onStatus(order.id, order.status)}
            className="text-sm text-amber-800 hover:text-amber-900"
          >
            به‌روزرسانی
          </button>
        )}
      </td>
    </tr>
  );
}
