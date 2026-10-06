import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validateCsrfToken } from "@/lib/csrf";
import { cookies } from "next/headers";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const cart = await prisma.cart.findUnique({
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
    return Response.json({
      id: null,
      items: [],
    });
  }

  return Response.json(cart);
}


export async function POST() {
  const cookieStore = await cookies();
  if (!validateCsrfToken(cookieStore, new Headers())) {
    return Response.json({ error: "درخواست کد تحریم معتبر نیست" }, { status: 403 });
  }

  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const cart = await prisma.cart.upsert({
    where: {
      userId: user.id,
    },
    update: {},
    create: {
      userId: user.id,
    },
  });

  return Response.json(cart, { status: 200 });
}


export async function DELETE() {
  const cookieStore = await cookies();
  if (!validateCsrfToken(cookieStore, new Headers())) {
    return Response.json({ error: "درخواست کد تحریم معتبر نیست" }, { status: 403 });
  }

  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!cart) {
    return Response.json({ success: true });
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return Response.json({ success: true });
}