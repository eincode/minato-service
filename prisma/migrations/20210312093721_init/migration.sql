-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UNSPECIFIED', 'BUYER', 'SELLER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'UNSPECIFIED';

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "request" TEXT NOT NULL,
    "img" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonInCharge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "img" TEXT,
    "companyId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCompany" (
    "id" SERIAL NOT NULL,
    "personInChargeId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT,
    "isHalal" BOOLEAN NOT NULL,
    "minimumOrderQuantity" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyToSavedCompany" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_unique" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonInCharge_companyId_unique" ON "PersonInCharge"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToSavedCompany_AB_unique" ON "_CompanyToSavedCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToSavedCompany_B_index" ON "_CompanyToSavedCompany"("B");

-- AddForeignKey
ALTER TABLE "Company" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonInCharge" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCompany" ADD FOREIGN KEY ("personInChargeId") REFERENCES "PersonInCharge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSavedCompany" ADD FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSavedCompany" ADD FOREIGN KEY ("B") REFERENCES "SavedCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;
