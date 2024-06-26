/*
  Warnings:

  - The `endYear` column on the `pcuser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "pcuser" ADD COLUMN     "status" TEXT,
DROP COLUMN "endYear",
ADD COLUMN     "endYear" INTEGER;
