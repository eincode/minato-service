/*
  Warnings:

  - You are about to drop the column `buyingCategories` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `productCategories` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfIndustry` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - Added the required column `industryCategoryId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industrySubCategoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "buyingCategories",
DROP COLUMN "productCategories",
DROP COLUMN "typeOfIndustry",
ADD COLUMN     "industryCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "industrySubCategoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_productCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_buyingCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_productCategories_AB_unique" ON "_productCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_productCategories_B_index" ON "_productCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_buyingCategories_AB_unique" ON "_buyingCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_buyingCategories_B_index" ON "_buyingCategories"("B");

-- AddForeignKey
ALTER TABLE "Company" ADD FOREIGN KEY ("industryCategoryId") REFERENCES "IndustryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("industrySubCategoryId") REFERENCES "IndustrySubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_productCategories" ADD FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_productCategories" ADD FOREIGN KEY ("B") REFERENCES "IndustrySubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_buyingCategories" ADD FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_buyingCategories" ADD FOREIGN KEY ("B") REFERENCES "IndustryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
