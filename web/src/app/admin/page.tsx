import Link from "next/link";
import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiSecurity";
import { formatToman } from "@/lib/pricing";

export default async function AdminDashboard() {
  const authorization = await requireRole("ADMIN");
  const stats = authorization.session;

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">دسترسی غیر مجاز</p>
        <p className="text-sm text-[#85736f]">برای دیدن داشبورد، به عنوان ادمین وارد شوید</p>
      </div>
    );
  }

  const [orders, productCount, userCount, orderCount, revenue, lowStock] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalPrice: true } }),
    prisma.product.findMany({ where: { stock: { lt: 10 } }, orderBy: { stock: "asc" } }),
  ]);

  const totalRevenue = revenue._sum.totalPrice ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-[#1f1b1a]">داشبورد</h1>
        <Link
          href="/admin/products"
          className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-900 transition-colors"
        >
          + محصول جدید
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <ShoppingCart size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">سفارشات</span>
          </div>
          <p className="font-serif text-3xl font-bold">{orderCount}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <Package size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">محصولات</span>
          </div>
          <p className="font-serif text-3xl font-bold">{productCount}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <Users size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">کاربران</span>
          </div>
          <p className="font-serif text-3xl font-bold">{userCount}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <TrendingUp size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">درآمد</span>
          </div>
          <p className="font-serif text-3xl font-bold text-[#8b4e40]">
            {formatToman(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e8dfdc]">
          <div className="p-5 border-b border-[#e8dfdc]">
            <h2 className="font-serif text-xl">محصولات پایین انرژی</h2>
          </div>
          <div className="p-5">
            {lowStock.length === 0 ? (
              <p className="text-sm text-[#85736f]">همه محصولات انرژی کافی دارند</p>
            ) : (
              <ul className="space-y-2">
                {lowStock.map((p: { id: number; name: string; stock: number }) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-[#85736f]">{p.name}</span>
                    <span className={`font-semibold ${p.stock <= 0 ? "text-red-600" : "text-[#85736f]"}`}>
                      {p.stock} موجود
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e8dfdc]">
          <div className="p-5 border-b border-[#e8dfdc]">
            <h2 className="font-serif text-xl">سفارشات اخیر</h2>
          </div>
          <div className="p-5">
            {orders.length === 0 ? (
              <p className="text-sm text-[#85736f]">سفارشی وجود ندارد</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-xs text-[#85736f]">
                        {order.recipientName} · {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    <span className="font-semibold">{formatToman(order.totalPrice)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
