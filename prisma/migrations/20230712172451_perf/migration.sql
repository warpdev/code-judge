/*
  Warnings:

  - The primary key for the `Problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `difficulty` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Problem` table. All the data in the column will be lost.
  - The `id` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `problemId` on the `Hint` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `locale` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `problemId` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Hint" DROP CONSTRAINT "Hint_problemId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemId_fkey";

-- AlterTable
ALTER TABLE "Hint" DROP COLUMN "problemId",
ADD COLUMN     "problemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_pkey",
DROP COLUMN "difficulty",
DROP COLUMN "tags",
ADD COLUMN     "locale" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Problem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "problemId",
ADD COLUMN     "problemId" INTEGER NOT NULL,
ADD CONSTRAINT "Submission_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hint" ADD CONSTRAINT "Hint_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
