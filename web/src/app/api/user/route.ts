import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiSecurity";

export async function GET() {
  const authorization = await requireRole("ADMIN");
  if (authorization.response) return authorization.response;

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(users);
}
