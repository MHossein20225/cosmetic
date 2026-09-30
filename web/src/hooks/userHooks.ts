import { authUser, createUser, logInUser } from "@/lib/userRequests";
import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateUser() {
  const {
    mutate: userMutate,
    isError,
    isSuccess,
    error,
    isPending,
  } = useMutation({
    mutationKey: ["user", "register"],
    mutationFn: (user: Pick<User, "name" | "email" | "password">) =>
      createUser(user),
  });

  return {
    userMutate,
    isError,
    isSuccess,
    error,
    isPending,
  };
}

export function useLogInUser() {
  const {
    mutate: logInMutate,
    isSuccess,
    isError,
    isPending,
  } = useMutation({
    mutationKey: ["user", "login"],
    mutationFn: (user: Pick<User, "email" | "password">) => logInUser(user),
  });

  return {
    logInMutate,
    isError,
    isSuccess,
    isPending,
  };
}

export function useAuthUser() {
  const {
    data: user,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authUser,
  });

  return {
    user,
    isSuccess,
    isLoading,
    isError,
  };
}
