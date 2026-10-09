import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/generated/prisma/client";
import { consumeRateLimits, getClientIp, rateLimitResponse } from "@/lib/rateLimit";

const SORTS_ORDER_BY: Record<string, Prisma.ProductOrderByWithRelationInput[]> =
  {
    featured: [{ id: "asc" }],
    newest: [{ createdAt: "desc" }, { id: "asc" }],
    "price-asc": [{ price: "asc" }, { id: "asc" }],
    "price-desc": [{ price: "desc" }, { id: "asc" }],
    "discount-desc": [{ discount: "desc" }, { id: "asc" }],
    "name-asc": [{ name: "asc" }, { id: "asc" }],
  };

export async function GET(request: Request) {
  try {
    const searchLimit = await consumeRateLimits([
      { key: `product-search:ip:${getClientIp(request)}`, limit: 120, windowMs: 60 * 1000 },
    ]);
    if (!searchLimit.allowed) return rateLimitResponse(searchLimit);

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";
    const sort = searchParams.get("sort") ?? "featured";

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 12);
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 48 ||
        (page - 1) * limit > 2147483647 || search.length > 200 || category.length > 200 || !Object.hasOwn(SORTS_ORDER_BY, sort)) {
      return Response.json({ error: "Invalid search parameters" }, { status: 400 });
    }

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

    const priceSort = sort === "price-asc" || sort === "price-desc";
    const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
    const [total, products] = await prisma.$transaction([
      prisma.product.count({
        where,
      }),

      priceSort ? prisma.$queryRaw<Product[]>(Prisma.sql`
        SELECT p.* FROM "Product" p JOIN "Category" c ON c."id" = p."categoryId"
        WHERE (${category} = '' OR c."name" = ${category})
          AND (${search} = '' OR p."name" ILIKE ${pattern} OR p."description" ILIKE ${pattern})
        ORDER BY ROUND(p."price"::numeric * (100 - p."discount") / 100)
          ${sort === "price-asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`}, p."id" ASC
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
      `) : prisma.product.findMany({
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
