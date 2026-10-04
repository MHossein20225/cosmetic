import type { NavLink, Brand, CartItem } from "@/types";

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
    cartId: "cart-demo-1",
    productId: "p-demo-1",
    unitPrice: 68,
    quantity: 1,
    product: {
      id: 1,
      name: "Dew Elixir Facial Oil",
      description: "Cold-pressed Squalane & Rosehip",
      price: 68,
      discount: 0,
      stock: 100,
      imageUrl: "/images/nonProduct.jpg",
      categoryId: 1,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
    addedAt: new Date(),
  },
  {
    id: 2,
    name: "Petal Lip & Cheek Balm",
    cartId: "cart-demo-2",
    productId: "p-demo-2",
    unitPrice: 32,
    quantity: 1,
    product: {
      id: 2,
      name: "Petal Lip & Cheek Balm",
      description: "Shea Butter & Hibiscus extract",
      price: 32,
      discount: 0,
      stock: 100,
      imageUrl: "/images/nonProduct.jpg",
      categoryId: 2,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
    addedAt: new Date(),
  },
];

export const BRANDS: Brand[] = [
  { id: 1, name: "LUMIÈRE", image: "/images/nonProduct.jpg" },
  { id: 2, name: "AURELIA", image: "/images/nonProduct.jpg" },
  { id: 3, name: "ÉLAN", image: "/images/nonProduct.jpg" },
  { id: 4, name: "VELVET", image: "/images/nonProduct.jpg" },
  { id: 5, name: "NOIR", image: "/images/nonProduct.jpg" },
  { id: 6, name: "MAISON ROSE", image: "/images/nonProduct.jpg" },
  { id: 7, name: "ATELIER", image: "/images/nonProduct.jpg" },
  { id: 8, name: "SÉRUM", image: "/images/nonProduct.jpg" },
];
