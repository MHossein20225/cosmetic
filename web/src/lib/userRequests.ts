import { User } from "@/types";

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
  const response = await fetch(`/api/user/login`,{
    method: "POST",
    body: JSON.stringify(user)
  });

  if (!response.ok) {
    throw new Error("خطا در ثبت کاربر");
  }

  return response.json();
}

export async function authUser() {
  const response = await fetch("/api/user/me");

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function logOutUser() {
  const response = await fetch("/api/user/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("خطا در خروج از حساب");
  }

  return response.json();
}
