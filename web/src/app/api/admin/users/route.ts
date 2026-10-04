import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { userSchema } from "@/types";
import bcrypt from "bcryptjs";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return Response.json(users);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
  }

  const body = await req.json();
  const result = userSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: "اطلاعات وارد شده معتبر نیست", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, password } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return Response.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "ADMIN" },
  });

  return Response.json({ message: "کاربر با نقش ادمین اضافه شد" }, { status: 201 });
}
