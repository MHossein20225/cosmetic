import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[#f7f3ee] px-6 py-24 sm:min-h-[75vh] sm:px-10 lg:min-h-[80vh] lg:px-16">
        {/* Background */}
        <div className="absolute inset-0">
          {/* <Image
            src=""
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="h-full w-full object-cover"
          /> */}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-5xl text-center text-white">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] sm:text-sm">
            فرمولاسیون گیاهی با نگاهی هدفمند
          </p>

          <h1 className="mx-auto max-w-4xl font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            آیین‌های ناب،
            <br />
            <span className="italic">زیباییِ آرام.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
            محصولات مراقبت و زیبایی با فرمول‌های سنجیده، ترکیبات منتخب و بافتی دلپذیر؛ برای آیین‌های روزمره شما.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="w-full rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-black hover:text-white sm:w-auto"
            >
              مشاهده محصولات
            </Link>

            <Link
              href="/about_us"
              className="w-full rounded-full border border-white/70 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black sm:w-auto"
            >
              داستان ما
            </Link>
          </div>
        </div>
      </section>
    )
}
