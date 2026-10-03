export async function getCategories() {
  const response = await fetch("/api/category");
  if (!response.ok) {
    throw new Error("محصولات دریافت نشد");
  }
  return response.json();
}
export async function getCategory(id: number){
  const response = await fetch(`/api/category/${id}`);
  if (!response.ok) {
    throw new Error("محصول یافت نشد");
  }
  return response.json();
}