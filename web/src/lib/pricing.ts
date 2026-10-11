export function hasDiscount(discount: number) {
  return discount > 0;
}

export function getDiscountedPrice(price: number, discount: number) {
  return Math.round(price * (100 - discount) / 100);
}

export function getProductPrice(product: {
  price: number;
  discount: number;
}) {
  return getDiscountedPrice(product.price, product.discount);
}

export function formatToman(amount: number) {
  return `${Math.round(amount).toLocaleString("fa-IR")} تومان`;
}

export function getStockLabel(stock: number) {
  if (stock <= 0) {
    return "ناموجود";
  }

  if (stock <= 5) {
    return `تنها ${stock.toLocaleString("fa-IR")} عدد باقی‌مانده`;
  }

  return "موجود";
}

export function isOutOfStock(stock: number) {
  return stock <= 0;
}
