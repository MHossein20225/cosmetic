import type { NavLink, CartItem, Brand } from "@/types";


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
    image: "/images/nonProduct.jpg",
  },
  {
    id: 2,
    name: "Petal Lip & Cheek Balm",
    category: "Nourishing Tint",
    description: "Shade: Peony flush • Shea Butter & Hibiscus extract",
    price: 32,
    qty: 1,
    image: "/images/nonProduct.jpg",
  },
];

export const BRANDS: Brand[] = [
  {
    id: 1,
    name: "LUMIÈRE",
    image: "/images/nonProduct.jpg",
  },
  {
    id: 2,
    name: "AURELIA",
    image: "/images/nonProduct.jpg",
  },
  {
    id: 3,
    name: "ÉLAN",
    image: "/images/nonProduct.jpg",
  },
  {
    id: 4,
    name: "VELVET",
    image: "/images/nonProduct.jpg",
  },
  {
    id: 5,
    name: "NOIR",
    image: "/images/nonProduct.jpg",
  },
  {
    id: 6,
    name: "MAISON ROSE",
    image: "/images/nonProduct.jpg",
  },
  {
    id: 7,
    name: "ATELIER",
    image: "/images/nonProduct.jpg",
  },
  {
    id: 8,
    name: "SÉRUM",
    image: "/images/nonProduct.jpg",
  },
];
