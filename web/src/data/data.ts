import type { Product, Category } from "@/data/types";
export const PRODUCTS: Product[] = [
  {
    id: "botanical-gold-oil",
    category: "Skincare",
    title: "Botanical Gold Facial Oil",
    price: 48,
    oldPrice: null,
    rating: 4.8,
    reviews: 126,
    image: "/nonProduct.jpg",
  },
  {
    id: "dewy-flush-blush",
    category: "Makeup",
    title: "Dewy Flush Blush",
    price: 32,
    oldPrice: null,
    rating: 4.6,
    reviews: 84,
    image: "/nonProduct.jpg",
  },
  {
    id: "aura-nocturne-edp",
    category: "Fragrance",
    title: "Aura Nocturne EDP",
    price: 86,
    oldPrice: 98,
    rating: 4.9,
    reviews: 203,
    image: "/nonProduct.jpg",
  },
  {
    id: "whipped-body-souffle",
    category: "Bath & Body",
    title: "Whipped Body Soufflé",
    price: 28,
    oldPrice: null,
    rating: 4.7,
    reviews: 59,
    image: "/nonProduct.jpg",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "skincare",
    title: "Skincare",
    description:
      "Hydrating serums, botanical oils, and gentle cleansing balms formulated for deep barrier restoration.",
    count: "18 Products",
    image: "/nonProduct.jpg",
  },
  {
    id: "makeup",
    title: "Makeup",
    description:
      "Featherlight tints, sheer luminizers, and dewy flush balms that enhance innate complexion.",
    count: "12 Products",
    image: "/nonProduct.jpg",
  },
  {
    id: "fragrance",
    title: "Fragrance",
    description:
      "Subtle botanical notes, warm cedarwood undertones, and ethereal hints of morning dewy rose.",
    count: "8 Fragrances",
    image: "/nonProduct.jpg",
  },
  {
    id: "bath-body",
    title: "Bath & Body",
    description:
      "Silkening body washes and whipped body soufflés infused with skin-loving botanical squalane.",
    count: "10 Formulas",
    image: "/nonProduct.jpg",
  },
];