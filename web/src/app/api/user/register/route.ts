import { prisma } from "@/lib/prisma";
import { userSchema } from "@/types";
import bcrypt from "bcryptjs";
import { consumeRateLimits, getClientIp, getNetworkKey, rateLimitResponse } from "@/lib/rateLimit";
import { isSameOriginRequest } from "@/lib/csrf";

export async function POST(req: Request) {
  try {
    if (!isSameOriginRequest(req)) return Response.json({ error: "Invalid request" }, { status: 403 });
    const ip = getClientIp(req);
    const registrationLimit = await consumeRateLimits([
      { key: `register:ip:${ip}`, limit: 5, windowMs: 60 * 60 * 1000 },
      { key: `register:network:${getNetworkKey(ip)}`, limit: 30, windowMs: 24 * 60 * 60 * 1000 },
    ]);
    if (!registrationLimit.allowed) return rateLimitResponse(registrationLimit);

    const body = await req.json().catch(() => null);
    const result = userSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: "اطلاعات وارد شده معتبر نیست",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
      select: {
        email: true
      }
    });

    if (existingUser) {
      return Response.json(
        { error: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return Response.json(
      {
        message: "کاربر اضافه شد",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return Response.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 409 });
    console.error("Registration failed", error instanceof Error ? error.name : "Unknown error");

    return Response.json(
      {
        error: "خطا در ایجاد کاربر",
      },
      { status: 500 },
    );
  }
}
