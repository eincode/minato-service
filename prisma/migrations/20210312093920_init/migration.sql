/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[userId]` on the table `PersonInCharge`. If there are existing duplicate values, the migration will fail.
  - Added the required column `userId` to the `PersonInCharge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonInCharge" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PersonInCharge_userId_unique" ON "PersonInCharge"("userId");

-- AddForeignKey
ALTER TABLE "PersonInCharge" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
