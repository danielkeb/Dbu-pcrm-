-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT,
    "gender" TEXT,
    "address" TEXT,
    "status" TEXT,
    "password" TEXT NOT NULL,
    "phonenumer" TEXT,
    "token" TEXT
);

-- CreateTable
CREATE TABLE "pcuser" (
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

    CONSTRAINT "pcuser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recent" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Reset" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "shortcode" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pcuser_userId_key" ON "pcuser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pcuser_serialnumber_key" ON "pcuser"("serialnumber");

-- CreateIndex
CREATE UNIQUE INDEX "inactive_userId_key" ON "inactive"("userId");
