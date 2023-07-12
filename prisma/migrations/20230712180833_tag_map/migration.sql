/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `problemId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_problemId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "createdAt",
DROP COLUMN "problemId";

-- CreateTable
CREATE TABLE "TagMap" (
    "id" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,

    CONSTRAINT "TagMap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TagMap" ADD CONSTRAINT "TagMap_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagMap" ADD CONSTRAINT "TagMap_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
