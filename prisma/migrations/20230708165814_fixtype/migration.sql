/*
  Warnings:

  - You are about to drop the column `submissionToken` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "submissionToken",
ADD COLUMN     "submissionTokens" TEXT[];
