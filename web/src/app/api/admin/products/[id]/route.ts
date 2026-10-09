import { productSchema } from "@/types";
import { prisma } from "@/lib/prisma";
import { authorizeMutation } from "@/lib/apiSecurity";

const updateSchema = productSchema.partial().refine((value) => Object.keys(value).length > 0);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await authorizeMutation(request, "ADMIN");
  if (authorization.response) return authorization.response;
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) return Response.json({ error: "Invalid product ID" }, { status: 400 });

  try {
    const result = updateSchema.safeParse(await request.json().catch(() => null));
    if (!result.success) return Response.json({ error: "Invalid product data", fields: result.error.flatten().fieldErrors }, { status: 400 });
    const product = await prisma.product.update({ where: { id }, data: result.data });
    return Response.json(product);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") return Response.json({ error: "Category not found" }, { status: 400 });
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    console.error("PATCH /api/admin/products/[id] failed");
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await authorizeMutation(request, "ADMIN");
  if (authorization.response) return authorization.response;
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) return Response.json({ error: "Invalid product ID" }, { status: 400 });

  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    if (error && typeof error === "object" && "code" in error && ["P2003", "P2014"].includes(String(error.code))) {
      return Response.json({ error: "Product is referenced by existing records" }, { status: 409 });
    }
    console.error("DELETE /api/admin/products/[id] error:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
