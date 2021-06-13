/*
  Warnings:

  - Added the required column `img` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `PersonInCharge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "img" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PersonInCharge" ADD COLUMN     "img" TEXT NOT NULL;
