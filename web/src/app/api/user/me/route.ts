import { getCurrentUser } from "@/lib/session";
import { validateCsrfToken } from "@/lib/csrf";
import { cookies } from "next/headers";

const CSRF_TOKEN = "csrfToken";
const CSRF_HEADER = "x-csrf-token";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (!validateCsrfToken(cookieStore, request.headers)) {
    return Response.json({ error: "درخواست کد تحریم معتبر نیست" }, { status: 403 });
  }

  const user = await getCurrentUser();
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