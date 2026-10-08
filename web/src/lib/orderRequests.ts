import { Order } from "@/types";
import { apiFetch } from "@/lib/apiFetch";

export async function addOrder(
  data: Pick<Order, "recipientName" | "phoneNumber" | "address">,
) {
  const response = await apiFetch("/api/order", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("سفارش ثبت نشد");
  }
  return response.json();
}
