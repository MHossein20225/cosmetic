import { prisma } from "@/lib/prisma";
import { userSchema } from "@/types";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = userSchema.omit({name: true,}).safeParse(body)

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

    const user = await prisma.user.findUnique({
      where: {
        email: email,
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
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("sessionId", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
      path: "/",
    });

    return Response.json({
      message: "ورود موفقیت‌آمیز بود",
    });

    return Response.json(
      {
        message: "ورود موفقیت‌آمیز بود",
        sessionId: session.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}
