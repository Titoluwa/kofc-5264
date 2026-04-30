-- AlterTable
ALTER TABLE `Event` ADD COLUMN `flyer` VARCHAR(191) NULL,
    ADD COLUMN `volunteerShifts` TEXT NULL;

-- AlterTable
ALTER TABLE `EventSignup` ADD COLUMN `shift` TEXT NULL;
