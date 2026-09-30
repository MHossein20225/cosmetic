import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "برای دسترسی احراز هویت کنید" },
      { status: 401 }
    );
  }

  return Response.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}