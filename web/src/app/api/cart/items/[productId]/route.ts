import { prisma } from "@/lib/prisma";
import { authorizeMutation } from "@/lib/apiSecurity";
import { cartQuantitySchema } from "@/types";
import { getProductPrice } from "@/lib/pricing";
import { runSerializable, TransactionConflictError } from "@/lib/transaction";

export async function PATCH(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const authorization = await authorizeMutation(request);
    if (authorization.response) return authorization.response;
    const id = Number((await params).productId);
    const result = cartQuantitySchema.safeParse(await request.json().catch(() => null));
    if (!Number.isInteger(id) || id <= 0 || id > 2147483647 || !result.success) {
      return Response.json({ error: "Invalid product or quantity" }, { status: 400 });
    }
    const { quantity } = result.data;

    const updated = await runSerializable(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { userId: authorization.session.user.id } });
      if (!cart) throw new Error("Cart not found");
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) throw new Error("Product not found");
      if (quantity > product.stock) throw new Error("Not enough stock");
      return tx.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId: id } },
        data: { quantity, unitPrice: getProductPrice(product) },
        include: { product: true },
      });
    });
    return Response.json(updated);
  } catch (error) {
    if (error instanceof TransactionConflictError) return Response.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && error.message === "Not enough stock") return Response.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && ["Cart not found", "Product not found"].includes(error.message)) return Response.json({ error: error.message }, { status: 404 });
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
    if (!Number.isInteger(id) || id <= 0 || id > 2147483647) return Response.json({ error: "Invalid product ID" }, { status: 400 });

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
