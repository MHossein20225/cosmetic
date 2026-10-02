import type { MouseEventHandler } from "react";
import z from "zod";

export type Role = "CUSTOMER" | "ADMIN";
export type Status = "QUEUE" | "PREPARED" | "DELIVERIED";

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
  cartId: string;
  productId: string;
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
  deliveryTime: Date;
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
