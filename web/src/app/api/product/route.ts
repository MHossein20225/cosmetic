import { prisma } from "@/lib/prisma";
import { authorizeMutation } from "@/lib/apiSecurity";
import { z } from "zod";

const productInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
  price: z.number().int().positive(),
  discount: z.number().int().min(0).max(100).default(0),
  stock: z.number().int().min(0),
  imageUrl: z.string().max(2048).optional(),
  categoryId: z.number().int().positive(),
}).strict();



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
    const authorization = await authorizeMutation(req, "ADMIN");
    if (authorization.response) return authorization.response;

    const body = await req.json();
    const result = productInputSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "ÛŒÚ© Ø§Ø² ÙˆØ±ÙˆØ±Ø¯ÛŒ Ù‡Ø§ ÛŒØ§ Ø§Ø´ØªØ¨Ø§Ù‡ Ø§Ø³Øª ÛŒØ§ ÙˆØ§Ø±Ø¯ Ù†Ø´Ø¯Ù‡" },
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
    return Response.json({ error: "Ù…Ø­ØµÙˆÙ„ Ø³Ø§Ø®ØªÙ‡ Ù†Ø´Ø¯" }, { status: 500 });
  }
}
