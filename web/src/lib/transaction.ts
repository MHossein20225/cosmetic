import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export class TransactionConflictError extends Error {}

export async function runSerializable<T>(operation: (tx: Prisma.TransactionClient) => Promise<T>) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2034") throw error;
      if (attempt === 4) throw new TransactionConflictError("Please retry the request");
      await new Promise((resolve) => setTimeout(resolve, 20 * (attempt + 1)));
    }
  }
  throw new TransactionConflictError("Please retry the request");
}
