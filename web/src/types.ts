import type { MouseEventHandler } from "react";

export type Role = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}

export type SafeUser = Omit<User, "password">;

export interface NavLink {
  label: string;
  readonly href: string;
}

export interface NavLinkProps {
  link: NavLink;
  onClickFn?: MouseEventHandler;
}

export interface CartItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  qty: number;
  image: string;
}

export interface Brand {
  id: number;
  name: string;
  image: string;
}
