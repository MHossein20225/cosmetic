import { createHmac, randomUUID } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type RateLimitDecision = { allowed: boolean; retryAfterSeconds: number };
let cleanupTick = 0;

function hashKey(value: string) {
  const secret = process.env.RATE_LIMIT_SECRET ?? process.env.DATABASE_URL;
  if (!secret) throw new Error("Rate limit secret is not configured");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return (forwarded || realIp || "unknown").slice(0, 128);
}

export function getNetworkKey(ip: string) {
  if (ip.includes(".")) {
    const octets = ip.split(".");
    if (octets.length === 4 && octets.every((part) => /^\d{1,3}$/.test(part))) {
      return `${octets.slice(0, 3).join(".")}.0/24`;
    }
  }
  if (ip.includes(":")) return `${ip.split(":").slice(0, 4).join(":")}/64`;
  return ip;
}

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitDecision> {
  cleanupTick += 1;
  if (cleanupTick % 100 === 0) {
    await prisma.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  }

  const hashedKey = hashKey(key);
  const rows = await prisma.$queryRaw<Array<{ count: number; expiresAt: Date }>>(
    Prisma.sql`
      INSERT INTO "RateLimit" ("id", "email", "count", "expiresAt", "createdAt")
      VALUES (${randomUUID()}, ${hashedKey}, 1, NOW() + (${windowMs} * INTERVAL '1 millisecond'), NOW())
      ON CONFLICT ("email") DO UPDATE SET
        "count" = CASE WHEN "RateLimit"."expiresAt" <= NOW() THEN 1 ELSE "RateLimit"."count" + 1 END,
        "expiresAt" = CASE
          WHEN "RateLimit"."expiresAt" <= NOW()
            THEN NOW() + (${windowMs} * INTERVAL '1 millisecond')
          ELSE "RateLimit"."expiresAt"
        END
      RETURNING "count", "expiresAt"
    `,
  );

  const row = rows[0];
  return {
    allowed: row.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((row.expiresAt.getTime() - Date.now()) / 1000)),
  };
}

export async function consumeRateLimits(
  checks: Array<{ key: string; limit: number; windowMs: number }>,
) {
  const results = await Promise.all(
    checks.map(({ key, limit, windowMs }) => consumeRateLimit(key, limit, windowMs)),
  );
  const blocked = results.filter((result) => !result.allowed);
  return blocked.length
    ? { allowed: false, retryAfterSeconds: Math.max(...blocked.map((item) => item.retryAfterSeconds)) }
    : { allowed: true, retryAfterSeconds: 0 };
}

export function rateLimitResponse(decision: RateLimitDecision) {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(decision.retryAfterSeconds) } },
  );
}
