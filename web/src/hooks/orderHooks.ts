import { addOrder } from "@/lib/orderRequests";
import { Order } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateOrder() {
  const {
    mutate: orderMutate,
    isError,
    isSuccess,
    error,
    isPending,
  } = useMutation({
    mutationKey: ["order"],
    mutationFn: (
      data: Pick<Order, "recipientName" | "phoneNumber" | "address">,
    ) => addOrder(data),
  });
  return {
    orderMutate,
    isError,
    isSuccess,
    error,
    isPending,
  };
}
