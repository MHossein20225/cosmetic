import { addOrder, getMyOrders, getOrder } from "@/lib/orderRequests";
import { Order } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMyOrders(userId?: string) {
  return useQuery({
    queryKey: ["orders", "my", userId],
    queryFn: getMyOrders,
    enabled: !!userId,
  });
}

export function useOrder(id: string, userId?: string) {
  return useQuery({
    queryKey: ["orders", "my", userId, id],
    queryFn: () => getOrder(id),
    enabled: !!userId && !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const {
    mutate: orderMutate,
    mutateAsync: orderMutateAsync,
    isError,
    isSuccess,
    error,
    isPending,
  } = useMutation({
    mutationKey: ["order"],
    mutationFn: (
      data: Pick<Order, "recipientName" | "phoneNumber" | "address">,
    ) => addOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
  return {
    orderMutate,
    orderMutateAsync,
    isError,
    isSuccess,
    error,
    isPending,
  };
}
