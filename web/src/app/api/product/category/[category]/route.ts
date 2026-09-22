import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await params;
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: category,
        },
      },
      include: {
        category: true,
      },
    });

    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}