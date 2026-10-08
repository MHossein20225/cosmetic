import { getCurrentSession } from "@/lib/session";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.csrfToken) {
    return Response.json({ error: "Unable to create security token" }, { status: 500 });
  }

  return Response.json(
    { csrfToken: session.csrfToken },
    { headers: { "Cache-Control": "no-store, private" } },
  );
}
