"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminProducts } from "@/hooks/adminHooks";
import { useCategories } from "@/hooks/categoryHooks";
import { productSchema, ProductWithCategory } from "@/types";
import { Plus, Loader2 } from "lucide-react";
import { formatToman } from "@/lib/pricing";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, isLoading, isError, error, createProductAsync, updateProductAsync, deleteProductAsync } = useAdminProducts();
  const { categories = [], isError: categoryError } = useCategories();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  function resetForm() {
    setEditingId(null);
    setName(""); setDescription(""); setPrice(""); setDiscount("0");
    setStock("0"); setCategoryId(""); setImageUrl("");
  }

  function editProduct(product: ProductWithCategory) {
    setEditingId(product.id);
    setName(product.name); setDescription(product.description); setPrice(String(product.price));
    setDiscount(String(product.discount)); setStock(String(product.stock));
    setCategoryId(String(product.categoryId)); setImageUrl(product.imageUrl ?? "");
  }

  async function handleDelete(id: number) {
    if (!window.confirm("محصول حذف شود؟")) return;
    setSaving(true);
    try {
      await deleteProductAsync(id);
      if (editingId === id) resetForm();
      toast.success("محصول حذف شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حذف محصول انجام نشد");
    } finally { setSaving(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    const result = productSchema.safeParse({
      name, description, price: Number(price), discount: Number(discount), stock: Number(stock),
      categoryId: Number(categoryId), imageUrl: imageUrl || null,
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message || "اطلاعات محصول معتبر نیست");
      return;
    }

    setSaving(true);
    try {
      if (editingId) await updateProductAsync({ id: editingId, product: result.data });
      else await createProductAsync(result.data);
      resetForm();
      toast.success("محصول ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ثبت محصول انجام نشد");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <p className="text-sm text-[#85736f]">در حال بارگذاری...</p>;

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">خطا در دریافت محصولات</p>
        <p className="text-sm text-[#85736f]">{error?.message || "خطای ناشناخته"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-[#1f1b1a]">محصولات</h1>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="text-sm text-[#85736f] hover:text-[#1f1b1a] transition-colors"
        >
          خروج از ادمین
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <h2 className="font-serif text-xl mb-4">{editingId ? "ویرایش محصول" : "افزودن محصول جدید"}</h2>
          {categoryError && <p role="alert" className="text-red-600 text-sm">دریافت دسته‌بندی‌ها انجام نشد</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
              placeholder="نام محصول"
              aria-label="نام محصول"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
              placeholder="توضیحات"
              aria-label="توضیحات"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
                placeholder="قیمت (تومان)"
                aria-label="قیمت"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
                placeholder="تخفیف (%)"
                aria-label="تخفیف"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
                placeholder="تعداد کالای موجود"
                aria-label="موجودی"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <select
                aria-label="دسته‌بندی"
                className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">دسته‌بندی</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
              placeholder="آدرس تصویر (اختیاری)"
              aria-label="آدرس تصویر"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={saving || !name || !description || !price || !categoryId}
              className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              {saving ? "در حال ذخیره..." : "ذخیره محصول"}
            </button>
            {editingId && <button type="button" onClick={resetForm} disabled={saving} className="text-sm text-amber-800">انصراف از ویرایش</button>}
          </form>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc] overflow-hidden">
          <h2 className="font-serif text-xl mb-4">لیست محصولات</h2>
          {products?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8dfdc]">
                    <th className="text-right py-3 px-2 font-semibold text-[#85736f]">نام</th>
                    <th className="text-right py-3 px-2 font-semibold text-[#85736f]">دسته‌بندی</th>
                    <th className="text-right py-3 px-2 font-semibold text-[#85736f]">قیمت</th>
                    <th className="text-right py-3 px-2 font-semibold text-[#85736f]">تخفیف</th>
                    <th className="text-right py-3 px-2 font-semibold text-[#85736f]">موجودی</th>
                    <th className="text-right py-3 px-2 font-semibold text-[#85736f]">تاریخ</th>
                    <th className="text-right py-3 px-2 font-semibold text-[#85736f]">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-[#f0e6e4]">
                      <td className="py-3 px-2 font-medium">{product.name}</td>
                      <td className="py-3 px-2 text-[#85736f]">{product.category?.name}</td>
                    <td className="py-3 px-2">{formatToman(product.price)}</td>
                      <td className="py-3 px-2 text-[#85736f]">{product.discount}%</td>
                      <td className="py-3 px-2">{product.stock}</td>
                      <td className="py-3 px-2 text-[#85736f]">{new Date(product.createdAt).toLocaleDateString("fa-IR")}</td>
                      <td className="py-3 px-2">
                        <button type="button" onClick={() => editProduct(product)} disabled={saving} className="me-3 text-amber-800 disabled:opacity-50">ویرایش</button>
                        <button type="button" onClick={() => handleDelete(product.id)} disabled={saving} className="text-red-600 disabled:opacity-50">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[#85736f]">هیچ محصولی یافت نشد</p>
          )}
        </div>
      </div>
    </div>
  );
}
