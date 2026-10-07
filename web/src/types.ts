import type { MouseEventHandler } from "react";
import z from "zod";

export type Role = "CUSTOMER" | "ADMIN";
export type Status = "QUEUE" | "PREPARED" | "DELIVERED";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDTO = Omit<User, "password">;

export type SafeUser = Omit<User, "password">;

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  imageUrl: string | null;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export type ProductSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "discount-desc"
  | "name-asc";

export interface SearchProductsParams {
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
  category?: string;
}

export interface SearchProductsResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export interface NavLink {
  label: string;
  readonly href: string;
}

export interface NavLinkProps {
  link: NavLink;
  onClickFn?: MouseEventHandler;
}

export interface CartItem {
  id: string;
  name: string;
  cartId: string;
  productId: number;
  unitPrice: number;
  quantity: number;
  product: Product;
  addedAt: Date;
}

export interface Brand {
  id: number;
  name: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  recipientName: string;
  phoneNumber: string;
  address: string;
  totalPrice: number;
  status: Status;
  createdAt: Date;
  deliveryTime: Date | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export const userSchema = z.object({
  name: z.string().min(3, "نام باید حداقل 3 حرف باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز باید بیشتر از 6 حرف باشد"),
});

export const orderSchema = z.object({
  recipientName: z.string().min(3, "نام حداقل باید 3 حرف باشد"),
  phoneNumber: z.string().startsWith("09").max(11, "شماره معتبر نیست"),
  address: z.string().min(1, "آدرس را وارد کنید"),
});

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discount: z.number().default(0),
  stock: z.number().positive().min(0).default(0),
  imageUrl: z.string().url().optional(),
  categoryId: z.number(),
});
