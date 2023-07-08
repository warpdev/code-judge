/*
  Warnings:

  - Added the required column `languageId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "languageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Language" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "monacoLanguage" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
