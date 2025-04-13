/*
  Warnings:

  - A unique constraint covering the columns `[name,categoryId]` on the table `Subcategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subcategory_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_name_categoryId_key" ON "Subcategory"("name", "categoryId");
