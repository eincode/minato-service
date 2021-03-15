/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[personInChargeId]` on the table `SavedCompany`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SavedCompany.personInChargeId_unique" ON "SavedCompany"("personInChargeId");
