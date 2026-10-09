"use client";

import { useRouter } from "next/navigation";
import { useAdminOrders } from "@/hooks/adminHooks";
import OrderRow from "@/components/OrderRow";
import { toast } from "sonner";
import type { Status } from "@/types";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { orders, isLoading, isError, error, updateOrderStatus } = useAdminOrders();

  function handleStatus(id: string, status: Status) {
    updateOrderStatus.mutate({ id, status }, {
      onError: (error) => toast.error(error.message),
      onSuccess: () => toast.success("وضعیت سفارش به‌روزرسانی شد"),
    });
  }

  if (isLoading) return <p className="text-sm text-[#85736f]">در حال بارگذاری...</p>;
  if (isError) return <p role="alert" className="text-red-600">{error?.message || "دریافت سفارشات انجام نشد"}</p>;


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

      <div className="bg-white rounded-xl border border-[#e8dfdc] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8dfdc]">
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">شماره سفارش</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">مشتری</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">آدرس</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">مجموع</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">وضعیت</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">جزئیات</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <OrderRow key={order.id} order={order} onStatus={handleStatus} updatingId={updateOrderStatus.isPending ? updateOrderStatus.variables.id : null} />
            ))}
            {!orders?.length && <tr><td colSpan={7} className="p-5 text-[#85736f]">سفارشی یافت نشد</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
