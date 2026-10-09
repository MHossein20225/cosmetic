import { Order } from "@/types";
import { apiFetch } from "@/lib/apiFetch";

export async function addOrder(
  data: Pick<Order, "recipientName" | "phoneNumber" | "address">,
) {
  const response = await apiFetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(typeof body?.error === "string" ? body.error : "سفارش ثبت نشد");
  }
  return response.json();
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await fetch("/api/order?my=1");
  if (!response.ok) throw new Error("دریافت سفارشات انجام نشد");
  return response.json();
}

export async function getOrder(id: string): Promise<Order> {
  const response = await fetch(`/api/order/${encodeURIComponent(id)}`);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(typeof body?.error === "string" ? body.error : "دریافت سفارش انجام نشد");
  }
  return response.json();
}
