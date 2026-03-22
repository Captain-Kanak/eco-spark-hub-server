/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `votes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "votes_isDeleted_idx";

-- AlterTable
ALTER TABLE "votes" DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted";
