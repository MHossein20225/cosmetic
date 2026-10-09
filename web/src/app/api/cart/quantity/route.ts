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
      return Response.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    const cartItem = await runSerializable(async (tx) => {
    // Get the user's cart
    const cart = await tx.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Get the product
    const product = await tx.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const existingItem = await tx.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    });
    const nextQuantity = (existingItem?.quantity ?? 0) + quantity;
    if (product.stock < nextQuantity) {
      throw new Error("Not enough stock");
    }

    return tx.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
      update: {
        unitPrice: getProductPrice(product),
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity,
        unitPrice: getProductPrice(product),
      },
      include: {
        product: true,
      },
    });
    });

    return Response.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof TransactionConflictError) return Response.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && error.message === "Not enough stock") return Response.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && ["Cart not found", "Product not found"].includes(error.message)) return Response.json({ error: error.message }, { status: 404 });
    console.error(error);

    return Response.json(
      { error: "Failed to add product to cart" },
      { status: 500 }
    );
  }
}
