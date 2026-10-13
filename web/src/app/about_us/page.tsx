'use client'

import Link from "next/link"
import { Flower, Sparkles, Leaf } from "lucide-react"

export default function AboutUs() {
  return (
    <main className="w-full min-h-screen bg-[#fff8f6]">
      <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#85736f] hover:text-[#534340] transition-colors mb-4"
          >
            <Flower size={16} />
            بازگشت به صفحه اصلی
          </Link>

          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800 mb-3">
            <Leaf size={14} />
            درباره ما
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1f1b1a] tracking-tight">
            زیبایی آگاهانه،
            <span className="text-[#8b4e40]"> آیین‌های روزمره.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-[#534340] leading-relaxed mx-auto">
            باور داریم محصولات آرایشی باید همان‌قدر که زیبایی می‌آفرینند، از پوست نیز مراقبت کنند. فرمول‌های ما با ترکیبات گیاهی و
            در دسته‌های کوچک تولید می‌شوند تا تجربه‌ای کامل از مراقبت روزانه را برایتان فراهم کنند.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-14">
          {[
            { value: "۱۲۰+", label: "ترکیب گیاهی" },
            { value: "۵۰هزار", label: "آیین روزانه" },
            { value: "۳۰+", label: "دسته محصول" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-rose-100 text-center"
            >
              <span className="font-serif text-4xl sm:text-5xl text-[#1f1b1a] font-semibold">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-[#534340] font-sans">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Values / cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              icon: Sparkles,
              title: "فرمولاسیون پاک",
              body: "فرمول‌های ما بدون پارابن، سولفات و رایحه مصنوعی هستند و تنها از ترکیبات مورد نیاز پوست بهره می‌برند.",
            },
            {
              icon: Leaf,
              title: "با تکیه بر گیاهان",
              body: "ترکیبات فعال و عصاره‌های گیاهی به مراقبت مؤثر از پوست کمک می‌کنند و به سد دفاعی آن احترام می‌گذارند.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-rose-100 flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-800/10 flex items-center justify-center">
                <item.icon size={22} className="text-amber-800" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-[#1f1b1a] font-semibold">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-[#534340] leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-amber-800 text-white px-7 py-3.5 rounded-xl font-sans text-sm font-semibold uppercase tracking-wider hover:bg-amber-900 transition-all shadow-sm"
          >
            <Flower size={18} />
             مشاهده محصولات
          </Link>
        </div>
      </div>
    </main>
  )
}
