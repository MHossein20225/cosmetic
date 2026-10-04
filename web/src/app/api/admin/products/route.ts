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
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(products);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
  }

  const body = await req.json();
  const result = createProductSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: "فرمت داده‌ها معتبر نیست", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, description, price, discount, stock, imageUrl, categoryId } = result.data;

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
}
