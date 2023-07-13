/*
  Warnings:

  - You are about to drop the column `submissionTokens` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "submissionTokens";

-- CreateTable
CREATE TABLE "JudgeToken" (
    "token" TEXT NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "JudgeToken_pkey" PRIMARY KEY ("token")
);

-- AddForeignKey
ALTER TABLE "JudgeToken" ADD CONSTRAINT "JudgeToken_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
