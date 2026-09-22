import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    return Response.json(category);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}
