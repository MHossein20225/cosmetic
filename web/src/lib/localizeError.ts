const messages: Record<string, string> = {
  "Request failed": "در انجام درخواست مشکلی پیش آمد.",
  "Failed to create cart": "ساخت سبد خرید انجام نشد.",
  "Failed to fetch cart": "دریافت سبد خرید انجام نشد.",
  "Failed to add product to cart": "افزودن محصول به سبد خرید انجام نشد.",
  "Failed to update cart": "به‌روزرسانی سبد خرید انجام نشد.",
  "Failed to remove item": "حذف محصول از سبد خرید انجام نشد.",
  "Failed to fetch orders": "دریافت سفارش‌ها انجام نشد.",
  "Unable to restore your session": "بازیابی نشست کاربری انجام نشد. دوباره وارد شوید.",
  "Too many requests. Please try again later.": "تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.",
  Unauthorized: "برای ادامه وارد حساب کاربری شوید.",
  Forbidden: "شما اجازه انجام این کار را ندارید.",
  "Not enough stock": "موجودی این محصول کافی نیست.",
  "Product not found": "محصول موردنظر پیدا نشد.",
  "Cart not found": "سبد خرید پیدا نشد.",
  "Cart item not found": "این محصول در سبد خرید پیدا نشد.",
  "Order not found": "سفارش موردنظر پیدا نشد.",
  "User not found": "کاربر موردنظر پیدا نشد.",
  "Category not found": "دسته‌بندی موردنظر پیدا نشد.",
  "Invalid product or quantity": "محصول یا تعداد واردشده معتبر نیست.",
  "Invalid order id": "شناسه سفارش معتبر نیست.",
  "Invalid status transition": "تغییر وضعیت سفارش امکان‌پذیر نیست.",
  "Please retry the request": "در انجام درخواست مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  "Failed to fetch": "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.",
  "Order total is too large": "مبلغ سفارش از حد مجاز بیشتر است.",
  "Cart is empty": "سبد خرید خالی است.",
};

const fallback = "در انجام درخواست مشکلی پیش آمد. لطفاً دوباره تلاش کنید.";

export function localizeError(error: unknown, defaultMessage = fallback): string {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  if (!message) return defaultMessage;
  if (/\p{Script=Arabic}/u.test(message)) return message;
  if (messages[message]) return messages[message];
  if (/^Failed to (fetch|create|update|delete|remove)/i.test(message)) return defaultMessage;
  return defaultMessage;
}
