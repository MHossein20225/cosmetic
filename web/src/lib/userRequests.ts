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
