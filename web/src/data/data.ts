import type { Product, Category, NavLink, CartItem } from "@/data/types";
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Dew Elixir Facial Oil",
    price: 68,
    description: "Nourishing botanical blend with cold-pressed squalane & marula.",
    category: "skincare",
    image: "/nonProduct.jpg",
  },
  {
    id: 2,
    name: "Silk Cloud Cleanser",
    price: 42,
    description: "Marshmallow root & colloidal oat milk velvety melt.",
    category: "skincare",
    image: "/nonProduct.jpg",
  },
  {
    id: 3,
    name: "Luminous Skin Tint",
    price: 54,
    description: "Sheer dewy mineral coverage infused with hyaluronic acid.",
    category: "complexion",
    image: "/nonProduct.jpg",
  },
  {
    id: 4,
    name: "Petal Lip & Cheek",
    price: 32,
    description: "Wild rosehip & whipped tinted shea butter glow.",
    category: "complexion",
    image: "/nonProduct.jpg",
  },
  {
    id: 5,
    name: "Velvet Rose Parfum",
    price: 95,
    description: "Soft amber, damask rose petal, and warm cedar accords.",
    category: "fragrance",
    image: "/nonProduct.jpg",
  },
  {
    id: 6,
    name: "Botanical Body Glaze",
    price: 48,
    description: "Sweet almond, sugarcane squalane & golden vanilla.",
    category: "body",
    image: "/nonProduct.jpg",
  },
  {
    id: 7,
    name: "Peptide Barrier Cream",
    price: 72,
    description: "Deep lipid recovery with 5 biomimetic ceramides.",
    category: "skincare",
    image: "/nonProduct.jpg",
  },
  {
    id: 8,
    name: "Illuminating Drops",
    price: 38,
    description: "Subtle golden glass-skin glow with crushed mica minerals.",
    category: "complexion",
    image: "/nonProduct.jpg",
  },
];
export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Skincare",
    description:
      "Hydrating serums, botanical oils, and gentle cleansing balms formulated for deep barrier restoration.",
    count: "18 Products",
    image: "/nonProduct.jpg",
  },
  {
    id: 2,
    name: "Makeup",
    description:
      "Featherlight tints, sheer luminizers, and dewy flush balms that enhance innate complexion.",
    count: "12 Products",
    image: "/nonProduct.jpg",
  },
  {
    id: 3,
    name: "Fragrance",
    description:
      "Subtle botanical notes, warm cedarwood undertones, and ethereal hints of morning dewy rose.",
    count: "8 Fragrances",
    image: "/nonProduct.jpg",
  },
  {
    id: 4,
    name: "Bath & Body",
    description:
      "Silkening body washes and whipped body soufflés infused with skin-loving botanical squalane.",
    count: "10 Formulas",
    image: "/nonProduct.jpg",
  },
];


export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "About us", href: "/about_us" },
];

export const CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Dew Elixir Facial Oil",
    category: "Botanical Elixir",
    description: "Size: 30ml / 1.0 fl. oz • Cold-pressed Squalane & Rosehip",
    price: 68,
    qty: 1,
    image: "/nonImage.jpg",
  },
  {
    id: 2,
    name: "Petal Lip & Cheek Balm",
    category: "Nourishing Tint",
    description: "Shade: Peony flush • Shea Butter & Hibiscus extract",
    price: 32,
    qty: 1,
    image: "/nonImage.jpg",
  },
];

export const BRANDS = [
  {
    id: 1,
    name: "LUMIÈRE",
    image: "/nonProduct.jpg",
  },
  {
    id: 2,
    name: "AURELIA",
    image: "/nonProduct.jpg",
  },
  {
    id: 3,
    name: "ÉLAN",
    image: "/nonProduct.jpg",
  },
  {
    id: 4,
    name: "VELVET",
    image: "/nonProduct.jpg",
  },
  {
    id: 5,
    name: "NOIR",
    image: "/nonProduct.jpg",
  },
  {
    id: 6,
    name: "MAISON ROSE",
    image: "/nonProduct.jpg",
  },
  {
    id: 7,
    name: "ATELIER",
    image: "/nonProduct.jpg",
  },
  {
    id: 8,
    name: "SÉRUM",
    image: "/nonProduct.jpg",
  },
];