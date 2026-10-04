import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
  }

  return Response.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
