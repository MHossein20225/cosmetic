import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ error: "برای دسترسی احراز هویت کنید" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return Response.json({ error: "Invalid order id" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    if (order.userId !== user.id && user.role !== "ADMIN") {
      return Response.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    }

    return Response.json(order);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "دریافت سفارش انجام نشد" }, { status: 500 });
  }
}
