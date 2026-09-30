import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  createCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/cartRequests";

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

  const items = cart?.items ?? [];
  const count = items.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );
  const subtotal = items.reduce(
    (sum: number, item: { unitPrice: number; quantity: number }) =>
      sum + item.unitPrice * item.quantity,
    0
  );

  return {cart, items, count, subtotal, isLoading}
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

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  const {
    mutate: updateCartItemMutate,
    isPending,
  } = useMutation({
    mutationKey: ["cart", "update"],
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => updateCartItemQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  return {
    updateCartItemMutate,
    isPending,
  };
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  const {
    mutate: removeCartItemMutate,
    isPending,
  } = useMutation({
    mutationKey: ["cart", "remove"],
    mutationFn: (productId: number) => removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  return {
    removeCartItemMutate,
    isPending,
  };
}
