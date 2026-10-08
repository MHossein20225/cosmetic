import { timingSafeEqual } from "node:crypto";

export const CSRF_HEADER = "x-csrf-token";

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
