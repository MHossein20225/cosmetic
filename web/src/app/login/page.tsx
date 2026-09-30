"use client";
import { useCreateCart } from "@/hooks/cartHooks";
import { useLogInUser } from "@/hooks/userHooks";
import { User, userSchema } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [inputError, setInputError] = useState<
    Partial<Pick<User, "email" | "password">>
  >({});

  const { logInMutate, isPending, isError } = useLogInUser();
  const { createCartMutate } = useCreateCart();

  function submitHandle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = userSchema.omit({ name: true }).safeParse(data);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setInputError({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    logInMutate(result.data, {
      onSuccess: () => {
        createCartMutate();
        router.push("/");
      },
    });
  }
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-16 md:py-24 flex flex-col items-center">
      <h1 className="font-serif text-3xl text-gray-900 mb-8">Welcome Back</h1>

      <form
        onSubmit={(e) => submitHandle(e)}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs font-medium uppercase tracking-wider text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            className="bg-white px-4 py-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
          <span className="text-xs text-gray-400">
            {inputError && inputError.email}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-xs font-medium uppercase tracking-wider text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="bg-white px-4 py-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
          <span className="text-xs text-gray-400">
            {inputError && inputError.password}
          </span>
        </div>

        {
          isError && "ایمیل یا رمز اشتباه است"
        }

        <button
          type="submit"
          className="w-full bg-amber-800 text-white py-3 rounded text-xs font-medium uppercase tracking-wider hover:bg-amber-900 transition-colors"
        >
          {isPending ? "wait..." : "Log In"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-800 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
