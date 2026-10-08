import { requireRole } from "@/lib/apiSecurity";

export async function GET() {
  const authorization = await requireRole("ADMIN");
  if (authorization.response) return authorization.response;
  return Response.json({ ok: true, user: authorization.session.user });
}
