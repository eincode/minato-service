/*
  Warnings:

  - You are about to drop the column `userId` on the `Tracker` table. All the data in the column will be lost.
  - Added the required column `email` to the `Tracker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tracker" DROP CONSTRAINT "Tracker_userId_fkey";

-- AlterTable
ALTER TABLE "Tracker" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;
