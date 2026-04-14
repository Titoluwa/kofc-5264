/*
  Warnings:

  - A unique constraint covering the columns `[volunteersToken]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Event` ADD COLUMN `volunteersToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Event_volunteersToken_key` ON `Event`(`volunteersToken`);
