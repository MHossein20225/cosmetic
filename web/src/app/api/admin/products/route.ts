import { productSchema } from "@/types";
import { prisma } from "@/lib/prisma";
import { authorizeMutation, requireRole } from "@/lib/apiSecurity";

export async function GET() {
  const authorization = await requireRole("ADMIN");
  if (authorization.response) return authorization.response;
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { id: "asc" },
  });
  return Response.json(products);
}

export async function POST(request: Request) {
  const authorization = await authorizeMutation(request, "ADMIN");
  if (authorization.response) return authorization.response;

  try {
    const result = productSchema.safeParse(await request.json().catch(() => null));
    if (!result.success) {
      return Response.json({ error: "Invalid product data", fields: result.error.flatten().fieldErrors }, { status: 400 });
    }
    const product = await prisma.product.create({ data: result.data });
    return Response.json(product, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") return Response.json({ error: "Category not found" }, { status: 400 });
    console.error("POST /api/admin/products failed");
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
