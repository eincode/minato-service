/*
  Warnings:

  - Added the required column `name` to the `PersonInCharge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonInCharge" ADD COLUMN     "name" TEXT NOT NULL;
