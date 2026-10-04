"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authUser } from "@/lib/userRequests";
import type { User, Role } from "@/types";

export function useAdminAuth() {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["admin"],
    queryFn: authUser,
  });

  return { user, isLoading, isError, error };
}

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "دریافت کاربران انجام نشد");
      }
      return res.json();
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Role }) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", email: "", password: "", role }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "تغییر نقش کاربر انجام نشد");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      refetch();
    },
  });

  const updateUserRoleAsync = async (payload: { id: string; role: Role }) => {
    return updateUserRole.mutateAsync(payload);
  };

  return { users, isLoading, isError, error, refetch, updateUserRole, updateUserRoleAsync };
}

export function useAdminProducts() {
  const queryClient = useQueryClient();

  const { data: products, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const res = await fetch("/api/admin/products");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "دریافت محصولات انجام نشد");
      }
      return res.json();
    },
  });

  const createProduct = useMutation({
    mutationFn: async (product: {
      name: string;
      description: string;
      price: number;
      discount?: number;
      stock: number;
      imageUrl?: string;
      categoryId: number;
    }) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "ساخت محصول انجام نشد");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      refetch();
    },
  });

  const createProductAsync = async (payload: {
    name: string;
    description: string;
    price: number;
    discount?: number;
    stock: number;
    imageUrl?: string;
    categoryId: number;
  }) => {
    return createProduct.mutateAsync(payload);
  };

  return { products, isLoading, isError, error, refetch, createProduct, createProductAsync };
}

export function useAdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "دریافت سفارشات انجام نشد");
      }
      return res.json();
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "QUEUE" | "PREPARED" | "DELIVERIED" }) => {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "به‌روزرسانی سفارش انجام نشد");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      refetch();
    },
  });

  const updateOrderStatusAsync = async (payload: { id: string; status: "QUEUE" | "PREPARED" | "DELIVERIED" }) => {
    return updateOrderStatus.mutateAsync(payload);
  };

  return { orders, isLoading, isError, error, refetch, updateOrderStatus, updateOrderStatusAsync };
}
