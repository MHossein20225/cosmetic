import Link from "next/link";

const linkClass = "text-sm text-gray-500 hover:text-gray-900 transition-colors";

export default function Footer() {
  return (
    <footer className="w-full bg-rose-50 mt-16">
      <div className="max-w-[1360px] mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 sm:pb-16">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="font-serif text-xl text-gray-900">فروشگاه زیبایی</span>
            <p className="text-base text-gray-500 max-w-sm">
              آیین‌های زیبایی آگاهانه و فرمول‌های گیاهی برای سلامت و شادابی پوست.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-7 flex flex-col gap-3">
            <span className="text-xs font-medium text-gray-900">فروشگاه</span>
            <nav aria-label="پیوندهای فروشگاه" className="flex flex-col gap-2">
              <Link className={linkClass} href="/products">همه محصولات</Link>
              <Link className={linkClass} href="/brands">برندها</Link>
              <Link className={linkClass} href="/cart">سبد خرید</Link>
            </nav>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-medium text-gray-900">پشتیبانی و سفارش‌ها</span>
            <nav aria-label="پیوندهای پشتیبانی" className="flex flex-col gap-2">
              <Link className={linkClass} href="/orders">پیگیری سفارش‌ها</Link>
              <Link className={linkClass} href="/login">حساب کاربری</Link>
            </nav>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-medium text-gray-900">درباره فروشگاه</span>
            <nav aria-label="پیوندهای درباره فروشگاه" className="flex flex-col gap-2">
              <Link className={linkClass} href="/about_us">داستان ما</Link>
              <Link className={linkClass} href="/brands">برندهای منتخب</Link>
            </nav>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-sm border-t border-gray-200">
          <p>© ۱۴۰۵ فروشگاه زیبایی. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
