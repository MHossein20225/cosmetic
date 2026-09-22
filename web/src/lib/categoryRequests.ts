import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch("/api/category");
  if (!response.ok) {
    throw new Error("محصولات دریافت نشد");
  }
  return response.json();
}
export async function getCategory(id: number): Promise<Category> {
  const response = await fetch(`/api/category/${id}`);
  if (!response.ok) {
    throw new Error("محصول یافت نشد");
  }
  return response.json();
}