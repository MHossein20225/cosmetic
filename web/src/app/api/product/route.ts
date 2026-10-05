import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discount: z.number().default(0),
  stock: z.number().min(0).default(0),
  imageUrl: z.string().url().optional(),
  categoryId: z.number(),
});

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

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ error: "احراز هویت لازم است" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
    }

    const body = await req.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "یک از وروردی ها یا اشتباه است یا وارد نشده" },
        { status: 400 },
      );
    }

    const { name, description, price, discount = 0, stock, imageUrl, categoryId } =
      result.data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        discount,
        stock,
        imageUrl,
        categoryId,
      },
    });
    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "محصول ساخته نشد" }, { status: 500 });
  }
}
