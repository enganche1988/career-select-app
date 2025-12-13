'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateConsultantProfile(formData: FormData) {
  const consultantId = formData.get('consultantId') as string;
  const name = String(formData.get('name'));
  const email = formData.get('email') ? String(formData.get('email')) : null;
  const headline = formData.get('headline') ? String(formData.get('headline')) : null;
  const thumbnailUrl = formData.get('thumbnailUrl') ? String(formData.get('thumbnailUrl')) : null;
  const twitterUrl = formData.get('twitterUrl') ? String(formData.get('twitterUrl')) : null;
  const linkedinUrl = formData.get('linkedinUrl') ? String(formData.get('linkedinUrl')) : null;
  const schedulerUrl = formData.get('schedulerUrl') ? String(formData.get('schedulerUrl')) : null;
  const profileSummary = formData.get('profileSummary') ? String(formData.get('profileSummary')) : null;
  const achievementsSummary = formData.get('achievementsSummary')
    ? String(formData.get('achievementsSummary'))
    : null;

  // チェックボックスから配列を取得（既存フィールド）
  const expertiseRoles = formData.getAll('expertiseRoles').map(String);
  const expertiseCompanyTypes = formData.getAll('expertiseCompanyTypes').map(String);
  
  // 検索用配列フィールド（新規）
  const specialtyIndustries = formData.getAll('specialtyIndustries').map(String);
  const specialtyJobFunctions = formData.getAll('specialtyJobFunctions').map(String);

  // 検索軸プロフィール
  const ageRange = formData.get('ageRange') ? String(formData.get('ageRange')) : null;
  const education = formData.get('education') ? String(formData.get('education')) : null;
  const previousIndustry = formData.get('previousIndustry') ? String(formData.get('previousIndustry')) : null;
  const previousJobFunction = formData.get('previousJobFunction') ? String(formData.get('previousJobFunction')) : null;
  const previousCompaniesStr = formData.get('previousCompanies') ? String(formData.get('previousCompanies')) : '';
  const previousCompanies = previousCompaniesStr
    ? previousCompaniesStr.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];

  // 自己申告実績
  const selfReportedCareerYears = formData.get('selfReportedCareerYears')
    ? parseInt(String(formData.get('selfReportedCareerYears')), 10)
    : null;
  const selfReportedTotalSupports = formData.get('selfReportedTotalSupports')
    ? parseInt(String(formData.get('selfReportedTotalSupports')), 10)
    : null;
  const selfReportedTotalPlacements = formData.get('selfReportedTotalPlacements')
    ? parseInt(String(formData.get('selfReportedTotalPlacements')), 10)
    : null;
  const selfReportedAverageAnnualIncome = formData.get('selfReportedAverageAnnualIncome')
    ? parseInt(String(formData.get('selfReportedAverageAnnualIncome')), 10)
    : null;

  // 後方互換性のため、experienceYearsとtotalSupportCountも更新
  const updateData: any = {
    name,
    email: email || undefined,
    headline,
    thumbnailUrl,
    twitterUrl,
    linkedinUrl,
    schedulerUrl,
    profileSummary,
    achievementsSummary,
    expertiseRoles: expertiseRoles.length > 0 ? expertiseRoles : undefined,
    expertiseCompanyTypes: expertiseCompanyTypes.length > 0 ? expertiseCompanyTypes : undefined,
    // 検索用配列フィールド（新規、検索頻度が高いため配列型で実装）
    specialtyIndustries: specialtyIndustries.length > 0 ? specialtyIndustries : [],
    specialtyJobFunctions: specialtyJobFunctions.length > 0 ? specialtyJobFunctions : [],
    // 検索軸プロフィール（後方互換性のため、Consultantモデルに直接保存）
    ageRange: ageRange || undefined,
    education: education || undefined,
    previousIndustry: previousIndustry || undefined,
    previousJobFunction: previousJobFunction || undefined,
    previousCompanies: previousCompanies.length > 0 ? previousCompanies : undefined,
    // 自己申告実績（後方互換性のため、Consultantモデルに直接保存）
    selfReportedCareerYears: selfReportedCareerYears || undefined,
    selfReportedTotalSupports: selfReportedTotalSupports || undefined,
    selfReportedTotalPlacements: selfReportedTotalPlacements || undefined,
    selfReportedAverageAnnualIncome: selfReportedAverageAnnualIncome || undefined,
    // 既存フィールドとの互換性
    experienceYears: selfReportedCareerYears || undefined,
    totalSupportCount: selfReportedTotalSupports || undefined,
  };

  await prisma.consultant.update({
    where: { id: consultantId },
    data: updateData,
  });

  revalidatePath('/dashboard/profile');
  revalidatePath(`/consultants/${consultantId}`);
  
  redirect(`/dashboard/profile?consultantId=${consultantId}&saved=1`);
}
