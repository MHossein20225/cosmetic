"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "@/hooks/userHooks";
import { apiFetch } from "@/lib/apiFetch";
import type { CreateProductInput, ProductWithCategory, Order, Status } from "@/types";

export { useAdminUsers } from "@/hooks/userHooks";

export function useAdminAuth() {
  return useAuthUser();
}

async function adminRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(url, init);
  const body = await res.json();
  if (!res.ok) throw new Error(typeof body.error === "string" ? body.error : "Request failed");
  return body;
}

export function useAdminProducts() {
  const queryClient = useQueryClient();
  const { data: products, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => adminRequest<ProductWithCategory[]>("/api/admin/products"),
  });
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product"] });
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };
  const createProduct = useMutation({
    mutationFn: (product: CreateProductInput) => adminRequest("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }),
    onSuccess,
  });
  const updateProduct = useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<CreateProductInput> }) => adminRequest(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }),
    onSuccess,
  });
  const deleteProduct = useMutation({
    mutationFn: (id: number) => adminRequest(`/api/admin/products/${id}`, { method: "DELETE" }),
    onSuccess,
  });

  return {
    products, isLoading, isError, error, refetch, createProduct, updateProduct, deleteProduct,
    createProductAsync: createProduct.mutateAsync,
    updateProductAsync: updateProduct.mutateAsync,
    deleteProductAsync: deleteProduct.mutateAsync,
  };
}

export function useAdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => adminRequest<Order[]>("/api/admin/orders"),
  });
  const updateOrderStatus = useMutation({
    mutationFn: (payload: { id: string; status: Status }) => adminRequest("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return { orders, isLoading, isError, error, refetch, updateOrderStatus, updateOrderStatusAsync: updateOrderStatus.mutateAsync };
}
