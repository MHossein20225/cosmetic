import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) return null;

  let session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }

  if (!session.csrfToken) {
    const csrfToken = randomBytes(32).toString("base64url");
    await prisma.session.updateMany({
      where: { id: session.id, csrfToken: null },
      data: { csrfToken },
    });
    session = await prisma.session.findUnique({
      where: { id: session.id },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}
