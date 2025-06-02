-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" INTEGER,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "verificationReason" TEXT;
