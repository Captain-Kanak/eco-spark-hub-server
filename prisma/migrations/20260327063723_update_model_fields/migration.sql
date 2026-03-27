/*
  Warnings:

  - You are about to drop the column `feedback` on the `ideas` table. All the data in the column will be lost.
  - Added the required column `problemStatement` to the `ideas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solution` to the `ideas` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `ideas` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DEACTIVE');

-- AlterTable
ALTER TABLE "ideas" DROP COLUMN "feedback",
ADD COLUMN     "adminFeedback" TEXT,
ADD COLUMN     "problemStatement" TEXT NOT NULL,
ADD COLUMN     "solution" TEXT NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
