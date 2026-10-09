import { prisma } from "@/lib/prisma";

export {
  PATCH,
  DELETE,
} from "@/app/api/admin/products/[id]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0 || productId > 2147483647) {
    return Response.json({ error: "Invalid product ID" }, { status: 400 });
  }
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });
  if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
  return Response.json(product);
}
