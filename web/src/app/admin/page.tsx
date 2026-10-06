import Link from "next/link";
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await fetch("/api/admin", {
    cache: "no-store",
  })
    .then((res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .catch(() => null);

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">دسترسی غیر مجاز</p>
        <p className="text-sm text-[#85736f]">برای دیدن داشبورد، به عنوان ادمین وارد شوید</p>
      </div>
    );
  }

  const [orders, products, users] = await Promise.all([
    fetch("/api/admin/orders", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .catch(() => []),
    fetch("/api/admin/products", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .catch(() => []),
    fetch("/api/admin/users", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .catch(() => []),
  ]);

  const lowStock = products.filter((p: { stock: number }) => p.stock < 10);
  const totalRevenue = orders.reduce((sum: number, o: { totalPrice: number }) => sum + o.totalPrice, 0);

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
          <p className="font-serif text-3xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <Package size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">محصولات</span>
          </div>
          <p className="font-serif text-3xl font-bold">{products.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <Users size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">کاربران</span>
          </div>
          <p className="font-serif text-3xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e8dfdc]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-800/10 flex items-center justify-center text-amber-800">
              <TrendingUp size={18} />
            </div>
            <span className="text-sm font-medium text-[#85736f]">درآمد</span>
          </div>
          <p className="font-serif text-3xl font-bold text-[#8b4e40]">
            {totalRevenue.toLocaleString()} تومان
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
                {orders.slice(0, 5).map((order: any) => (
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
                    <span className="font-semibold">{order.totalPrice.toLocaleString()} تومان</span>
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
