-- CreateTable
CREATE TABLE "IndustryCategory" (
    "id" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "jp" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustrySubCategory" (
    "id" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "jp" TEXT NOT NULL,
    "parentCategoryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IndustrySubCategory" ADD FOREIGN KEY ("parentCategoryId") REFERENCES "IndustryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
