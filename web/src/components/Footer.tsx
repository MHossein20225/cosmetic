export default function Footer() {
    return (
        <footer className="w-full bg-rose-50 mt-16">
        <div className="max-w-[1360px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16">
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="font-serif text-xl text-gray-900">
                فروشگاه زیبایی
              </span>
              <p className="text-base text-gray-500 max-w-sm">
                آیین‌های زیبایی آگاهانه و فرمول‌های گیاهی برای سلامت و شادابی پوست.
              </p>
              <div className="mt-4 max-w-md">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 block">
                  به جمع ما بپیوندید
                </span>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-white px-4 py-2 text-gray-900 text-sm rounded focus:outline-none focus:ring-1 focus:ring-amber-800 placeholder:text-gray-400"
                    placeholder="نشانی ایمیل شما"
                    type="email"
                  />
                  <button
                    className="bg-amber-800 text-white px-4 py-2 text-xs font-medium uppercase tracking-wider rounded hover:bg-amber-900 transition-colors"
                    type="button"
                  >
                    عضویت
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:col-start-7 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
                فروشگاه
              </span>
              <nav className="flex flex-col gap-2">
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="shop-all" href="#">همه محصولات</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="skincare" href="#">مراقبت پوست</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="makeup" href="#">آرایش</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="fragrance" href="#">عطر</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="bath-body" href="#">حمام و بدن</a>
              </nav>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
                پشتیبانی مشتریان
              </span>
              <nav className="flex flex-col gap-2">
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="customer-care" href="#">سفارش و ارسال</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="customer-care" href="#">بازگشت و تعویض</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="customer-care" href="#">منشأ ترکیبات</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="customer-care" href="#">پرسش‌های متداول</a>
              </nav>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
                درباره فروشگاه
              </span>
              <nav className="flex flex-col gap-2">
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="our-story" href="#">داستان ما</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="sustainability" href="#">پایداری</a>
                <a className="text-sm text-gray-500 hover:text-gray-900 transition-colors" data-path="stores" href="#">نشانی فروشگاه‌ها</a>
              </nav>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-sm border-t border-gray-200">
            <p>© ۱۴۰۵ فروشگاه زیبایی. تمامی حقوق محفوظ است.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-gray-900 transition-colors" data-path="privacy-policy" href="#">سیاست حفظ حریم خصوصی</a>
              <a className="hover:text-gray-900 transition-colors" data-path="terms-of-service" href="#">شرایط استفاده</a>
            </div>
          </div>
        </div>
      </footer>
    )
}
