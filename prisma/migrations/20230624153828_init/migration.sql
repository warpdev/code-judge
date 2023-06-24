/*
  Warnings:

  - The primary key for the `Problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pid` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `pid` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `sid` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `Submission` table. All the data in the column will be lost.
  - The required column `id` was added to the `Problem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `problemId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionToken` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_pkey",
DROP COLUMN "pid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Problem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "pid",
DROP COLUMN "sid",
DROP COLUMN "uid",
ADD COLUMN     "problemId" TEXT NOT NULL,
ADD COLUMN     "submissionToken" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;
