import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, createCart, getCart } from "@/lib/cartRequests";

export function useCreateCart() {
  const queryClient = useQueryClient();

  const {
    mutate: createCartMutate,
    data: cart,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationKey: ["cart", "create"],
    mutationFn: createCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
    },
  });

  return {
    createCartMutate,
    cart,
    isPending,
    isSuccess,
    isError,
    error,
  };
}



export function useCart() {
  const {data: cart, isLoading} = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  return {cart, isLoading}
}
export function useAddToCart() {
  const queryClient = useQueryClient();

  const {
    mutate: addToCartMutate,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationKey: ["cart", "add"],
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity?: number;
    }) => addToCart(productId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  return {
    addToCartMutate,
    isPending,
    isSuccess,
    isError,
    error,
  };
}
