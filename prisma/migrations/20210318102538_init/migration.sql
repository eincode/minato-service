/*
  Warnings:

  - The migration will change the primary key for the `Product` table. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";
