'use client'
import { useQuery } from "@tanstack/react-query";
import { getProducts, getProduct, getCategoriedProducts } from "../lib/productRequests";
import type { Product } from "@/types";

export function useProducts() {
  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return { products: data, isLoading, isError, error };
}

export function useProduct(id: number | undefined) {
  const { data, isLoading, isError, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id as number),
    enabled: id !== undefined,
  });
  return { product: data, isLoading, isError, error };
}

export function useCategoriedProducts(category: string | undefined) {
  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: () => getCategoriedProducts(category as string),
    enabled: category !== undefined,
  });
  return { categoriedProduct: data, isLoading, isError, error };
}
