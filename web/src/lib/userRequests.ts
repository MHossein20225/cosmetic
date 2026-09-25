import { User } from "@/types";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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



export async function getCurrentUser() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
  where: {
    id: sessionId,
  },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
    },
  },
});

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return session.user;
}