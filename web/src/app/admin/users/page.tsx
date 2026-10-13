"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminUsers, useAdminAuth } from "@/hooks/adminHooks";
import { Key, Loader2 } from "lucide-react";
import { localizeError } from "@/lib/localizeError";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: admin } = useAdminAuth();
  const { users, isLoading, isError, error, updateUserRoleAsync } = useAdminUsers();

  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [role, setRole] = useState<"CUSTOMER" | "ADMIN">("CUSTOMER");
  const [changing, setChanging] = useState(false);

  async function handleToggle() {
    if (!selectingId) return;
    setChanging(true);
    try {
      await updateUserRoleAsync({ id: selectingId, role });
      setSelectingId(null);
    } catch {
      alert("تغییر نقش انجام نشد");
    } finally {
      setChanging(false);
    }
  }

  if (isLoading) return <p className="text-sm text-[#85736f]">در حال بارگذاری...</p>;

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">خطا در دریافت کاربران</p>
        <p className="text-sm text-[#85736f]">{localizeError(error, "دریافت کاربران انجام نشد.")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-[#1f1b1a]">کاربران</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#85736f]">
            معمولاً تنها ۱ کاربر ادمین است
          </span>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="text-sm text-[#85736f] hover:text-[#1f1b1a] transition-colors"
          >
            خروج از ادمین
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[#e8dfdc] overflow-hidden">
        <h2 className="font-serif text-xl mb-4">لیست کاربران</h2>
        {users?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8dfdc]">
                  <th className="text-right py-3 px-2 font-semibold text-[#85736f]">نام</th>
                  <th className="text-right py-3 px-2 font-semibold text-[#85736f]">ایمیل</th>
                  <th className="text-right py-3 px-2 font-semibold text-[#85736f]">نقش</th>
                  <th className="text-right py-3 px-2 font-semibold text-[#85736f]">تاریخ ثبت</th>
                  <th className="text-right py-3 px-2 font-semibold text-[#85736f]">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#f0e6e4]">
                    <td className="py-3 px-2 font-medium">{u.name}</td>
                    <td dir="ltr" className="py-3 px-2 text-start text-[#85736f]">{u.email}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-amber-800/15 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role === "ADMIN" ? "ادمین" : "مشتری"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[#85736f]">
                      {new Date(u.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="py-3 px-2">
                      {u.id === admin?.id ? (
                        <span className="text-xs text-[#85736f]">این حساب کاربری شماست</span>
                      ) : selectingId === u.id ? (
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as "CUSTOMER" | "ADMIN")}
                          className="px-2 py-1 rounded border border-[#e8dfdc] text-xs"
                        >
                          <option value="CUSTOMER">مشتری</option>
                          <option value="ADMIN">ادمین</option>
                        </select>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectingId(u.id);
                            setRole(u.role);
                          }}
                          className="text-sm text-amber-800 hover:text-amber-900"
                        >
                          تغییر نقش
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[#85736f]">هیچ کاربری یافت نشد</p>
        )}
      </div>

      {selectingId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setSelectingId(null)}>
          <div className="bg-white p-6 rounded-xl shadow-xl w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl mb-4">تغییر نقش کاربر</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole("CUSTOMER");
                }}
                className="flex-1 py-2 rounded-lg border border-[#e8dfdc] font-semibold"
              >
                مشتری
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("ADMIN");
                }}
                className="flex-1 py-2 rounded-lg bg-amber-800 text-white font-semibold hover:bg-amber-900"
              >
                ادمین
              </button>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button
                type="button"
                onClick={() => setSelectingId(null)}
                className="px-4 py-2 rounded-lg border border-[#e8dfdc] font-semibold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleToggle}
                disabled={changing}
                className="px-4 py-2 rounded-lg bg-amber-800 text-white font-semibold hover:bg-amber-900 disabled:opacity-50"
              >
                {changing ? <Loader2 size={18} className="animate-spin" /> : <Key size={18} />}
                {changing ? "در حال تغییر..." : "تغییر نقش"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
