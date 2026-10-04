"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminProducts, useAdminAuth } from "@/hooks/adminHooks";
import { Package, Plus, X, Loader2 } from "lucide-react";

export default function AdminProductsPage() {
  const router = useRouter();
  const { user } = useAdminAuth();
  const { products, isLoading, isError, error, createProduct, createProductAsync } = useAdminProducts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = [
    { id: 1, name: "جلداسازی" },
    { id: 2, name: "راتبیدازایی" },
    { id: 3, name: "دلگشتی" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !description || !price || !categoryId) return;

    setSaving(true);
    try {
      await createProductAsync({
        name,
        description,
        price: Number(price),
        discount: Number(discount) || 0,
        stock: Number(stock) || 0,
        categoryId: Number(categoryId),
        imageUrl: imageUrl || undefined,
      });
      router.push("/admin/products");
    } catch {
      alert("ثبت محصول انجام نشد");
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
          <h2 className="font-serif text-xl mb-4">افزودن محصول جدید</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
              placeholder="نام محصول"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
              placeholder="توضیحات"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
                placeholder="قیمت (تومان)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
                placeholder="تخفیف (%)"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full px-4 py-3 rounded-lg border border-[#e8dfdc] focus:outline-none focus:ring-2 focus:ring-amber-800"
                placeholder="تعداد کالای موجود"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <select
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
          </form>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc] overflow-hidden">
          <h2 className="font-serif text-xl mb-4">لیست محصولات</h2>
          {products?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8dfdc]">
                    <th className="text-left py-3 px-2 font-semibold text-[#85736f]">نام</th>
                    <th className="text-left py-3 px-2 font-semibold text-[#85736f]">دسته‌بندی</th>
                    <th className="text-left py-3 px-2 font-semibold text-[#85736f]">قیمت</th>
                    <th className="text-left py-3 px-2 font-semibold text-[#85736f]">تخفیف</th>
                    <th className="text-left py-3 px-2 font-semibold text-[#85736f]">موجودی</th>
                    <th className="text-left py-3 px-2 font-semibold text-[#85736f]">تاریخ</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id} className="border-b border-[#f0e6e4]">
                      <td className="py-3 px-2 font-medium">{product.name}</td>
                      <td className="py-3 px-2 text-[#85736f]">{product.category?.name}</td>
                      <td className="py-3 px-2">{product.price} تومان</td>
                      <td className="py-3 px-2 text-[#85736f]">{product.discount}%</td>
                      <td className="py-3 px-2">{product.stock}</td>
                      <td className="py-3 px-2 text-[#85736f]">{new Date(product.createdAt).toLocaleDateString("fa-IR")}</td>
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
