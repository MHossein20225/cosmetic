import Link from "next/link";
import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  // TODO: load these from /api/admin once it exists
  const stats = {
    orders: 3,
    products: 8,
    users: 12,
    revenue: 1240,
  };

  const recentOrders = [
    { id: "order_1", customer: "جلال", total: 4499, status: "PENDING", date: "۱۴۰۴-۰۴-۱۲" },
    { id: "order_2", customer: "سارا", total: 2199, status: "PREPARED", date: "۱۴۰۴-۰۴-۱۲" },
    { id: "order_3", customer: "احمد", total: 6999, status: "DELIVERED", date: "۱۴۰۴-۰۴-۱۱" },
  ];

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
          <p className="font-serif text-3xl font-bold">{stats.orders}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <Package size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">محصولات</span>
          </div>
          <p className="font-serif text-3xl font-bold">{stats.products}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <Users size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">کاربران</span>
          </div>
          <p className="font-serif text-3xl font-bold">{stats.users}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <TrendingUp size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">درآمد</span>
          </div>
          <p className="font-serif text-3xl font-bold text-[#8b4e40]">{stats.revenue}،۰۰۰ تومان</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e8dfdc]">
        <div className="p-5 border-b border-[#e8dfdc]">
          <h2 className="font-serif text-xl">سفارشات اخیر</h2>
        </div>
        <ul>
          {recentOrders.map((order) => (
            <li
              key={order.id}
              className="p-5 border-b border-[#e8dfdc] flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-[#85736f]">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{order.total}،۰۰۰ تومان</p>
                <p className="text-xs text-[#85736f]">{order.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
