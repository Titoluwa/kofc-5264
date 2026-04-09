-- AlterTable
ALTER TABLE `Event` MODIFY `date` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Newsletter` ADD COLUMN `file` TEXT NULL,
    MODIFY `content` TEXT NULL;
