import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discount: z.number().min(0).default(0),
  stock: z.number().min(0).default(0),
  imageUrl: z.string().url().optional(),
  categoryId: z.number(),
});

export async function GET() {
  try {
    const products = await prisma.product.findMany();
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
    const body = await req.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "یک از وروردی ها یا اشتباه است یا وارد نشده" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({ data: result.data });
    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "محصول ساخته نشد" },
      { status: 500 },
    );
  }
}
