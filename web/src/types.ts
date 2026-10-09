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
  imageUrl?: string | null;
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
  productId: number | null;
  productName: string;
  product?: Product | null;
  quantity: number;
  unitPrice: number;
}

export const userSchema = z.object({
  name: z.string().trim().min(3, "نام باید حداقل 3 حرف باشد").max(200),
  email: z.string().trim().email("ایمیل معتبر نیست").max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(6, "رمز باید بیشتر از 6 حرف باشد").max(72, "رمز باید حداکثر 72 حرف باشد").refine((password) => new TextEncoder().encode(password).length <= 72, "رمز عبور بیش از حد طولانی است"),
});

export const orderSchema = z.object({
  recipientName: z.string().trim().min(3, "نام حداقل باید 3 حرف باشد").max(200),
  phoneNumber: z.string().regex(/^09\d{9}$/, "شماره معتبر نیست"),
  address: z.string().trim().min(1, "آدرس را وارد کنید").max(2000),
});

export const cartItemSchema = z.object({
  productId: z.number().int().positive().max(2147483647),
  quantity: z.number().int().positive().max(2147483647).default(1),
});

export const cartQuantitySchema = cartItemSchema.pick({ quantity: true }).required();

export const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
  price: z.number().int().positive().max(2147483647),
  discount: z.number().int().min(0).max(100).default(0),
  stock: z.number().int().min(0).max(2147483647).default(0),
  imageUrl: z.string().max(2048).refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "lh3.googleusercontent.com";
    } catch {
      return false;
    }
  }, "Use a local image path or an allowed HTTPS image URL").nullable().optional(),
  categoryId: z.number().int().positive().max(2147483647),
}).strict();
