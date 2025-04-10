-- CreateTable
CREATE TABLE "_PostMainCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PostMainCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PostMainCategories_B_index" ON "_PostMainCategories"("B");

-- AddForeignKey
ALTER TABLE "_PostMainCategories" ADD CONSTRAINT "_PostMainCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostMainCategories" ADD CONSTRAINT "_PostMainCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
