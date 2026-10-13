export type OrderStatus = "QUEUE" | "PREPARED" | "DELIVERED";

export const orderStatusLabels: Record<OrderStatus, string> = {
  QUEUE: "در صف پردازش",
  PREPARED: "آماده ارسال",
  DELIVERED: "تحویل داده شد",
};

export function getOrderStatusLabel(status: string): string {
  return status in orderStatusLabels
    ? orderStatusLabels[status as OrderStatus]
    : "وضعیت نامشخص";
}
