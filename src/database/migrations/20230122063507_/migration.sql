/*
  Warnings:

  - You are about to drop the `Giveaway` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lockdown` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnlockdownTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Giveaway";

-- DropTable
DROP TABLE "Lockdown";

-- DropTable
DROP TABLE "UnlockdownTask";

-- CreateTable
CREATE TABLE "UserData" (
    "userId" TEXT NOT NULL DEFAULT '',
    "blacklist" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("userId")
);
