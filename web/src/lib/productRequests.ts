import type {
  Product,
  ProductWithCategory,
  SearchProductsParams,
  SearchProductsResult,
} from "@/types";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/product");
  if (!response.ok) {
    throw new Error("محصولات دریافت نشد");
  }
  return response.json();
}
export async function getProduct(id: number): Promise<ProductWithCategory> {
  const response = await fetch(`/api/product/${id}`);
  if (!response.ok) {
    throw new Error("محصول یافت نشد");
  }
  return response.json();
}
export async function getCategoriedProducts(category: string): Promise<Product[]> {
  const response = await fetch(`/api/product/category/${encodeURIComponent(category)}`);
  if (!response.ok) {
    throw new Error("محصولات این دسته دریافت نشد");
  }
  return response.json();
}
export async function searchProducts({
  search = "",
  sort = "featured",
  page = 1,
  limit = 8,
  category = "",
}: SearchProductsParams): Promise<SearchProductsResult> {
  const params = new URLSearchParams({
    search,
    sort,
    page: String(page),
    limit: String(limit),
    category,
  });

  const response = await fetch(`/api/product/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error("محصولات دریافت نشد");
  }
  return response.json();
}
