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

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    const currentQty = existingItem?.quantity ?? 0;

    if (currentQty + quantity > product.stock) {
      return Response.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.upsert({
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
        unitPrice: product.price,
      },
      include: {
        product: true,
      },
    });

    return Response.json(cartItem, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to add product to cart" },
      { status: 500 }
    );
  }
}