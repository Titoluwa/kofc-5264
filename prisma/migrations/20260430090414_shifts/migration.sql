-- AlterTable
ALTER TABLE `Event` ADD COLUMN `volunteersShifts` JSON NULL;

-- AlterTable
ALTER TABLE `EventSignup` ADD COLUMN `shifts` JSON NULL;
