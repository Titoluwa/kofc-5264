-- AlterTable
ALTER TABLE `Event` ADD COLUMN `allowRegistration` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `allowVolunteer` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `notificationEmail` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `EventSignup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `type` ENUM('REGISTRATION', 'VOLUNTEER') NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventSignup_eventId_idx`(`eventId`),
    INDEX `EventSignup_email_idx`(`email`),
    INDEX `EventSignup_type_idx`(`type`),
    UNIQUE INDEX `EventSignup_eventId_email_type_key`(`eventId`, `email`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventSignup` ADD CONSTRAINT `EventSignup_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
