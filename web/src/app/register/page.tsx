"use client";

import { useCreateUser } from "@/hooks/userHooks";
import { User, userSchema } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();

  const { userMutate, isPending } = useCreateUser();

  const [inputError, setInputError] = useState<
    Partial<Pick<User, "name" | "email" | "password">>
  >({});

  function submitHandle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isPending) return;

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = userSchema.safeParse(data);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setInputError({
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      });

      return;
    }

    setInputError({});

    userMutate(result.data, {
      onSuccess: () => {
        toast.success("ثبت نام با موفقیت انجام شد. کمی صبر کنید...")
        setTimeout(() => {
          router.push("/login");        
        }, 2000)
      },
    });
  }

  function clearNameError() {
    setInputError((prev) => ({
      ...prev,
      name: undefined,
    }));
  }

  function clearEmailError() {
    setInputError((prev) => ({
      ...prev,
      email: undefined,
    }));
  }

  function clearPasswordError() {
    setInputError((prev) => ({
      ...prev,
      password: undefined,
    }));
  }

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center px-4 py-16 sm:px-6 md:py-24">
      <h1 className="mb-8 font-serif text-3xl text-gray-900">
        Create Your Account
      </h1>

      <form
        onSubmit={submitHandle}
        className="flex w-full max-w-sm flex-col gap-4"
        noValidate
      >
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="text-xs font-medium uppercase tracking-wider text-gray-700"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            onChange={clearNameError}
            className={`rounded border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              inputError.name
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-amber-800"
            }`}
          />

          {inputError.name && (
            <span className="text-xs text-red-500">
              {inputError.name}
            </span>
          )}
        </div>

        {/* Email */}
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
            type="email"
            autoComplete="email"
            onChange={clearEmailError}
            className={`rounded border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              inputError.email
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-amber-800"
            }`}
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
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            onChange={clearPasswordError}
            className={`rounded border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              inputError.password
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-amber-800"
            }`}
          />

          {inputError.password && (
            <span className="text-xs text-red-500">
              {inputError.password}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-amber-800 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-800 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
