import { prisma } from "@/lib/prisma";
import { userSchema } from "@/types";
import bcrypt from "bcryptjs";
import { consumeRateLimits, getClientIp, getNetworkKey, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const registrationLimit = await consumeRateLimits([
      { key: `register:ip:${ip}`, limit: 5, windowMs: 60 * 60 * 1000 },
      { key: `register:network:${getNetworkKey(ip)}`, limit: 30, windowMs: 24 * 60 * 60 * 1000 },
    ]);
    if (!registrationLimit.allowed) return rateLimitResponse(registrationLimit);

    const body = await req.json();
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

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
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
    console.error(error);

    return Response.json(
      {
        error: "خطا در ایجاد کاربر",
      },
      { status: 500 },
    );
  }
}
