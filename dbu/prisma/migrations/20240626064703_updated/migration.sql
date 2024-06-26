/*
  Warnings:

  - The `deactivatedAt` column on the `pcuser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "pcuser" DROP COLUMN "deactivatedAt",
ADD COLUMN     "deactivatedAt" INTEGER;
