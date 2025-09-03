/*
  Warnings:

  - You are about to drop the column `avgTrainingHours` on the `responses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."responses" DROP COLUMN "avgTrainingHours",
ADD COLUMN     "averageTrainingHours" DOUBLE PRECISION,
ADD COLUMN     "boardIndependence" DOUBLE PRECISION,
ADD COLUMN     "employeeTurnoverRate" DOUBLE PRECISION,
ADD COLUMN     "energyUsage" DOUBLE PRECISION,
ADD COLUMN     "executiveCompensationRatio" DOUBLE PRECISION,
ADD COLUMN     "femaleRepresentation" DOUBLE PRECISION,
ADD COLUMN     "minorityRepresentation" DOUBLE PRECISION,
ADD COLUMN     "wasteGenerated" DOUBLE PRECISION,
ADD COLUMN     "waterConsumption" DOUBLE PRECISION,
ADD COLUMN     "workplaceAccidents" INTEGER;
