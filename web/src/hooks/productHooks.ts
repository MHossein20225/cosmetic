'use client'
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts, getProduct, getCategoriedProducts, searchProducts } from "../lib/productRequests";
import type { SearchProductsParams } from "@/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function useProducts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return { products: data, isLoading, isError, error };
}

export function useProduct(id: number | undefined) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id as number),
    enabled: id !== undefined,
  });
  return { product: data, isLoading, isError, error };
}

export function useCategoriedProducts(category: string | undefined) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", category],
    queryFn: () => getCategoriedProducts(category as string),
    enabled: category !== undefined,
  });
  return { categoriedProducts: data, isLoading, isError, error };
}

export function useSearchProducts(params: SearchProductsParams) {
  const search = useDebouncedValue(params.search ?? "");
  const queryParams = { ...params, search };
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["products", "search", queryParams],
    queryFn: () => searchProducts(queryParams),
    placeholderData: keepPreviousData,
  });
  return {
    products: data?.products,
    result: data,
    isLoading,
    isFetching,
    isError,
    error,
  };
}
