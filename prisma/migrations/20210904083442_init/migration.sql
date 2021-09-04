-- DropForeignKey
ALTER TABLE "_buyingCategories" DROP CONSTRAINT "_buyingCategories_B_fkey";

-- AddForeignKey
ALTER TABLE "_buyingCategories" ADD FOREIGN KEY ("B") REFERENCES "IndustrySubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
