import test from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAdminProducts, useAdminOrders } from "../src/hooks/adminHooks";
import { useCreateOrder } from "../src/hooks/orderHooks";
import { clearCsrfTokenCache } from "../src/lib/apiFetch";
import { formatToman } from "../src/lib/pricing";

test("toman formatting uses Persian digits and the shared currency unit", () => {
  assert.equal(formatToman(1234), "۱٬۲۳۴ تومان");
  assert.equal(formatToman(1234.4), "۱٬۲۳۴ تومان");
});

test("admin mutations and checkout invalidate the existing query keys", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false }, mutations: { retry: false } } });
  const keys = [["cart"], ["products"], ["product", 1], ["orders", "my", "customer"], ["admin", "products"], ["admin", "orders"]];
  keys.forEach((key) => client.setQueryData(key, []));
  let products: ReturnType<typeof useAdminProducts> | undefined;
  let orders: ReturnType<typeof useAdminOrders> | undefined;
  let checkout: ReturnType<typeof useCreateOrder> | undefined;
  function Harness() {
    products = useAdminProducts(); orders = useAdminOrders(); checkout = useCreateOrder();
    return null;
  }
  const previousFetch = globalThis.fetch;
  Object.defineProperty(globalThis, "window", { value: { location: { origin: "http://shop.example" } }, configurable: true });
  globalThis.fetch = async (input) => Response.json(String(input) === "/api/csrf" ? { csrfToken: "query-test-token" } : { success: true });
  try {
    clearCsrfTokenCache();
    renderToString(<QueryClientProvider client={client}><Harness /></QueryClientProvider>);
    await products!.createProductAsync({ name: "Product", description: "Details", price: 100, stock: 1, categoryId: 1 });
    for (const key of [["cart"], ["products"], ["product", 1], ["admin", "products"]]) assert.equal(client.getQueryState(key)?.isInvalidated, true);
    await orders!.updateOrderStatusAsync({ id: "order", status: "PREPARED" });
    assert.equal(client.getQueryState(["orders", "my", "customer"])?.isInvalidated, true);
    assert.equal(client.getQueryState(["admin", "orders"])?.isInvalidated, true);
    keys.forEach((key) => client.setQueryData(key, []));
    await checkout!.orderMutateAsync({ recipientName: "Customer", address: "Address", phoneNumber: "09123456789" });
    for (const key of keys) assert.equal(client.getQueryState(key)?.isInvalidated, true);
  } finally {
    client.clear(); globalThis.fetch = previousFetch;
    Reflect.deleteProperty(globalThis, "window"); clearCsrfTokenCache();
  }
});
