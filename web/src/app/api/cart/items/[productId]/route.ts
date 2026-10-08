import { prisma } from "@/lib/prisma";
import { authorizeMutation } from "@/lib/apiSecurity";

export async function PATCH(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const authorization = await authorizeMutation(request);
    if (authorization.response) return authorization.response;
    const id = Number((await params).productId);
    const body = await request.json();
    const quantity = Number(body.quantity);
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(quantity) || quantity < 1) {
      return Response.json({ error: "Invalid product or quantity" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: authorization.session.user.id } });
    if (!cart) return Response.json({ error: "Cart not found" }, { status: 404 });
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
    if (quantity > product.stock) return Response.json({ error: "Not enough stock" }, { status: 409 });

    const updated = await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId: id } },
      data: { quantity },
      include: { product: true },
    });
    return Response.json(updated);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return Response.json({ error: "Cart item not found" }, { status: 404 });
    }
    console.error(error);
    return Response.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const authorization = await authorizeMutation(request);
    if (authorization.response) return authorization.response;
    const id = Number((await params).productId);
    if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Invalid product ID" }, { status: 400 });

    const cart = await prisma.cart.findUnique({ where: { userId: authorization.session.user.id } });
    if (!cart) return Response.json({ error: "Cart not found" }, { status: 404 });
    const result = await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: id } });
    if (result.count === 0) return Response.json({ error: "Item not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}
