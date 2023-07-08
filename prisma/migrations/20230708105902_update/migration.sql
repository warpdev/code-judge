/*
  Warnings:

  - You are about to drop the column `input` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `inputFormat` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputFormat` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "input",
DROP COLUMN "output",
ADD COLUMN     "inputFormat" JSONB NOT NULL,
ADD COLUMN     "outputFormat" JSONB NOT NULL,
ADD COLUMN     "testSetSize" INTEGER NOT NULL DEFAULT 0;
