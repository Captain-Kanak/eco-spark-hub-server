/*
  Warnings:

  - You are about to alter the column `originalAmount` on the `donation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `exchangeRate` on the `donation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `baseAmount` on the `donation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `estimatedBudget` on the `idea` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `fundingGoal` on the `idea` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `currentFunding` on the `idea` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "donation" ALTER COLUMN "originalAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "exchangeRate" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "baseAmount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "idea" ALTER COLUMN "estimatedBudget" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "fundingGoal" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "currentFunding" SET DATA TYPE DECIMAL(10,2);
