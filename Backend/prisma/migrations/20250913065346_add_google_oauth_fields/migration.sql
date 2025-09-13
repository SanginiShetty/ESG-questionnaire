/*
  Warnings:

  - You are about to drop the column `boardIndependence` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `employeeTurnoverRate` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `energyUsage` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `executiveCompensationRatio` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `femaleRepresentation` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `minorityRepresentation` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `wasteGenerated` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `waterConsumption` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `workplaceAccidents` on the `responses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."responses" DROP COLUMN "boardIndependence",
DROP COLUMN "employeeTurnoverRate",
DROP COLUMN "energyUsage",
DROP COLUMN "executiveCompensationRatio",
DROP COLUMN "femaleRepresentation",
DROP COLUMN "minorityRepresentation",
DROP COLUMN "wasteGenerated",
DROP COLUMN "waterConsumption",
DROP COLUMN "workplaceAccidents";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "public"."users"("googleId");
