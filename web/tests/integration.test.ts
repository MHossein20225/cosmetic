import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { consumeRateLimit } from "../src/lib/rateLimit";
import { prisma as sharedPrisma } from "../src/lib/prisma";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl || !/test|audit/i.test(new URL(databaseUrl).pathname)) throw new Error("An isolated test database is required");
process.env.DATABASE_URL = databaseUrl;
const db = new PrismaClient();
const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3001";
if (!["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname)) throw new Error("Run integration tests against a local test server");

type Client = { cookie: string; token: string; ip: string };
async function request(path: string, method = "GET", body?: unknown, client?: Client, csrf: string | null | undefined = client?.token) {
  const headers = new Headers({ "x-forwarded-for": client?.ip ?? "198.18.0.1" });
  if (client?.cookie) headers.set("cookie", client.cookie);
  if (csrf) headers.set("x-csrf-token", csrf);
  if (body !== undefined) headers.set("Content-Type", "application/json");
  const response = await fetch(new URL(path, baseUrl), { method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: "manual" });
  return { status: response.status, body: await response.json().catch(() => null), headers: response.headers };
}

test("isolated production server: authentication, security, cart, checkout, admin, and concurrency", { timeout: 180000 }, async (t) => {
  const marker = randomUUID();
  const ipSubnet = randomBytes(2).readUInt16BE() % 512;
  const testIp = (host: number) => `198.${18 + Math.floor(ipSubnet / 256)}.${ipSubnet % 256}.${host}`;
  const password = "AuditPassword123!";
  const passwordHash = await bcrypt.hash(password, 10);
  const users: string[] = [];
  const products: number[] = [];
  let categoryId: number | undefined;
  let customer: Client;
  let other: Client;
  let admin: Client;
  let orderId: string;
  let productId: number;

  async function fixture(role: "CUSTOMER" | "ADMIN", ip: string) {
    const user = await db.user.create({ data: { name: "Audit Customer", email: `${randomUUID()}@audit.example`, password: passwordHash, role } });
    users.push(user.id);
    const session = await db.session.create({ data: { id: randomBytes(32).toString("base64url"), userId: user.id, expiresAt: new Date(Date.now() + 3600000), csrfToken: randomBytes(32).toString("base64url") } });
    return { user, client: { cookie: `sessionId=${session.id}`, token: session.csrfToken!, ip } };
  }

  try {
    const adminFixture = await fixture("ADMIN", "198.18.1.1");
    admin = adminFixture.client;
    // A session that exists only in this database proves the HTTP server uses this test database.
    const identity = await request("/api/user/me", "GET", undefined, admin);
    assert.equal(identity.status, 200, "Test server is not connected to the isolated test database");
    assert.ok(identity.body.id === adminFixture.user.id, "Test server identity mismatch");
    const customerFixture = await fixture("CUSTOMER", "198.18.2.1");
    customer = customerFixture.client;
    other = (await fixture("CUSTOMER", "198.18.3.1")).client;
    const category = await db.category.create({ data: { name: `Audit ${marker}` } });
    categoryId = category.id;
    const product = await db.product.create({ data: { name: `Audit product ${marker}`, description: "Audit description", price: 2999, discount: 10, stock: 10, categoryId } });
    products.push(product.id); productId = product.id;

    await t.test("public GET, authentication, authorization, CSRF, and no sensitive fields", async () => {
      for (const path of ["/api/cart", "/api/order", "/api/admin", "/api/admin/users", "/api/admin/products", "/api/admin/orders", "/api/csrf"]) assert.equal((await request(path)).status, 401, path);
      assert.equal((await request("/api/product")).status, 200);
      assert.equal((await request(`/api/product/${productId}`)).status, 200);
      assert.equal((await request("/api/cart/items", "POST", { productId }, customer, null)).status, 403);
      assert.equal((await request("/api/cart/items", "POST", { productId }, customer, "invalid")).status, 403);
      const tokenResponse = await request("/api/csrf", "GET", undefined, customer);
      assert.equal(tokenResponse.status, 200);
      assert.ok(tokenResponse.body.csrfToken === customer.token);
      assert.equal(Object.keys(tokenResponse.body).join(","), "csrfToken");
      assert.ok(tokenResponse.headers.get("cache-control")?.includes("no-store"));
      assert.equal((await request("/api/user/me", "GET", undefined, { ...customer, cookie: `sessionId=${customer.token}` })).status, 401);
      for (const path of ["/api/admin/users", "/api/admin/products", "/api/admin/orders", "/api/user"]) assert.equal((await request(path, "GET", undefined, customer)).status, 403);
      assert.equal((await request("/api/admin/users", "PATCH", { id: users[1], role: "ADMIN" }, customer)).status, 403);
      const listedUsers = await request("/api/admin/users", "GET", undefined, admin);
      assert.equal(listedUsers.status, 200);
      assert.ok(listedUsers.body.every((user: Record<string, unknown>) => !("password" in user) && !("sessions" in user)));
      const expired = await db.session.create({ data: { userId: users[1], expiresAt: new Date(Date.now() - 1000), csrfToken: randomBytes(32).toString("base64url") } });
      assert.equal((await request("/api/user/me", "GET", undefined, { ...customer, cookie: `sessionId=${expired.id}` })).status, 401);
      assert.equal(await db.session.count({ where: { id: expired.id } }), 0);
    });

    await t.test("registration, login, cookie flags, session restoration and logout", async () => {
      const email = `${marker}@audit.example`;
      const publicClient = { cookie: "", token: "", ip: testIp(240) };
      assert.equal((await request("/api/user/register", "POST", { name: "Registered Customer", email, password, role: "ADMIN" }, publicClient)).status, 201);
      const registered = await db.user.findUniqueOrThrow({ where: { email } }); users.push(registered.id);
      assert.equal(registered.role, "CUSTOMER");
      assert.equal((await request("/api/user/register", "POST", { name: "Registered Customer", email: email.toUpperCase(), password }, publicClient)).status, 409);
      assert.equal((await request("/api/user/login", "POST", { email, password: "wrong-password" }, publicClient)).status, 401);
      const login = await request("/api/user/login", "POST", { email: email.toUpperCase(), password }, publicClient);
      assert.equal(login.status, 200);
      const cookie = login.headers.get("set-cookie") ?? "";
      assert.ok(cookie.includes("HttpOnly") && cookie.includes("Secure") && cookie.includes("SameSite=lax") && cookie.includes("Path=/"));
      const loggedIn = { ...publicClient, cookie: cookie.split(";")[0] };
      assert.equal((await request("/api/user/me", "GET", undefined, loggedIn)).status, 200);
      const csrf = await request("/api/csrf", "GET", undefined, loggedIn);
      loggedIn.token = csrf.body.csrfToken;
      assert.ok(!loggedIn.cookie.endsWith(loggedIn.token));
      assert.equal((await request("/api/user/logout", "GET", undefined, loggedIn)).status, 405);
      assert.equal((await request("/api/user/logout", "POST", undefined, loggedIn, null)).status, 403);
      assert.equal((await request("/api/user/logout", "POST", undefined, loggedIn)).status, 200);
      assert.equal((await request("/api/user/me", "GET", undefined, loggedIn)).status, 401);
      const crossSite = await fetch(new URL("/api/user/login", baseUrl), { method: "POST", headers: { origin: "https://attacker.example", "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      assert.equal(crossSite.status, 403);
    });

    await t.test("search, effective price ordering, category filtering, pagination and bad inputs", async () => {
      for (const price of [500, 6000]) {
        const product = await db.product.create({ data: { name: `Audit product ${marker} ${price}`, description: "Audit description", price, discount: price === 6000 ? 95 : 0, stock: 2, categoryId: categoryId! } }); products.push(product.id);
      }
      const search = encodeURIComponent(marker);
      const asc = await request(`/api/product/search?search=${search}&sort=price-asc&limit=2`);
      assert.equal(asc.status, 200); assert.equal(asc.body.total, 3); assert.equal(asc.body.totalPages, 2);
      assert.deepEqual(asc.body.products.map((p: { price: number }) => p.price), [6000, 500]);
      const desc = await request(`/api/product/search?search=${search}&sort=price-desc&page=2&limit=2`);
      assert.equal(desc.status, 200); assert.equal(desc.body.products.length, 1); assert.equal(desc.body.products[0].price, 6000);
      assert.equal((await request(`/api/product/search?category=${encodeURIComponent(category.name)}`)).body.total, 3);
      for (const query of ["page=1.5", "limit=Infinity", "sort=toString", "page=-1"]) assert.equal((await request(`/api/product/search?${query}`)).status, 400);
      assert.equal((await request("/api/category/not-a-number")).status, 400);
      assert.equal((await request("/api/product/99999999999999999")).status, 400);
    });

    await t.test("cart lifecycle, authoritative price, ownership and simultaneous additions", async () => {
      assert.equal((await request("/api/cart", "POST", undefined, customer)).status, 200);
      const added = await request("/api/cart/items", "POST", { productId, quantity: 1, userId: users[2], price: 1, unitPrice: 1 }, customer);
      assert.equal(added.status, 201); assert.equal(added.body.unitPrice, 2699);
      assert.equal((await request("/api/cart/items", "POST", { productId, quantity: 1 }, customer)).body.quantity, 2);
      assert.equal((await request(`/api/cart/items/${productId}`, "PATCH", { quantity: 3 }, customer)).status, 200);
      assert.equal((await request(`/api/cart/items/${productId}`, "PATCH", { quantity: 11 }, customer)).status, 409);
      assert.equal((await request(`/api/cart/items/${productId}`, "PATCH", { quantity: 1.5 }, customer)).status, 400);
      assert.equal((await request(`/api/cart/items/${productId}`, "PATCH", { quantity: 1 }, other)).status, 404);
      assert.equal((await request(`/api/cart/items/${productId}`, "DELETE", undefined, customer)).status, 200);
      const additions = await Promise.all(Array.from({ length: 5 }, () => request("/api/cart/items", "POST", { productId, quantity: 1 }, customer)));
      assert.ok(additions.every((result) => result.status === 201), "Concurrent cart additions failed");
      assert.equal((await request("/api/cart", "GET", undefined, customer)).body.items[0].quantity, 5);
      assert.equal((await request("/api/cart/quantity", "POST", { productId, quantity: 6 }, customer)).status, 409);
      assert.equal((await request("/api/cart/quantity", "POST", { productId, quantity: 1 }, customer)).status, 201);
      assert.equal((await request("/api/cart", "DELETE", undefined, customer, null)).status, 403);
      assert.equal((await request("/api/cart", "DELETE", undefined, customer)).status, 200);
      assert.equal((await request("/api/cart", "GET", undefined, customer)).body.items.length, 0);
      await db.product.update({ where: { id: productId }, data: { price: 3001 } });
      await request("/api/cart/items", "POST", { productId, quantity: 2 }, customer);
      assert.equal((await request("/api/cart", "GET", undefined, customer)).body.items[0].unitPrice, 2701);
    });

    const shipping = { recipientName: "Audit Customer", phoneNumber: "09123456789", address: "Test address" };
    await t.test("checkout rollback, duplicate submission, atomic stock and cross-user orders", async () => {
      assert.equal((await request("/api/order", "POST", shipping, customer, null)).status, 403);
      await db.product.update({ where: { id: productId }, data: { stock: 1 } });
      const before = await db.order.count({ where: { userId: users[1] } });
      assert.equal((await request("/api/order", "POST", shipping, customer)).status, 409);
      assert.equal(await db.order.count({ where: { userId: users[1] } }), before);
      assert.equal((await request("/api/cart", "GET", undefined, customer)).body.items.length, 1);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: productId } })).stock, 1);
      await db.product.update({ where: { id: productId }, data: { stock: 10 } });
      await request("/api/cart/items", "POST", { productId: products[1], quantity: 1 }, customer);
      await db.product.update({ where: { id: products[1] }, data: { stock: 0 } });
      assert.equal((await request("/api/order", "POST", shipping, customer)).status, 409);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: productId } })).stock, 10, "Earlier stock updates must roll back");
      await request(`/api/cart/items/${products[1]}`, "DELETE", undefined, customer);
      const submissions = await Promise.all(Array.from({ length: 3 }, () => request("/api/order", "POST", { ...shipping, userId: users[2], totalPrice: 1, price: 1, role: "ADMIN" }, customer)));
      assert.equal(submissions.filter((result) => result.status === 201).length, 1);
      assert.ok(submissions.every((result) => [201, 400, 409].includes(result.status)));
      const order = submissions.find((result) => result.status === 201)!.body.order;
      orderId = order.id;
      assert.equal(order.userId, users[1]); assert.equal(order.totalPrice, 5402); assert.equal(order.items[0].unitPrice, 2701);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: productId } })).stock, 8);
      assert.equal((await request("/api/cart", "GET", undefined, customer)).body.items.length, 0);
      assert.equal((await request("/api/order?my=1", "GET", undefined, customer)).body.length, 1);
      assert.equal((await request("/api/order?my=1", "GET", undefined, other)).body.length, 0);
      assert.equal((await request(`/api/order/${orderId}`, "GET", undefined, other)).status, 403);
      assert.equal((await request(`/api/order/${orderId}`, "GET", undefined, customer)).status, 200);
      assert.equal((await request(`/api/order/${orderId}`, "GET", undefined, admin)).status, 200);
      const scarce = await db.product.create({ data: { name: "Last unit", description: "Concurrency fixture", price: 100, stock: 1, categoryId: categoryId! } }); products.push(scarce.id);
      await request("/api/cart/items", "POST", { productId: scarce.id }, customer);
      await request("/api/cart/items", "POST", { productId: scarce.id }, other);
      const lastUnit = await Promise.all([request("/api/order", "POST", shipping, customer), request("/api/order", "POST", shipping, other)]);
      assert.equal(lastUnit.filter((result) => result.status === 201).length, 1);
      assert.equal(lastUnit.filter((result) => result.status === 409).length, 1);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: scarce.id } })).stock, 0);
      await request("/api/cart", "DELETE", undefined, other);
    });

    await t.test("admin product CRUD, order transitions, user roles, snapshots and dashboard", async () => {
      const payload = { name: `Admin product ${marker}`, description: "Details", price: 100, discount: 0, stock: 0, categoryId };
      assert.equal((await request("/api/admin/products", "POST", payload, admin, null)).status, 403);
      const created = await request("/api/admin/products", "POST", payload, admin);
      assert.equal(created.status, 201); products.push(created.body.id);
      assert.equal((await request(`/api/product/${created.body.id}`, "PATCH", { discount: 101 }, admin)).status, 400);
      assert.equal((await request(`/api/product/${created.body.id}`, "PATCH", { price: 200 }, admin)).status, 200);
      assert.equal((await request(`/api/product/${created.body.id}`, "DELETE", undefined, admin)).status, 200);
      assert.equal((await request("/api/admin/orders", "PATCH", { id: orderId, status: "DELIVERED" }, admin)).status, 409);
      assert.equal((await request("/api/admin/orders", "PATCH", { id: orderId, status: "PREPARED" }, admin)).status, 200);
      assert.equal((await request("/api/admin/orders", "PATCH", { id: orderId, status: "DELIVERED" }, admin)).status, 200);
      assert.equal((await request("/api/admin/orders", "PATCH", { id: orderId, status: "QUEUE" }, admin)).status, 409);
      assert.equal((await request("/api/admin/orders", "PATCH", { id: orderId, status: "DELIVERIED" }, admin)).status, 400);
      assert.equal((await request("/api/admin/users", "PATCH", { id: users[0], role: "CUSTOMER" }, admin)).status, 403);
      assert.equal((await request("/api/admin/users", "PATCH", { id: users[2], role: "ADMIN" }, admin)).status, 200);
      assert.equal((await request("/api/admin/users", "GET", undefined, other)).status, 200);
      assert.equal((await request("/api/admin/users", "PATCH", { id: users[2], role: "CUSTOMER" }, admin)).status, 200);
      assert.equal((await request("/api/admin/users", "GET", undefined, other)).status, 403);
      const snapshot = (await request(`/api/order/${orderId}`, "GET", undefined, customer)).body.items[0].productName;
      await request(`/api/admin/products/${productId}`, "PATCH", { name: "Changed after purchase" }, admin);
      await request("/api/cart/items", "POST", { productId, quantity: 1 }, other);
      assert.equal((await request(`/api/admin/products/${productId}`, "DELETE", undefined, admin)).status, 200);
      const historical = await request(`/api/order/${orderId}`, "GET", undefined, customer);
      assert.equal(historical.body.items[0].productName, snapshot); assert.equal(historical.body.items[0].productId, null);
      assert.equal((await request("/api/cart", "GET", undefined, other)).body.items.length, 0);
      const dashboard = await fetch(new URL("/admin", baseUrl), { headers: { cookie: admin.cookie }, redirect: "manual" });
      assert.equal(dashboard.status, 200); assert.ok((await dashboard.text()).includes("Audit Customer"));
      const guestDashboard = await fetch(new URL("/admin", baseUrl), { redirect: "manual" });
      assert.ok([307, 308].includes(guestDashboard.status));
    });

    await t.test("rate limit concurrency, expiry, login account/IP independence and registration abuse", async () => {
      const key = `audit:${marker}`;
      const decisions = await Promise.all(Array.from({ length: 12 }, () => consumeRateLimit(key, 3, 1000)));
      assert.equal(decisions.filter((decision) => decision.allowed).length, 3);
      await new Promise((resolve) => setTimeout(resolve, 1100));
      assert.equal((await consumeRateLimit(key, 3, 1000)).allowed, true);
      const unknownEmail = `${randomUUID()}@audit.example`;
      const accountAttempts = [];
      for (let i = 0; i < 11; i++) accountAttempts.push(await request("/api/user/login", "POST", { email: unknownEmail, password }, { cookie: "", token: "", ip: testIp(i + 20) }));
      assert.ok(accountAttempts.slice(0, 10).every((result) => result.status === 401));
      assert.equal(accountAttempts[10].status, 429); assert.ok(Number(accountAttempts[10].headers.get("retry-after")) > 0);
      const ipAttempts = await Promise.all(Array.from({ length: 20 }, (_, i) => request("/api/user/login", "POST", { email: `ip${i}-${marker}@audit.example`, password }, { cookie: "", token: "", ip: testIp(50) })));
      assert.equal(ipAttempts.filter((result) => result.status === 401).length, 10); assert.equal(ipAttempts.filter((result) => result.status === 429).length, 10);
      const registrations = [];
      for (let i = 0; i < 6; i++) registrations.push(await request("/api/user/register", "POST", {}, { cookie: "", token: "", ip: testIp(60) }));
      assert.ok(registrations.slice(0, 5).every((result) => result.status === 400)); assert.equal(registrations[5].status, 429);
    });
  } finally {
    // Only fixtures created by this test are removed; existing database records are untouched.
    await db.user.deleteMany({ where: { id: { in: users } } });
    await db.product.deleteMany({ where: { id: { in: products } } });
    if (categoryId) await db.category.delete({ where: { id: categoryId } });
    await db.$disconnect(); await sharedPrisma.$disconnect();
  }
});
