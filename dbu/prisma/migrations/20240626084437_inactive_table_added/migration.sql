-- CreateTable
CREATE TABLE "inactive" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gender" TEXT,
    "phonenumber" TEXT,
    "image" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "serialnumber" TEXT,
    "endYear" TIMESTAMP(3),
    "status" TEXT,
    "pcowner" TEXT,
    "barcode" TEXT,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3) NOT NULL,
    "deactivatedAt" TIMESTAMP(3),

    CONSTRAINT "inactive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inactive_userId_key" ON "inactive"("userId");
