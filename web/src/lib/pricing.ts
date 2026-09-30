export function hasDiscount(discount: number) {
  return discount > 0;
}

export function getDiscountedPrice(price: number, discount: number) {
  return Math.round(price * (1 - discount / 100) * 100) / 100;
}

export function getProductPrice(product: {
  price: number;
  discount: number;
}) {
  return getDiscountedPrice(product.price, product.discount);
}

export function getStockLabel(stock: number) {
  if (stock <= 0) {
    return "Out of stock";
  }

  if (stock <= 5) {
    return `Only ${stock} left`;
  }

  return "In stock";
}

export function isOutOfStock(stock: number) {
  return stock <= 0;
}
