/*
  Warnings:

  - You are about to drop the `LectureProblem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LectureProblem" DROP CONSTRAINT "LectureProblem_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "LectureProblem" DROP CONSTRAINT "LectureProblem_problemId_fkey";

-- DropForeignKey
ALTER TABLE "TagMap" DROP CONSTRAINT "TagMap_problemId_fkey";

-- DropForeignKey
ALTER TABLE "TagMap" DROP CONSTRAINT "TagMap_tagId_fkey";

-- DropTable
DROP TABLE "LectureProblem";

-- DropTable
DROP TABLE "TagMap";

-- CreateTable
CREATE TABLE "_ProblemToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LectureToProblem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProblemToTag_AB_unique" ON "_ProblemToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProblemToTag_B_index" ON "_ProblemToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LectureToProblem_AB_unique" ON "_LectureToProblem"("A", "B");

-- CreateIndex
CREATE INDEX "_LectureToProblem_B_index" ON "_LectureToProblem"("B");

-- AddForeignKey
ALTER TABLE "_ProblemToTag" ADD CONSTRAINT "_ProblemToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToTag" ADD CONSTRAINT "_ProblemToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LectureToProblem" ADD CONSTRAINT "_LectureToProblem_A_fkey" FOREIGN KEY ("A") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LectureToProblem" ADD CONSTRAINT "_LectureToProblem_B_fkey" FOREIGN KEY ("B") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
