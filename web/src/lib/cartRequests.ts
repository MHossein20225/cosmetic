export async function createCart() {
  const response = await fetch("/api/cart", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to create cart");
  }

  return response.json();
}

export async function getCart() {
  const response = await fetch("/api/cart");

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
}

export async function addToCart(
  productId: number,
  quantity = 1
) {
  const response = await fetch("/api/cart/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.error || "Failed to add product to cart"
    );
  }

  return response.json();
}