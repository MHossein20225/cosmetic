import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validateCsrfToken } from "@/lib/csrf";
import { cookies } from "next/headers";

const CSRF_TOKEN = "csrfToken";
const CSRF_HEADER = "x-csrf-token";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (!validateCsrfToken(cookieStore, request.headers)) {
    return Response.json({ error: "درخواست کد تحریم معتبر نیست" }, { status: 403 });
  }

  const user = await getCurrentUser();

  if (user?.role !== "ADMIN") {
    return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
  }

  const users = await prisma.user.findMany();
  if (users.length === 0) {
    return Response.json({ error: "کاربری وجود ندارد" }, { status: 403 });
  }
  return Response.json(users);
}