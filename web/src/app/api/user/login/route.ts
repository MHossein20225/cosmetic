import { prisma } from "@/lib/prisma";
import { userSchema } from "@/types";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;



import { generateToken, validateCsrfToken } from "@/lib/csrf";

const CSRF_TOKEN = "csrfToken";
const CSRF_HEADER = "x-csrf-token";

async function isRateLimited(email: string): Promise<boolean> {
  const record = await prisma.rateLimit.findUnique({
    where: { email },
  });

  if (!record) {
    return false;
  }

  const expired = record.expiresAt < new Date();
  if (expired) {
    return false;
  }

  return record.count >= RATE_LIMIT_MAX_ATTEMPTS;
}

async function recordAttempt(email: string): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + RATE_LIMIT_WINDOW_MS);

  const existing = await prisma.rateLimit.findUnique({
    where: { email },
  });

  if (existing) {
    await prisma.rateLimit.update({
      where: { email },
      data: {
        count: existing.count + 1,
        expiresAt,
      },
    });
  } else {
    await prisma.rateLimit.create({
      data: {
        email,
        count: 1,
        expiresAt,
      },
    });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    if (!validateCsrfToken(cookieStore, req.headers)) {
      return Response.json(
        { error: "درخواست کد تحریم معتبر نیست" },
        { status: 403 }
      );
    }

    const result = userSchema.omit({ name: true }).safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: "اطلاعات وارد شده معتبر نیست",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const isLimited = await isRateLimited(email);
    if (isLimited) {
      return Response.json(
        { error: "تعداد تلاش‌های ورود زیاد است. لطفاً بعد از ۱ ساعت دوباره امتحان کنید." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      recordAttempt(email);
      return Response.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const confirmPassword = await bcrypt.compare(password, user.password);

    if (!confirmPassword) {
      recordAttempt(email);
      return Response.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    recordAttempt(email);
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt,
      },
    });

    const sessionToken = generateToken();
    const csrfToken = generateToken();

    // Persist CSRF token as an HttpOnly cookie so server-side validateCsrfToken
    // (cookie + header) succeeds, in addition to returning it in the JSON body.
    await (await cookies()).set(CSRF_TOKEN, csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    cookieStore.set("sessionId", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return Response.json({
      message: "ورود مووفقیت‌آمیز بود",
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      csrfToken,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}
