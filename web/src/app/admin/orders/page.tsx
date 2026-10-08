"use client";

import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const router = useRouter();


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-[#1f1b1a]">سفارشات</h1>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="text-sm text-[#85736f] hover:text-[#1f1b1a] transition-colors"
        >
          خروج از ادمین
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e8dfdc] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8dfdc]">
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">شماره سفارش</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">مشتری</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">آدرس</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">مجموع</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">وضعیت</th>
              <th className="text-left py-3 px-2 font-semibold text-[#85736f]">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {/* orderRow */}
          </tbody>
        </table>
      </div>
    </div>
  );
}


