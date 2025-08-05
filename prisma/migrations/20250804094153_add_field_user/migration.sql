/*
  Warnings:

  - You are about to drop the column `amount` on the `PeakRate` table. All the data in the column will be lost.
  - Added the required column `price` to the `PeakRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `long` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lot` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "PeakRate" DROP COLUMN "amount",
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "long" TEXT NOT NULL,
ADD COLUMN     "lot" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "mobile_number" TEXT,
ADD COLUMN     "residence" TEXT;
