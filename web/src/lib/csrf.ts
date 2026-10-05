export const CSRF_TOKEN_COOKIE = "csrfToken";
export const CSRF_HEADER = "x-csrf-token";

export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Validate that the incoming request has a matching CSRF token.
 * Call this at the start of state-changing API routes.
 *
 * @param cookieStore - from `cookies()` in server components/route handlers
 * @param requestHeaders - from `request.headers` in route handlers
 * @returns true if the token matches (or if no CSRF token was issued)
 */
import type { cookies } from "next/headers";

export function validateCsrfToken(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  requestHeaders: Headers,
): boolean {
  const cookieToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value ?? "";
  const headerToken = requestHeaders.get(CSRF_HEADER) ?? "";
  return cookieToken === headerToken;
}
