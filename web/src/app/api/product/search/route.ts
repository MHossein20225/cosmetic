import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const SORTS_ORDER_BY: Record<string, Prisma.ProductOrderByWithRelationInput[]> =
  {
    featured: [{ id: "asc" }],
    newest: [{ createdAt: "desc" }, { id: "asc" }],
    "discount-desc": [{ discount: "desc" }, { id: "asc" }],
    "name-asc": [{ name: "asc" }, { id: "asc" }],
  };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";
    const sort = searchParams.get("sort") ?? "featured";

    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const limit = Math.min(
      48,
      Math.max(1, Number(searchParams.get("limit")) || 12),
    );

    const where: Prisma.ProductWhereInput = {
      ...(category
        ? {
            category: {
              name: category,
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

    const [total, products] = await Promise.all([
      prisma.product.count({
        where,
      }),

      prisma.product.findMany({
        where,

        orderBy: SORTS_ORDER_BY[sort] ?? SORTS_ORDER_BY.featured,

        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return Response.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to fetch products",
      },
      {
        status: 500,
      },
    );
  }
}
