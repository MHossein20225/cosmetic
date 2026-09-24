import { createUser } from "@/lib/userRequests";
import { useMutation } from "@tanstack/react-query";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export function useCreateUser() {
  const {
    mutate: userMutate,
    isError,
    isSuccess,
    error,
    isPending,
  } = useMutation({
    mutationKey: ["user"],
    mutationFn: (user: CreateUserInput) => createUser(user),
  });

  return {
    userMutate,
    isError,
    isSuccess,
    error,
    isPending,
  };
}
