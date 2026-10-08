import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { authorizeMutation } from "@/lib/apiSecurity";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });
  return Response.json(cart ?? { id: null, items: [] });
}

export async function POST(request: Request) {
  const authorization = await authorizeMutation(request);
  if (authorization.response) return authorization.response;
  const cart = await prisma.cart.upsert({
    where: { userId: authorization.session.user.id },
    update: {},
    create: { userId: authorization.session.user.id },
  });
  return Response.json(cart);
}

export async function DELETE(request: Request) {
  const authorization = await authorizeMutation(request);
  if (authorization.response) return authorization.response;
  const cart = await prisma.cart.findUnique({
    where: { userId: authorization.session.user.id },
  });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return Response.json({ success: true });
}
