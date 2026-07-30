/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `comment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "comment_isDeleted_idx";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "isDeleted";
