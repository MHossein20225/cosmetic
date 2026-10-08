import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { authorizeMutation } from "@/lib/apiSecurity";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("sessionId")?.value;

  if (sessionId) {
    const authorization = await authorizeMutation(req);
    if (authorization.response && authorization.response.status !== 401) {
      return authorization.response;
    }
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }

  cookieStore.set("sessionId", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return Response.json({ success: true });
}
