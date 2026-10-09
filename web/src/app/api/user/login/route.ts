import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { userSchema } from "@/types";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { consumeRateLimits, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { isSameOriginRequest } from "@/lib/csrf";

export async function POST(req: Request) {
  try {
    if (!isSameOriginRequest(req)) return Response.json({ error: "Invalid request" }, { status: 403 });
    const curruntUser = await getCurrentUser();
    if (curruntUser) {
      return Response.json({ error: "شما ورود کرده اید" }, { status: 401 });
    }
    
    const ip = getClientIp(req);
    const ipLimit = await consumeRateLimits([
      { key: `login:ip:${ip}`, limit: 10, windowMs: 60 * 60 * 1000 },
    ]);
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);

    const body = await req.json().catch(() => null);
    const cookieStore = await cookies();

    const result = userSchema.omit({ name: true }).safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: "اطلاعات وارد شده معتبر نیست",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = result.data;
    const accountLimit = await consumeRateLimits([
      { key: `login:account:${email.trim().toLowerCase()}`, limit: 10, windowMs: 60 * 60 * 1000 },
    ]);
    if (!accountLimit.allowed) return rateLimitResponse(accountLimit);

    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
    });

    if (!user) {
      return Response.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 },
      );
    }

    const confirmPassword = await bcrypt.compare(password, user.password);

    if (!confirmPassword) {
      return Response.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 },
      );
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt,
        id: randomBytes(32).toString("base64url"),
        csrfToken: randomBytes(32).toString("base64url"),
      },
    });

    cookieStore.set("sessionId", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return Response.json({
      message: "ورود موفقیت‌آمیز بود",
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login failed", error instanceof Error ? error.name : "Unknown error");

    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}
