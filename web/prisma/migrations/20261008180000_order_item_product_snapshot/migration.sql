ALTER TABLE "OrderItem"
ADD COLUMN IF NOT EXISTS "productName" TEXT;

UPDATE "OrderItem" AS item
SET "productName" = product."name"
FROM "Product" AS product
WHERE item."productId" = product."id"
  AND item."productName" IS NULL;

UPDATE "OrderItem"
SET "productName" = 'Unavailable product'
WHERE "productName" IS NULL;

ALTER TABLE "OrderItem"
ALTER COLUMN "productName" SET NOT NULL;

ALTER TABLE "OrderItem"
ALTER COLUMN "productId" DROP NOT NULL;

ALTER TABLE "OrderItem"
DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";

ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
