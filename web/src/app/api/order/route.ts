import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { orderSchema } from "@/types";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (user?.role !== "ADMIN") {
      return Response.json({ error: "دسترسی غیر مجاز" }, { status: 401 });
    }
    const orders = prisma.order.findMany({
      include: { items: { include: { product: true } } },
    });
    if ((await orders).length === 0) {
      return Response.json({ error: "سفارشی پیدا نشد" }, { status: 400 });
    }
    return orders;
  } catch (error) {
    return Response.json({ error: "سفارشی دریافت نشد" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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

    let totalPrice = 0;

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return Response.json(
          {
            error: `موجودی ${item.product.name} کافی نیست`,
          },
          { status: 400 },
        );
      }

      const discountedPrice =
        item.product.price - (item.product.price * item.product.discount) / 100;

      totalPrice += discountedPrice * item.quantity;
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
            create: cart.items.map((item) => {
              const unitPrice =
                item.product.price -
                (item.product.price * item.product.discount) / 100;

              return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
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
