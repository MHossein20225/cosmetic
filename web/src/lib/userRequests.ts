import { User } from "@/types";

export async function setCsrfToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("csrfToken", token);
  }
}

export async function getCsrfToken(): Promise<string> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("csrfToken") ?? "";
  }
  return "";
}

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("خطا در ایجاد کاربر");
  }

  return response.json();
}

export async function logInUser(user: Pick<User, "email" | "password">) {
  const response = await fetch(`/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("خطا در ثبت کاربر");
  }

  const data = await response.json();
  await setCsrfToken(data.csrfToken ?? "");
  return data;
}

export async function authUser() {
  const response = await fetch("/api/user/me", {
    headers: {
      "x-csrf-token": await getCsrfToken(),
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function logOutUser() {
  const response = await fetch("/api/user/logout", {
    method: "POST",
    headers: {
      "x-csrf-token": await getCsrfToken(),
    },
  });

  if (!response.ok) {
    throw new Error("خطا در خروج از حساب");
  }

  return response.json();
}
