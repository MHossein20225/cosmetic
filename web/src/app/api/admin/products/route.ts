import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorizeMutation, requireRole } from "@/lib/apiSecurity";

const productInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
  price: z.number().int().positive(),
  discount: z.number().int().min(0).max(100).default(0),
  stock: z.number().int().min(0),
  imageUrl: z.string().max(2048).optional(),
  categoryId: z.number().int().positive(),
}).strict();

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
    const result = productInputSchema.safeParse(await request.json());
    if (!result.success) {
      return Response.json({ error: "Invalid product data", fields: result.error.flatten().fieldErrors }, { status: 400 });
    }
    const product = await prisma.product.create({ data: result.data });
    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
