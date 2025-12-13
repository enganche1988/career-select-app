-- AlterTable
ALTER TABLE "Consultant" ADD COLUMN     "ageRange" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "previousCompanies" JSONB,
ADD COLUMN     "previousIndustry" TEXT,
ADD COLUMN     "previousJobFunction" TEXT,
ADD COLUMN     "selfReportedAverageAnnualIncome" INTEGER,
ADD COLUMN     "selfReportedCareerYears" INTEGER,
ADD COLUMN     "selfReportedTotalPlacements" INTEGER,
ADD COLUMN     "selfReportedTotalSupports" INTEGER;
