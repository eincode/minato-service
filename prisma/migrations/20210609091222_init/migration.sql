/*
  Warnings:

  - You are about to drop the column `type` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `request` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `PersonInCharge` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `PersonInCharge` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PersonInCharge` table. All the data in the column will be lost.
  - You are about to drop the column `minimumOrderQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `productCategory` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SavedCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompanyToSavedCompany` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `typeOfIndustry` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `PersonInCharge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimalOrder` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavedCompany" DROP CONSTRAINT "SavedCompany_personInChargeId_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToSavedCompany" DROP CONSTRAINT "_CompanyToSavedCompany_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToSavedCompany" DROP CONSTRAINT "_CompanyToSavedCompany_B_fkey";

-- DropForeignKey
ALTER TABLE "PersonInCharge" DROP CONSTRAINT "PersonInCharge_userId_fkey";

-- DropIndex
DROP INDEX "PersonInCharge_userId_unique";

-- DropIndex
DROP INDEX "PersonInCharge_companyId_unique";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "type",
DROP COLUMN "phone",
DROP COLUMN "request",
DROP COLUMN "img",
DROP COLUMN "createdAt",
ADD COLUMN     "typeOfIndustry" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "productCategories" TEXT[];

-- AlterTable
ALTER TABLE "PersonInCharge" DROP COLUMN "phone",
DROP COLUMN "img",
DROP COLUMN "userId",
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "minimumOrderQuantity",
ADD COLUMN     "minimalOrder" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
DROP COLUMN "productCategory";

-- DropTable
DROP TABLE "SavedCompany";

-- DropTable
DROP TABLE "_CompanyToSavedCompany";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "BuyerRequest" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "destinationPort" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "other" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerRequest" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "request" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_savedCompanies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BuyerRequest_companyId_unique" ON "BuyerRequest"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerRequest_companyId_unique" ON "SellerRequest"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "_savedCompanies_AB_unique" ON "_savedCompanies"("A", "B");

-- CreateIndex
CREATE INDEX "_savedCompanies_B_index" ON "_savedCompanies"("B");

-- AddForeignKey
ALTER TABLE "BuyerRequest" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerRequest" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedCompanies" ADD FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedCompanies" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
