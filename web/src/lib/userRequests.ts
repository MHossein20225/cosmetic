import { User } from "@/types";
import { apiFetch, clearCsrfTokenCache } from "@/lib/apiFetch";

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await apiFetch("/api/user/register", {
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
  const response = await apiFetch(`/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("رمز یا نام کاربری اشتباه است");
  }

  const data = await response.json();
  clearCsrfTokenCache();
  return data;
}

export async function authUser() {
  const response = await fetch("/api/user/me");

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function logOutUser() {
  const response = await apiFetch("/api/user/logout", { method: "POST" });

  if (!response.ok) {
    throw new Error("خطا در خروج از حساب");
  }

  const result = await response.json();
  clearCsrfTokenCache();
  return result;
}
