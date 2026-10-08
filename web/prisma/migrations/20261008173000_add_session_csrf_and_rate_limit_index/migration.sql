ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "csrfToken" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Session_csrfToken_key" ON "Session"("csrfToken");

CREATE TABLE IF NOT EXISTS "RateLimit" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RateLimit_email_key" ON "RateLimit"("email");

ALTER TABLE "RateLimit"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");
