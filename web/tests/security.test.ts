import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { isSameOriginRequest, validateCsrfToken } from "../src/lib/csrf";
import { getClientIp, getNetworkKey } from "../src/lib/rateLimit";
import { getProductPrice } from "../src/lib/pricing";
import { cartItemSchema, orderSchema, productSchema, userSchema } from "../src/types";
import { apiFetch, clearCsrfTokenCache } from "../src/lib/apiFetch";

test("CSRF fails closed and requires the exact random session token", () => {
  const token = randomBytes(32).toString("base64url");
  assert.equal(validateCsrfToken(new Headers(), token), false);
  assert.equal(validateCsrfToken(new Headers(), null), false);
  assert.equal(validateCsrfToken(new Headers({ "x-csrf-token": "wrong" }), token), false);
  assert.equal(validateCsrfToken(new Headers({ "x-csrf-token": randomBytes(32).toString("base64url") }), token), false);
  assert.equal(validateCsrfToken(new Headers({ "x-csrf-token": token }), token), true);
});

test("cross-site authentication requests are rejected", () => {
  assert.equal(isSameOriginRequest(new Request("https://shop.example/api/user/login", { headers: { origin: "https://attacker.example" } })), false);
  assert.equal(isSameOriginRequest(new Request("https://shop.example/api/user/login", { headers: { origin: "https://shop.example" } })), true);
  assert.equal(isSameOriginRequest(new Request("https://shop.example/api/user/login", { headers: { "sec-fetch-site": "cross-site" } })), false);
});

test("untrusted forwarding headers are ignored without explicit proxy trust", () => {
  const previous = process.env.TRUST_PROXY;
  const previousHeader = process.env.RATE_LIMIT_IP_HEADER;
  try {
    delete process.env.TRUST_PROXY;
    delete process.env.RATE_LIMIT_IP_HEADER;
    const spoofed = new Request("https://shop.example", {
      headers: { "x-forwarded-for": "198.51.100.10", "x-real-ip": "203.0.113.20" },
    });
    assert.equal(getClientIp(spoofed), "unknown");
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY; else process.env.TRUST_PROXY = previous;
    if (previousHeader === undefined) delete process.env.RATE_LIMIT_IP_HEADER; else process.env.RATE_LIMIT_IP_HEADER = previousHeader;
  }
});

test("missing or invalid trusted-proxy values fail closed", () => {
  const previous = process.env.TRUST_PROXY;
  const previousHeader = process.env.RATE_LIMIT_IP_HEADER;
  try {
    process.env.TRUST_PROXY = "yes";
    process.env.RATE_LIMIT_IP_HEADER = "x-forwarded-for";
    assert.equal(getClientIp(new Request("https://shop.example", {
      headers: { "x-forwarded-for": "198.51.100.10" },
    })), "unknown");

    process.env.TRUST_PROXY = "true";
    assert.equal(getClientIp(new Request("https://shop.example", {
      headers: { "x-forwarded-for": "not-an-ip" },
    })), "unknown");

    process.env.RATE_LIMIT_IP_HEADER = "x-verified-client-ip";
    assert.equal(getClientIp(new Request("https://shop.example", {
      headers: { "x-forwarded-for": "198.51.100.10" },
    })), "unknown");
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY; else process.env.TRUST_PROXY = previous;
    if (previousHeader === undefined) delete process.env.RATE_LIMIT_IP_HEADER; else process.env.RATE_LIMIT_IP_HEADER = previousHeader;
  }
});

test("Compose exposes only the proxy and the proxy overwrites the IP header", () => {
  const compose = readFileSync("docker-compose.yml", "utf8");
  const proxyConfig = readFileSync("nginx/default.conf", "utf8");
  const dbService = compose.match(/  db:\n([\s\S]*?)(?=\n  [a-z][a-z0-9_-]*:\n|\nnetworks:)/)?.[1] ?? "";
  const webService = compose.match(/  web:\n([\s\S]*?)(?=\n  [a-z][a-z0-9_-]*:\n|\nnetworks:)/)?.[1] ?? "";

  assert.match(dbService, /127\.0\.0\.1:5432:5432/);
  assert.match(webService, /expose:\n\s+- "3000"/);
  assert.doesNotMatch(webService, /ports:/);
  assert.match(webService, /TRUST_PROXY: "true"/);
  assert.match(webService, /RATE_LIMIT_IP_HEADER: "x-forwarded-for"/);
  assert.match(proxyConfig, /proxy_set_header X-Forwarded-For \$remote_addr;/);
  assert.doesNotMatch(proxyConfig, /proxy_add_x_forwarded_for/);
});

test("configured trusted proxy addresses resolve independently and IPv6 networks normalize", () => {
  const previous = process.env.TRUST_PROXY;
  const previousHeader = process.env.RATE_LIMIT_IP_HEADER;
  try {
    process.env.TRUST_PROXY = "true";
    process.env.RATE_LIMIT_IP_HEADER = "x-forwarded-for";
    const first = new Request("https://shop.example", { headers: { "x-forwarded-for": "198.51.100.10" } });
    const second = new Request("https://shop.example", { headers: { "x-forwarded-for": "203.0.113.20" } });
    const firstIp = getClientIp(first);
    const secondIp = getClientIp(second);
    assert.equal(firstIp, "198.51.100.10");
    assert.equal(secondIp, "203.0.113.20");
    assert.notEqual(`product-search:ip:${firstIp}`, `product-search:ip:${secondIp}`);
    assert.equal(getClientIp(new Request("https://shop.example", {
      headers: { "x-forwarded-for": "198.51.100.99, 198.51.100.10" },
    })), "198.51.100.10");
    assert.equal(getNetworkKey("2001:db8::1"), getNetworkKey("2001:0db8:0:0:0:0:0:2"));
    assert.equal(getNetworkKey("5.6.7.8"), "5.6.7.0/24");
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY; else process.env.TRUST_PROXY = previous;
    if (previousHeader === undefined) delete process.env.RATE_LIMIT_IP_HEADER; else process.env.RATE_LIMIT_IP_HEADER = previousHeader;
  }
});

test("integer pricing and authoritative validation agree", () => {
  assert.equal(getProductPrice({ price: 2999, discount: 10 }), 2699);
  assert.equal(getProductPrice({ price: 199, discount: 50 }), 100);
  assert.equal(getProductPrice({ price: 2999, discount: 100 }), 0);
  const product = { name: "Product", description: "Details", price: 100, stock: 0, categoryId: 1 };
  assert.equal(productSchema.safeParse(product).success, true);
  assert.equal(productSchema.safeParse({ ...product, discount: 101 }).success, false);
  assert.equal(productSchema.safeParse({ ...product, price: 1.5 }).success, false);
  assert.equal(productSchema.safeParse({ ...product, stock: -1 }).success, false);
  assert.equal(productSchema.safeParse({ ...product, role: "ADMIN" }).success, false);
  assert.equal(productSchema.safeParse({ ...product, imageUrl: "https://unapproved.example/a.png" }).success, false);
  assert.equal(cartItemSchema.safeParse({ productId: 1, quantity: 1.5 }).success, false);
  assert.equal(orderSchema.safeParse({ recipientName: "Customer", phoneNumber: "09", address: "Address" }).success, false);
  assert.equal(userSchema.safeParse({ name: "Customer", email: " USER@EXAMPLE.COM ", password: "password" }).data?.email, "user@example.com");
});

test("shared fetch attaches CSRF once, refreshes a stale token, and never leaks it to another origin", async () => {
  const previousFetch = globalThis.fetch;
  Object.defineProperty(globalThis, "window", { value: { location: { origin: "http://shop.example" } }, configurable: true });
  const calls: Array<{ url: string; headers: Headers }> = [];
  let tokenRequests = 0;
  let stale = false;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    calls.push({ url, headers: new Headers(init?.headers) });
    if (url === "/api/csrf") return Response.json({ csrfToken: ++tokenRequests === 1 ? "first-test-token" : "next-test-token" });
    if (stale) { stale = false; return Response.json({ error: "Invalid request" }, { status: 403 }); }
    return Response.json({ success: true });
  };
  try {
    clearCsrfTokenCache();
    await Promise.all([apiFetch("/api/cart", { method: "POST" }), apiFetch("/api/cart", { method: "DELETE" })]);
    assert.equal(tokenRequests, 1);
    assert.ok(calls.filter((call) => call.url === "/api/cart").every((call) => call.headers.has("x-csrf-token")));
    stale = true;
    assert.equal((await apiFetch("/api/order", { method: "POST" })).status, 200);
    assert.equal(tokenRequests, 2);
    await apiFetch("https://external.example/resource", { method: "POST" });
    assert.equal(calls.at(-1)?.headers.has("x-csrf-token"), false);
    await apiFetch("/api/product");
    assert.equal(calls.at(-1)?.headers.has("x-csrf-token"), false);
    await apiFetch("/api/user/login", { method: "POST" });
    assert.equal(calls.at(-1)?.headers.has("x-csrf-token"), false);
  } finally {
    globalThis.fetch = previousFetch;
    Reflect.deleteProperty(globalThis, "window");
    clearCsrfTokenCache();
  }
});
