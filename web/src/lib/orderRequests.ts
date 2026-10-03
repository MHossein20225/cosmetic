import { Order } from "@/types";

export async function addOrder(
  data: Pick<Order, "recipientName" | "phoneNumber" | "address">,
) {
  const response = await fetch("/api/order", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("سفارش ثبت نشد");
  }
  return response.json();
}
