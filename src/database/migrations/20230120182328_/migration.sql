-- CreateTable
CREATE TABLE "Giveaway" (
    "messageId" TEXT NOT NULL DEFAULT '',
    "channelId" TEXT NOT NULL DEFAULT '',
    "authorId" TEXT NOT NULL DEFAULT '',
    "guildId" TEXT NOT NULL DEFAULT '',
    "requiredRoleId" TEXT,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "endTimestamp" BIGINT NOT NULL DEFAULT 0,
    "winnerAmount" INTEGER NOT NULL DEFAULT 0,
    "participants" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Giveaway_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "Lockdown" (
    "guildId" TEXT NOT NULL DEFAULT '',
    "blockedChannels" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Lockdown_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "UnlockdownTask" (
    "guildId" TEXT NOT NULL DEFAULT '',
    "endTimestamp" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "UnlockdownTask_pkey" PRIMARY KEY ("guildId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Giveaway_messageId_key" ON "Giveaway"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Lockdown_guildId_key" ON "Lockdown"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "UnlockdownTask_guildId_key" ON "UnlockdownTask"("guildId");
