import { getCurrentSession } from "@/lib/session";
import { validateCsrfToken } from "@/lib/csrf";
import { consumeRateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import type { Role } from "@/types";

export async function authorizeMutation(request: Request, role?: Role) {
  const session = await getCurrentSession();
  if (!session) {
    return { session: null, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (role && session.user.role !== role) {
    return { session: null, response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }
  if (!validateCsrfToken(request.headers, session.csrfToken)) {
    return { session: null, response: Response.json({ error: "Invalid request" }, { status: 403 }) };
  }
  if (role === "ADMIN") {
    const decision = await consumeRateLimit(
      `admin-mutation:user:${session.user.id}:ip:${getClientIp(request)}`,
      120,
      10 * 60 * 1000,
    );
    if (!decision.allowed) return { session: null, response: rateLimitResponse(decision) };
  }
  return { session, response: null };
}

export async function requireRole(role: Role) {
  const session = await getCurrentSession();
  if (!session) {
    return { session: null, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== role) {
    return { session: null, response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, response: null };
}
