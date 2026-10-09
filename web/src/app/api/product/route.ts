import { prisma } from "@/lib/prisma";
export { POST } from "@/app/api/admin/products/route";



export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
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

