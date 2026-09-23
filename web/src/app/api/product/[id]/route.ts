import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
    },
  });

  if (!product) {
    return Response.json(
      { error: "محصول پیدا نشد" },
      { status: 404 },
    );
  }

  return Response.json(product);
}
