/*
  Warnings:

  - The `endYear` column on the `pcuser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deactivatedAt` column on the `pcuser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "pcuser" DROP COLUMN "endYear",
ADD COLUMN     "endYear" TIMESTAMP(3),
DROP COLUMN "deactivatedAt",
ADD COLUMN     "deactivatedAt" TIMESTAMP(3);
