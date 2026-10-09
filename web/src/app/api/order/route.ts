import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { orderSchema } from "@/types";
import { authorizeMutation } from "@/lib/apiSecurity";
import { getProductPrice } from "@/lib/pricing";
import { runSerializable, TransactionConflictError } from "@/lib/transaction";

class StockError extends Error {}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const myOrdersOnly = new URL(request.url).searchParams.get("my") === "1";
    if (!myOrdersOnly && user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: myOrdersOnly ? { userId: user.id } : undefined,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET /api/order error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authorization = await authorizeMutation(req);
    if (authorization.response) return authorization.response;
    const user = authorization.session.user;

    const body = await req.json().catch(() => null);

    const result = orderSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      recipientName,
      phoneNumber,
      address,
    } = result.data;

    const order = await runSerializable(async (tx) => {
      const cart = await tx.cart.findUnique({
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
        throw new Error("CART_NOT_FOUND");
      }

      if (cart.items.length === 0) {
        throw new Error("CART_EMPTY");
      }

      const orderItems = cart.items.map((item) => {
        const product = item.product;

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
        }

        const unitPrice = getProductPrice(product);

        return {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
        };
      });

      for (const item of [...orderItems].sort((a, b) => a.productId - b.productId)) {
        const updatedProduct = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedProduct.count !== 1) {
          const product = cart.items.find(
            (cartItem) => cartItem.productId === item.productId,
          )?.product;

          throw new StockError(
            `موجودی ${product?.name ?? "محصول"} کافی نیست`,
          );
        }
      }

      const totalPrice = orderItems.reduce(
        (total, item) =>
          total + item.unitPrice * item.quantity,
        0,
      );
      if (!Number.isSafeInteger(totalPrice) || totalPrice > 2147483647) throw new Error("TOTAL_TOO_LARGE");

      const deliveryTime = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 3,
      );

   
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

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

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
    if (error instanceof TransactionConflictError) return Response.json({ error: error.message }, { status: 409 });
    if (error instanceof StockError) {
      return Response.json(
        {
          error: error.message,
        },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      if (error.message === "TOTAL_TOO_LARGE") return Response.json({ error: "Order total is too large" }, { status: 400 });
      if (error.message === "CART_NOT_FOUND") {
        return Response.json(
          {
            error: "سبد خرید پیدا نشد",
          },
          { status: 404 },
        );
      }

      if (error.message === "CART_EMPTY") {
        return Response.json(
          {
            error: "سبد خرید خالی است",
          },
          { status: 400 },
        );
      }

      if (error.message.startsWith("PRODUCT_NOT_FOUND:")) {
        const productId = error.message.split(":")[1];

        return Response.json(
          {
            error: `محصول ${productId} پیدا نشد`,
          },
          { status: 404 },
        );
      }
    }

    console.error("POST /api/order error:", error);

    return Response.json(
      {
        error: "ثبت سفارش انجام نشد",
      },
      { status: 500 },
    );
  }
}
