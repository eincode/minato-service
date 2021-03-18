/*
  Warnings:

  - The migration will change the primary key for the `Company` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `PersonInCharge` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `PersonInCharge` table. All the data in the column will be lost.
  - The migration will change the primary key for the `User` table. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropForeignKey
ALTER TABLE "PersonInCharge" DROP CONSTRAINT "PersonInCharge_companyId_fkey";

-- DropForeignKey
ALTER TABLE "PersonInCharge" DROP CONSTRAINT "PersonInCharge_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_companyId_fkey";

-- DropForeignKey
ALTER TABLE "SavedCompany" DROP CONSTRAINT "SavedCompany_personInChargeId_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToSavedCompany" DROP CONSTRAINT "_CompanyToSavedCompany_A_fkey";

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Company_id_seq";

-- AlterTable
ALTER TABLE "PersonInCharge" DROP CONSTRAINT "PersonInCharge_pkey",
DROP COLUMN "name",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "companyId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "PersonInCharge_id_seq";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "companyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SavedCompany" ALTER COLUMN "personInChargeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "_CompanyToSavedCompany" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Company" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonInCharge" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonInCharge" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCompany" ADD FOREIGN KEY ("personInChargeId") REFERENCES "PersonInCharge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSavedCompany" ADD FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
