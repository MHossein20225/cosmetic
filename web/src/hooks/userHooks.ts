import type { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authUser, createUser, logInUser, logOutUser } from "@/lib/userRequests";



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

export function useLogOut() {
  const queryClient = useQueryClient();

  const { mutate: logOutMutate, isPending } = useMutation({
    mutationKey: ["user", "logout"],
    mutationFn: logOutUser,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey:["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", "search", { search: "" }] });
    },
  });

  return {
    logOutMutate,
    isPending,
  };
}

export function useAllUsers() {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "دریافت کاربران انجام نشد");
      }
      return res.json();
    },
  });

  return { users, isLoading, isError, error, refetch };
}

export function useUserList() {
  return useAllUsers();
}

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "دریافت کاربران انجام نشد");
      }
      return res.json();
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "CUSTOMER" | "ADMIN" }) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", email: "", password: "", role }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "تغییر نقش کاربر انجام نشد");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      refetch();
    },
  });

  const updateUserRoleAsync = async (payload: { id: string; role: "CUSTOMER" | "ADMIN" }) => {
    return updateUserRole.mutateAsync(payload);
  };

  return { users, isLoading, isError, error, refetch, updateUserRole, updateUserRoleAsync };
}
