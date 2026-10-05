import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validateCsrfToken } from "@/lib/csrf";
import { cookies } from "next/headers";

const CSRF_TOKEN = "csrfToken";
const CSRF_HEADER = "x-csrf-token";

type OrderDetailRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: OrderDetailRouteContext
) {

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    if (!validateCsrfToken(cookieStore, request.headers)) {
      return Response.json({ error: "درخواست کد تحریم معتبر نیست" }, { status: 403 });
    }

    const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "برای دسترسی احراز هویت کنید" }, { status: 401 });
  }

  const { id } = await params;

  if (!id || typeof id !== "string") {
    return Response.json({ error: "Invalid order id" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return Response.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }

  if (order.userId !== user.id && user.role !== "ADMIN") {
    return Response.json({ error: "دسترسی غیر مجاز" }, { status: 403 });
  }

  return Response.json(order);
}
