-- Phase 1: Consultant.email と検索用配列フィールドの追加

-- 1. email フィールドを追加（nullable、unique制約付き）
-- 既存データはnullのまま（認証導入時に必須化予定）
ALTER TABLE "Consultant" ADD COLUMN "email" TEXT;

-- 2. specialtyIndustries 配列フィールドを追加（検索用）
ALTER TABLE "Consultant" ADD COLUMN "specialtyIndustries" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 3. specialtyJobFunctions 配列フィールドを追加（検索用）
ALTER TABLE "Consultant" ADD COLUMN "specialtyJobFunctions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 4. unique制約を追加（既存データがnullのため安全）
CREATE UNIQUE INDEX "Consultant_email_key" ON "Consultant"("email") WHERE "email" IS NOT NULL;

-- 5. 検索頻度が高いフィールドにインデックスを追加
CREATE INDEX "Consultant_specialtyIndustries_idx" ON "Consultant" USING GIN ("specialtyIndustries");
CREATE INDEX "Consultant_specialtyJobFunctions_idx" ON "Consultant" USING GIN ("specialtyJobFunctions");
CREATE INDEX "Consultant_ageRange_idx" ON "Consultant"("ageRange");
CREATE INDEX "Consultant_previousIndustry_idx" ON "Consultant"("previousIndustry");
