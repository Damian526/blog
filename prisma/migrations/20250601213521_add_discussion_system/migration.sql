-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('ARTICLE', 'TUTORIAL');

-- CreateEnum
CREATE TYPE "DiscussionType" AS ENUM ('QUESTION', 'DISCUSSION', 'HELP');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "discussionId" INTEGER,
ALTER COLUMN "postId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'ARTICLE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isExpert" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Discussion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "DiscussionType" NOT NULL DEFAULT 'DISCUSSION',
    "authorId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
