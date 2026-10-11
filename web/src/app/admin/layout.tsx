import Link from "next/link";
import { Package, Users, ShoppingCart, LayoutDashboard } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/orders", label: "سفارشات", icon: ShoppingCart },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");
  return (
    <div className="min-h-screen bg-[#f7f3ef] text-[#1f1b1a]">
      <aside className="lg:fixed start-0 top-0 lg:h-screen w-full lg:w-64 bg-white border-e border-[#e8dfdc] p-5 flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-lg bg-amber-800 text-white flex items-center justify-center">
            <ShoppingCart size={18} />
          </div>
          <span className="font-serif text-xl font-bold">مدیریت فروشگاه</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors bg-amber-800/5 text-amber-800 hover:bg-amber-800/10 hover:text-amber-800"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-[#e8dfdc] flex items-center gap-3 px-4">
          <div className="w-9 h-9 rounded-full bg-rose-200 flex items-center justify-center text-rose-800 font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">مدیریت فروش</p>
            <p className="text-xs text-[#85736f] truncate">نگاه کلی به سایت</p>
          </div>
        </div>
      </aside>

      <main className="lg:me-64 min-h-screen bg-[#f7f3ef] p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
