/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `ideas` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "categories_isDeleted_idx" ON "categories"("isDeleted");

-- CreateIndex
CREATE INDEX "comments_isDeleted_idx" ON "comments"("isDeleted");

-- CreateIndex
CREATE INDEX "ideas_isDeleted_idx" ON "ideas"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "ideas_title_key" ON "ideas"("title");

-- CreateIndex
CREATE INDEX "payments_isDeleted_idx" ON "payments"("isDeleted");

-- CreateIndex
CREATE INDEX "users_isDeleted_idx" ON "user"("isDeleted");

-- CreateIndex
CREATE INDEX "votes_isDeleted_idx" ON "votes"("isDeleted");
