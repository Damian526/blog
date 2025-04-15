/*
  Warnings:

  - You are about to drop the `_PostMainCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PostMainCategories" DROP CONSTRAINT "_PostMainCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostMainCategories" DROP CONSTRAINT "_PostMainCategories_B_fkey";

-- DropTable
DROP TABLE "_PostMainCategories";
