import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validateCsrfToken } from "@/lib/csrf";
import { cookies } from "next/headers";

export async function PATCH(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {

    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await params;
    const id = Number(productId);

    if (!Number.isInteger(id) || id <= 0) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const quantity = Number(body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return Response.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return Response.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: id,
        },
      },
    });

    if (!cartItem) {
      return Response.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (quantity > product.stock) {
      return Response.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    const updated = await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: id,
        },
      },
      data: { quantity },
      include: {
        product: true,
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const cookieStore = await cookies();
    if (!validateCsrfToken(cookieStore, req.headers)) {
      return Response.json({ error: "درخواست کد تحریم معتبر نیست" }, { status: 403 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await params;
    const id = Number(productId);

    if (!Number.isInteger(id) || id <= 0) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return Response.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: id,
        },
      },
    });

    if (!cartItem) {
      return Response.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: id,
        },
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}