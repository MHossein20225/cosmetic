import { authorizeMutation } from "@/lib/apiSecurity";
import { cartItemSchema } from "@/types";
import { getProductPrice } from "@/lib/pricing";
import { runSerializable, TransactionConflictError } from "@/lib/transaction";

export async function POST(req: Request) {
  try {

    const authorization = await authorizeMutation(req);
    if (authorization.response) return authorization.response;
    const user = authorization.session.user;

    const result = cartItemSchema.safeParse(await req.json().catch(() => null));
    if (!result.success) return Response.json({ error: "Invalid product or quantity" }, { status: 400 });
    const { productId, quantity } = result.data;

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

    const cartItemResult = await runSerializable(async (tx) => {
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
          unitPrice: getProductPrice(product),
        },
        create: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: getProductPrice(product),
        },
        include: {
          product: true,
        },
      });

      return cartItem;
    });

    return Response.json(cartItemResult, { status: 201 });
  } catch (error) {
    if (error instanceof TransactionConflictError) return Response.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && error.message === "Product not found") {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    if (error instanceof Error && error.message === "Not enough stock") {
      return Response.json({ error: "Not enough stock" }, { status: 409 });
    }

    console.error("Failed to add product to cart");
    return Response.json(
      { error: "Failed to add product to cart" },
      { status: 500 }
    );
  }
}
