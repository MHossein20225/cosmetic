import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {

    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const productId = Number(body.productId);
    const quantity = Number(body.quantity ?? 1);

    if (!Number.isInteger(productId) || productId <= 0) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return Response.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const cart = await tx.cart.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id },
      });

      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      const currentQty = existingItem?.quantity ?? 0;

      if (currentQty + quantity > product.stock) {
        throw new Error("Not enough stock");
      }

      const cartItem = await tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        update: {
          quantity: currentQty + quantity,
        },
        create: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.price - product.price * (product.discount / 100),
        },
        include: {
          product: true,
        },
      });

      return cartItem;
    });

    if (result instanceof Error) {
      return Response.json(
        { error: result.message },
        result.message === "Not enough stock" ? { status: 400 } : { status: 500 }
      );
    }

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "Not enough stock") {
      return Response.json({ error: "Not enough stock" }, { status: 400 });
    }

    return Response.json(
      { error: "Failed to add product to cart" },
      { status: 500 }
    );
  }
}