import test from "node:test";
import assert from "node:assert/strict";
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

test("IP headers require explicit proxy trust and IPv6 networks are normalized", () => {
  const previous = process.env.TRUST_PROXY;
  const previousHeader = process.env.RATE_LIMIT_IP_HEADER;
  delete process.env.TRUST_PROXY;
  delete process.env.RATE_LIMIT_IP_HEADER;
  const request = new Request("https://shop.example", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
  assert.equal(getClientIp(request), "unknown");
  process.env.TRUST_PROXY = "true";
  assert.equal(getClientIp(request), "5.6.7.8");
  assert.equal(getNetworkKey("2001:db8::1"), getNetworkKey("2001:0db8:0:0:0:0:0:2"));
  assert.equal(getNetworkKey("5.6.7.8"), "5.6.7.0/24");
  if (previous === undefined) delete process.env.TRUST_PROXY; else process.env.TRUST_PROXY = previous;
  if (previousHeader === undefined) delete process.env.RATE_LIMIT_IP_HEADER; else process.env.RATE_LIMIT_IP_HEADER = previousHeader;
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
