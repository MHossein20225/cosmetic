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
            Back to home
          </Link>

          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800 mb-3">
            <Leaf size={14} />
            About us
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1f1b1a] tracking-tight">
            Intentional beauty,
            <span className="text-[#8b4e40]"> intentional rituals.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-[#534340] leading-relaxed mx-auto">
            We believe cosmetics should nourish the skin as much as they
            adorn it. Every formula is cold-pressed, plant-powered, and
            designed in small batches — so you get the full ritual, not just
            the product.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-14">
          {[
            { value: "120+", label: "Organic botanicals" },
            { value: "50k", label: "Rituals started" },
            { value: "30+", label: "Categories" },
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
              title: "Clean by design",
              body: "Every formula is free from parabens, sulfates, and synthetic fragrances. We source only what the skin truly needs.",
            },
            {
              icon: Leaf,
              title: "Botanical first",
              body: "Cold-pressed actives and pressed botanicals deliver visible ritual results without compromising the skin barrier.",
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
            Explore the collection
          </Link>
        </div>
      </div>
    </main>
  )
}
