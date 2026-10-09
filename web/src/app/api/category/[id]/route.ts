import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0 || Number(id) > 2147483647) return Response.json({ error: "Invalid category ID" }, { status: 400 });
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category) return Response.json({ error: "Category not found" }, { status: 404 });
    return Response.json(category);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}
