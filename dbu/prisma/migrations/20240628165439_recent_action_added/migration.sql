-- CreateTable
CREATE TABLE "recent" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_pkey" PRIMARY KEY ("id")
);
