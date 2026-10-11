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

  const { logInMutate, isPending, isError, error} = useLogInUser();
  const { createCartMutate } = useCreateCart();

  function submitHandle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = userSchema
      .omit({ name: true })
      .safeParse(data);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setInputError({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });

      return;
    }

    setInputError({});

    logInMutate(result.data, {
      onSuccess: () => {
        createCartMutate();
        router.push("/");
      },
    });
  }

  function clearEmailError() {
    setInputError((prev) => {
      if (!prev.email) return prev;

      return {
        ...prev,
        email: undefined,
      };
    });
  }

  function clearPasswordError() {
    setInputError((prev) => {
      if (!prev.password) return prev;

      return {
        ...prev,
        password: undefined,
      };
    });
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-16 md:py-24 flex flex-col items-center">
      <h1 className="font-serif text-3xl text-gray-900 mb-8">
        خوش آمدید
      </h1>

      <form
        onSubmit={submitHandle}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs font-medium uppercase tracking-wider text-gray-700"
          >
            ایمیل
          </label>

          <input
            id="email"
            name="email"
            type="text"
            dir="ltr"
            autoComplete="email"
            onChange={clearEmailError}
            className="bg-white px-4 py-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800"
          />

          {inputError.email && (
            <span className="text-xs text-red-500">
              {inputError.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-xs font-medium uppercase tracking-wider text-gray-700"
          >
            رمز عبور
          </label>

          <input
            id="password"
            name="password"
            type="password"
            onChange={clearPasswordError}
            className="bg-white px-4 py-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800"
          />

          {inputError.password && (
            <span className="text-xs text-red-500 text-end">
              {inputError.password}
            </span>
          )}
        </div>

        {isError && (
          <span className="text-xs text-end text-red-600">
            {error?.message}
          </span>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-amber-800 text-white py-3 rounded text-xs font-medium uppercase tracking-wider hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "لطفاً صبر کنید..." : "ورود"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-amber-800 hover:underline"
          >
             ثبت‌نام
          </Link>
        </p>
      </form>
    </div>
  );
}
