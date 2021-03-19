/*
  Warnings:

  - You are about to drop the column `img` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "img";

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "productId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductImage" ADD FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
