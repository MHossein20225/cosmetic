import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-16 md:py-24 flex flex-col items-center">
      <h1 className="font-serif text-3xl text-gray-900 mb-8">Welcome Back</h1>

      <form className="flex flex-col gap-4 w-full max-w-sm">
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
            required
            className="bg-white px-4 py-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-800 text-white py-3 rounded text-xs font-medium uppercase tracking-wider hover:bg-amber-900 transition-colors"
        >
          Log In
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