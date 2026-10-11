"use client";

import { useCategories } from "@/hooks/categoryHooks";
import CategoryCard from "./CategoryCard";
import Link from "next/link";
import Loading from "./Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function CategorySection() {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="w-full max-w-[1360px] mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-3 border-b border-gray-200">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 block mb-1">
            گزیده‌ای برای شما
          </span>
          <h2 className="font-serif text-3xl text-gray-900">
            دسته‌بندی محصولات
          </h2>
        </div>
        <p className="text-sm text-gray-500 mt-2 md:mt-0">
          چهار دسته اصلی · ۴۸ محصول منتخب
        </p>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={24}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="!pb-2"
      >
        {categories?.map((category) => (
          <SwiperSlide key={category.id} className="h-auto">
            <Link href={`/products/${encodeURIComponent(category.name)}`} className="h-full block">
              <CategoryCard category={category} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
