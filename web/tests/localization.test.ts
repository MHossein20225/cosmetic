import assert from "node:assert/strict";
import test from "node:test";
import { localizeError } from "../src/lib/localizeError";
import { getOrderStatusLabel, orderStatusLabels } from "../src/lib/orderPresentation";

test("localizeError maps known API errors without changing API responses", () => {
  assert.equal(localizeError(new Error("Not enough stock")), "موجودی این محصول کافی نیست.");
  assert.equal(localizeError("Failed to fetch"), "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.");
});

test("localizeError preserves Persian messages and localizes unknown messages safely", () => {
  const persian = "اطلاعات واردشده معتبر نیست.";
  assert.equal(localizeError(new Error(persian)), persian);
  assert.equal(localizeError(new Error("Unrecognized English error")), "در انجام درخواست مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
});

test("customer and admin order status labels use one Persian vocabulary", () => {
  assert.equal(getOrderStatusLabel("QUEUE"), orderStatusLabels.QUEUE);
  assert.equal(getOrderStatusLabel("PREPARED"), "آماده ارسال");
  assert.equal(getOrderStatusLabel("DELIVERED"), "تحویل داده شد");
  assert.equal(getOrderStatusLabel("UNKNOWN"), "وضعیت نامشخص");
});
