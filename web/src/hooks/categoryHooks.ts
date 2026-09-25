import { getCategories, getCategory } from "@/lib/categoryRequests";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCategories(){
    const { data, isLoading, isError, error } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: getCategories
    })
    return { categories: data, isLoading, isError, error };
}

export function useCategory(id: number | undefined){
    const { data, isLoading, isError, error } = useQuery<Category>({
        queryKey: ["category", id],
        queryFn: () => getCategory(id as number)
    })
    return { category: data, isLoading, isError, error };
}