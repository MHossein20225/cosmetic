import {
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { formatToman } from "@/lib/pricing";
import { orderStatusLabels } from "@/lib/orderPresentation";

type OrderStatus = "QUEUE" | "PREPARED" | "DELIVERED";

type OrderItem = {
  id: string;
  productId: number | null;
  productName: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderItem[];
};

type OrderRowProps = {
  order: Order;
  onStatus: (id: string, status: OrderStatus) => void;
  updatingId: string | null;
};


export default function OrderRow({
  order,
  onStatus,
  updatingId,
}: OrderRowProps) {
  const [open, setOpen] = useState(false);

  const isUpdating = updatingId === order.id;

  return (
    <tr className="border-b border-[#f0e6e4]">
      <td className="px-2 py-3 font-medium">
        {order.id}
      </td>

      <td className="px-2 py-3">
        {order.recipientName}
      </td>

      <td className="px-2 py-3 text-[#85736f]">
        {order.address}
      </td>

      <td className="px-2 py-3 font-medium">
        {formatToman(order.totalPrice)}
      </td>

      <td className="px-2 py-3">
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            order.status === "QUEUE"
              ? "bg-yellow-800/15 text-yellow-800"
              : order.status === "PREPARED"
                ? "bg-blue-800/15 text-blue-800"
                : "bg-green-800/15 text-green-800"
          }`}
        >
              {orderStatusLabels[order.status]}
        </span>
      </td>

      <td className="px-2 py-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-amber-800 hover:text-amber-900"
          aria-label={
            open
              ? "بستن جزئیات سفارش"
              : "نمایش جزئیات سفارش"
          }
        >
          {open ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        {open && (
          <div className="ms-6 mt-2 space-y-2 text-xs text-[#85736f]">
            <p className="font-semibold">
              {order.items.length} آیتم
            </p>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate">
                  {item.productName}
                </span>

                <span className="shrink-0">
                  {item.quantity.toLocaleString("fa-IR")} ×{" "}
                  {formatToman(item.unitPrice)}
                </span>
              </div>
            ))}
          </div>
        )}
      </td>

      <td className="px-2 py-3">
        {isUpdating ? (
          <Loader2
            size={16}
            className="animate-spin text-amber-800"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              const nextStatus: OrderStatus | null =
                order.status === "QUEUE"
                  ? "PREPARED"
                  : order.status === "PREPARED"
                    ? "DELIVERED"
                    : null;

              if (nextStatus) {
                onStatus(order.id, nextStatus);
              }
            }}
            disabled={order.status === "DELIVERED"}
            className="text-sm text-amber-800 hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {order.status === "DELIVERED"
              ? "تکمیل شده"
              : "به‌روزرسانی"}
          </button>
        )}
      </td>
    </tr>
  );
}

