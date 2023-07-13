/*
  Warnings:

  - The primary key for the `JudgeToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `token` on the `JudgeToken` table. All the data in the column will be lost.
  - Added the required column `id` to the `JudgeToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JudgeToken" DROP CONSTRAINT "JudgeToken_pkey",
DROP COLUMN "token",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "JudgeToken_pkey" PRIMARY KEY ("id");
