-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."responses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "totalElectricityConsumption" DOUBLE PRECISION,
    "renewableElectricityConsumption" DOUBLE PRECISION,
    "totalFuelConsumption" DOUBLE PRECISION,
    "carbonEmissions" DOUBLE PRECISION,
    "totalEmployees" INTEGER,
    "femaleEmployees" INTEGER,
    "avgTrainingHours" DOUBLE PRECISION,
    "communityInvestmentSpend" DOUBLE PRECISION,
    "independentBoardMembersPercent" DOUBLE PRECISION,
    "hasDataPrivacyPolicy" BOOLEAN,
    "totalRevenue" DOUBLE PRECISION,
    "carbonIntensity" DOUBLE PRECISION,
    "renewableElectricityRatio" DOUBLE PRECISION,
    "diversityRatio" DOUBLE PRECISION,
    "communitySpendRatio" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "responses_userId_year_key" ON "public"."responses"("userId", "year");

-- AddForeignKey
ALTER TABLE "public"."responses" ADD CONSTRAINT "responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
