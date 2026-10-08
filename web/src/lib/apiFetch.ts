"use client";

let cachedCsrfToken: string | null = null;
let csrfRequest: Promise<string | null> | null = null;

export function clearCsrfTokenCache() {
  cachedCsrfToken = null;
  csrfRequest = null;
}

async function getCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;
  if (!csrfRequest) {
    csrfRequest = fetch("/api/csrf", { method: "GET", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const body = (await response.json()) as { csrfToken?: string };
        cachedCsrfToken = typeof body.csrfToken === "string" ? body.csrfToken : null;
        return cachedCsrfToken;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }
  return csrfRequest;
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return fetch(input, init);

  const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const path = new URL(rawUrl, window.location.origin).pathname;
  const isPublicAuthMutation = path === "/api/user/login" || path === "/api/user/register";
  if (isPublicAuthMutation) return fetch(input, init);

  const csrfToken = await getCsrfToken();
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  if (csrfToken) headers.set("x-csrf-token", csrfToken);
  return fetch(input, { ...init, headers });
}
