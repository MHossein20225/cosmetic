import type { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/product");
  if (!response.ok) {
    throw new Error("محصولات دریافت نشد");
  }
  return response.json();
}
export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`/api/product/${id}`);
  if (!response.ok) {
    throw new Error("محصول یافت نشد");
  }
  return response.json();
}
export async function getCategoriedProducts(category: string): Promise<Product[]> {
  const response = await fetch(`/api/product/category/${category}`);
  if (!response.ok) {
    throw new Error("محصولات این دسته دریافت نشد");
  }
  return response.json();
}