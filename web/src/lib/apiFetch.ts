"use client";

let cachedCsrfToken: string | null = null;
let csrfRequest: Promise<string | null> | null = null;
let csrfGeneration = 0;

export function clearCsrfTokenCache() {
  csrfGeneration += 1;
  cachedCsrfToken = null;
  csrfRequest = null;
}

async function getCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;
  if (!csrfRequest) {
    const generation = csrfGeneration;
    csrfRequest = fetch("/api/csrf", { method: "GET", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const body = (await response.json()) as { csrfToken?: string };
        if (generation !== csrfGeneration) return null;
        cachedCsrfToken = typeof body.csrfToken === "string" ? body.csrfToken : null;
        return cachedCsrfToken;
      })
      .finally(() => {
        if (generation === csrfGeneration) csrfRequest = null;
      });
  }
  return csrfRequest;
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return fetch(input, init);

  const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(rawUrl, window.location.origin);
  if (url.origin !== window.location.origin) return fetch(input, init);
  const path = url.pathname;
  const isPublicAuthMutation = path === "/api/user/login" || path === "/api/user/register";
  if (isPublicAuthMutation) return fetch(input, init);

  const csrfToken = await getCsrfToken();
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  if (csrfToken) headers.set("x-csrf-token", csrfToken);
  const retryInput = input instanceof Request ? input.clone() : input;
  const response = await fetch(input, { ...init, headers });
  if (response.status === 403) {
    const body = await response.clone().json().catch(() => null);
    if (body?.error === "Invalid request") {
      clearCsrfTokenCache();
      const refreshedToken = await getCsrfToken();
      if (refreshedToken && refreshedToken !== csrfToken) {
        headers.set("x-csrf-token", refreshedToken);
        return fetch(retryInput, { ...init, headers });
      }
    }
  }
  return response;
}
