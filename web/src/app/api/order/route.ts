import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { orderSchema } from "@/types";
import { validateCsrfToken } from "@/lib/csrf";
import { cookies } from "next/headers";

const CSRF_TOKEN = "csrfToken";
const CSRF_HEADER = "x-csrf-token";

type OrderRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request) {

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "برای دسترسی احراز هویت کنید" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const myOrders = searchParams.get("my") === "1";

    let orders;
    if (myOrders) {
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else if (user.role !== "ADMIN") {
      return Response.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
    } else {
      orders = await prisma.order.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });
      if (orders.length === 0) {
        return Response.json({ error: "سفارشی پیدا نشد" }, { status: 400 });
      }
    }

    return Response.json(orders);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "سفارشی دریافت نشد" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!validateCsrfToken(cookieStore, req.headers)) {
      return Response.json({ error: "درخواست کد تحریم معتبر نیست" }, { status: 403 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ error: "ثبت نام نیاز است" }, { status: 401 });
    }
    const body = await req.json();
    const result = orderSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        {
          error: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const { recipientName, phoneNumber, address } = result.data;
    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) {
      return Response.json({ error: "سبد خرید پیدا نشد" }, { status: 404 });
    }
    if (cart.items.length === 0) {
      return Response.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }

    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new Error(`محصول ${item.productId} یافت نشد`);
        }
        if (item.quantity > product.stock) {
          throw new Error(`موجودی ${product.name} کافی نیست`);
        }
        const unitPrice =
          Math.round(product.price * (1 - product.discount / 100) * 100) / 100;
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
        };
      })
    );

    let totalPrice = 0;
    for (const item of orderItems) {
      totalPrice += item.unitPrice * item.quantity;
    }

    const deliveryTime = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          recipientName,
          phoneNumber,
          address,
          totalPrice,
          deliveryTime,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
      return newOrder;
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return Response.json(
      {
        message: "سفارش با موفقیت ثبت شد",
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: "ثبت سفارش انجام نشد" }, { status: 500 });
  }
}
