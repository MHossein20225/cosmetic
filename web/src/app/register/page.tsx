"use client";
import { useCreateUser } from "@/hooks/userHooks";
import { User, userSchema } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Register() {
  const router = useRouter();
  const { userMutate, isPending } = useCreateUser();
  const [inputError, setInputError] = useState<
    Partial<Pick<User, "name" | "email" | "password">>
  >({});

  function submitHandle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const user = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    };

    const result = userSchema.safeParse(user);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setInputError({
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    userMutate(result.data, {
      onSuccess: () => router.push("/login"),
    });
  }
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-16 md:py-24 flex flex-col items-center">
      <h1 className="font-serif text-3xl text-gray-900 mb-8">
        Create Your Account
      </h1>

      <form
        onSubmit={(e) => submitHandle(e)}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
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
            className="bg-white px-4 py-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
          <span className="text-xs text-gray-400">
            {inputError && inputError.name}
          </span>
        </div>

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
            required
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
            minLength={8}
            className="bg-white px-4 py-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
          <span className="text-xs text-gray-400">
            {inputError && inputError.password}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-800 text-white py-3 rounded text-xs font-medium uppercase tracking-wider hover:bg-amber-900 transition-colors"
        >
          {isPending ? "wait ...." : "Create Account"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-800 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
