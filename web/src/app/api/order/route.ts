import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { orderSchema } from "@/types";
import { authorizeMutation } from "@/lib/apiSecurity";

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

    const {
      recipientName,
      phoneNumber,
      address,
    } = result.data;

    const order = await prisma.$transaction(async (tx) => {
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

        const unitPrice = Math.round(
          product.price * (1 - product.discount / 100),
        );

        return {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
        };
      });

      for (const item of orderItems) {
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
            `Ù…ÙˆØ¬ÙˆØ¯ÛŒ ${product?.name ?? "Ù…Ø­ØµÙˆÙ„"} Ú©Ø§ÙÛŒ Ù†ÛŒØ³Øª`,
          );
        }
      }

      const totalPrice = orderItems.reduce(
        (total, item) =>
          total + item.unitPrice * item.quantity,
        0,
      );

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
        message: "Ø³ÙØ§Ø±Ø´ Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø«Ø¨Øª Ø´Ø¯",
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof StockError) {
      return Response.json(
        {
          error: error.message,
        },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      if (error.message === "CART_NOT_FOUND") {
        return Response.json(
          {
            error: "Ø³Ø¨Ø¯ Ø®Ø±ÛŒØ¯ Ù¾ÛŒØ¯Ø§ Ù†Ø´Ø¯",
          },
          { status: 404 },
        );
      }

      if (error.message === "CART_EMPTY") {
        return Response.json(
          {
            error: "Ø³Ø¨Ø¯ Ø®Ø±ÛŒØ¯ Ø®Ø§Ù„ÛŒ Ø§Ø³Øª",
          },
          { status: 400 },
        );
      }

      if (error.message.startsWith("PRODUCT_NOT_FOUND:")) {
        const productId = error.message.split(":")[1];

        return Response.json(
          {
            error: `Ù…Ø­ØµÙˆÙ„ ${productId} Ù¾ÛŒØ¯Ø§ Ù†Ø´Ø¯`,
          },
          { status: 404 },
        );
      }
    }

    console.error("POST /api/order error:", error);

    return Response.json(
      {
        error: "Ø«Ø¨Øª Ø³ÙØ§Ø±Ø´ Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯",
      },
      { status: 500 },
    );
  }
}
