import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
    const user = await getCurrentUser()
    if (user?.role !== "ADMIN") {
      return Response.json({ error: "فقط ادمین دسترسی دارد" }, { status: 403 });
    }

    const users = await prisma.user.findMany()
    
    if(!users.length){
        return Response.json({ error: "کاربری وجود ندارد" }, { status: 403 });
    }
    return users
}