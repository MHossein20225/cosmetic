import { prisma } from "@/lib/prisma";
import { authorizeMutation } from "@/lib/apiSecurity";

export async function POST(req: Request) {
  try {
    const authorization = await authorizeMutation(req);
    if (authorization.response) return authorization.response;
    const user = authorization.session.user;

    const { productId: rawProductId, quantity: rawQuantity } = await req.json();
    const productId = Number(rawProductId);
    const quantity = Number(rawQuantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return Response.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    // Get the user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!cart) {
      return Response.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // Get the product
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    });
    const nextQuantity = (existingItem?.quantity ?? 0) + quantity;
    if (product.stock < nextQuantity) {
      return Response.json(
        { error: "Not enough stock" },
        { status: 409 }
      );
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity,
        unitPrice: Math.round(product.price * (1 - product.discount / 100)),
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
