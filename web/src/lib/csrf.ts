import { timingSafeEqual } from "node:crypto";

export const CSRF_HEADER = "x-csrf-token";

export function isSameOriginRequest(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(process.env.APP_ORIGIN ?? request.url).origin;
}

export function validateCsrfToken(
  requestHeaders: Headers,
  expectedToken: string | null | undefined,
): boolean {
  const providedToken = requestHeaders.get(CSRF_HEADER);
  if (!providedToken || !expectedToken) return false;
  const provided = Buffer.from(providedToken, "utf8");
  const expected = Buffer.from(expectedToken, "utf8");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
