import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorizeMutation, requireRole } from "@/lib/apiSecurity";

const roleUpdateSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["CUSTOMER", "ADMIN"]),
}).strict();

export async function GET() {
  const authorization = await requireRole("ADMIN");
  if (authorization.response) return authorization.response;
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(users);
}

export async function PATCH(request: Request) {
  const authorization = await authorizeMutation(request, "ADMIN");
  if (authorization.response) return authorization.response;

  try {
    const result = roleUpdateSchema.safeParse(await request.json().catch(() => null));
    if (!result.success) return Response.json({ error: "Invalid user role update" }, { status: 400 });
    if (result.data.id === authorization.session.user.id) {
      return Response.json({ error: "You cannot change your own role" }, { status: 403 });
    }
    const user = await prisma.user.update({
      where: { id: result.data.id },
      data: { role: result.data.role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return Response.json(user);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    console.error("PATCH /api/admin/users error:", error);
    return Response.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
