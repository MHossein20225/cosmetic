import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

const updateOrderSchema = z.object({
  id: z.string(),
  status: z.enum(["QUEUE", "PREPARED", "DELIVERIED"]),
});

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(orders);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
  }

  const body = await req.json();
  const result = updateOrderSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: "فرمت داده‌ها معتبر نیست", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { id, status } = result.data;

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as Prisma.OrderUpdateInput["status"] },
  });

  return Response.json(order);
}
