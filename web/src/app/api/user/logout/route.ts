import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken, CSRF_TOKEN_COOKIE, CSRF_HEADER, validateCsrfToken } from "@/lib/csrf";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  if (!validateCsrfToken(cookieStore, req.headers)) {
    return Response.json({ error: "درخواست کد تحریم معتبر نیست" }, { status: 403 });
  }

  const sessionId = cookieStore.get("sessionId")?.value;

  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
    cookieStore.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }

  const csrfToken = generateToken();
  cookieStore.set(CSRF_TOKEN_COOKIE, csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ success: true });
}