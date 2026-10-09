import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorizeMutation, requireRole } from "@/lib/apiSecurity";

const updateOrderSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["QUEUE", "PREPARED", "DELIVERED"]),
}).strict();

export async function GET() {
  const authorization = await requireRole("ADMIN");
  if (authorization.response) return authorization.response;
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(orders);
}

export async function PATCH(request: Request) {
  const authorization = await authorizeMutation(request, "ADMIN");
  if (authorization.response) return authorization.response;

  try {
    const result = updateOrderSchema.safeParse(await request.json().catch(() => null));
    if (!result.success) return Response.json({ error: "Invalid order update" }, { status: 400 });
    const currentOrder = await prisma.order.findUnique({ where: { id: result.data.id } });
    if (!currentOrder) return Response.json({ error: "Order not found" }, { status: 404 });
    if (currentOrder.status === result.data.status) return Response.json(currentOrder);
    const nextStatus = currentOrder.status === "QUEUE" ? "PREPARED" : currentOrder.status === "PREPARED" ? "DELIVERED" : null;
    if (result.data.status !== nextStatus) return Response.json({ error: "Invalid status transition" }, { status: 409 });
    const updated = await prisma.order.updateMany({
      where: { id: currentOrder.id, status: currentOrder.status },
      data: { status: result.data.status },
    });
    if (updated.count !== 1) return Response.json({ error: "Order changed. Please refresh." }, { status: 409 });
    const order = await prisma.order.findUnique({ where: { id: currentOrder.id } });
    return Response.json(order);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    console.error("PATCH /api/admin/orders error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
