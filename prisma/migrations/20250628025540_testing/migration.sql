/*
  Warnings:

  - You are about to drop the column `exerciseTemplateId` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `exerciseTemplateName` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_exerciseTemplateId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "exerciseTemplateId",
ADD COLUMN     "exerciseTemplateName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_exerciseTemplateName_fkey" FOREIGN KEY ("exerciseTemplateName") REFERENCES "ExerciseTemplate"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
