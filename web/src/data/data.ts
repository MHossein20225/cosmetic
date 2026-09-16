import type { Product, Category, NavLink } from "@/data/types";
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
    id: "skincare",
    name: "Skincare",
    description:
      "Hydrating serums, botanical oils, and gentle cleansing balms formulated for deep barrier restoration.",
    count: "18 Products",
    image: "/nonProduct.jpg",
  },
  {
    id: "makeup",
    name: "Makeup",
    description:
      "Featherlight tints, sheer luminizers, and dewy flush balms that enhance innate complexion.",
    count: "12 Products",
    image: "/nonProduct.jpg",
  },
  {
    id: "fragrance",
    name: "Fragrance",
    description:
      "Subtle botanical notes, warm cedarwood undertones, and ethereal hints of morning dewy rose.",
    count: "8 Fragrances",
    image: "/nonProduct.jpg",
  },
  {
    id: "bath-body",
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
  { label: "Brands", href: "/Brands" },
  { label: "About us", href: "/AboutUs" },
];