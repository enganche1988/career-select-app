'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';

export async function updateConsultantProfile(formData: FormData) {
  const consultantId = formData.get('consultantId') as string;
  const name = String(formData.get('name'));
  const email = formData.get('email') ? String(formData.get('email')) : null;
  const headline = formData.get('headline') ? String(formData.get('headline')) : null;
  
  // ファイルアップロード処理
  let thumbnailUrl = formData.get('thumbnailUrl') ? String(formData.get('thumbnailUrl')) : null;
  const thumbnailFile = formData.get('thumbnailFile') as File | null;
  
  if (thumbnailFile && thumbnailFile.size > 0) {
    try {
      // ファイルサイズチェック（5MB制限）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (thumbnailFile.size > maxSize) {
        throw new Error('ファイルサイズは5MB以下にしてください');
      }

      // ファイルタイプチェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(thumbnailFile.type)) {
        throw new Error('画像ファイル（JPEG、PNG、WebP、GIF）のみアップロードできます');
      }

      // Vercel Blob Storageにアップロード
      const blob = await put(`consultants/${consultantId}-${Date.now()}-${thumbnailFile.name}`, thumbnailFile, {
        access: 'public',
        contentType: thumbnailFile.type,
      });
      
      thumbnailUrl = blob.url;
    } catch (error) {
      console.error('ファイルアップロードエラー:', error);
      // エラーが発生した場合は既存のURLを保持
      // またはエラーメッセージを返す（今回は既存URLを保持）
    }
  }
  const twitterUrl = formData.get('twitterUrl') ? String(formData.get('twitterUrl')) : null;
  const linkedinUrl = formData.get('linkedinUrl') ? String(formData.get('linkedinUrl')) : null;
  const schedulerUrl = formData.get('schedulerUrl') ? String(formData.get('schedulerUrl')) : null;
  
  // オンライン対応可（トグル）
  // 注意: オンライン対応可の判定はschedulerUrlまたはtimelexUrlの存在で行う
  // トグルは表示用のみ（実際の判定はschedulerUrlの有無で行う）
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

  // オンライン対応可（トグル）
  const onlineAvailable = formData.get('onlineAvailable') === 'on';
  // オンライン対応可の場合、schedulerUrlが必須ではないが、設定されている場合は保持
  // schedulerUrlが空でonlineAvailableがtrueの場合、既存のURLを保持

  // 自己申告実績（数値系は空＝非公開、0は表示しない）
  const selfReportedCareerYearsStr = formData.get('selfReportedCareerYears') ? String(formData.get('selfReportedCareerYears')) : '';
  const selfReportedCareerYears = selfReportedCareerYearsStr && selfReportedCareerYearsStr !== '0'
    ? parseInt(selfReportedCareerYearsStr, 10)
    : null;
  
  const selfReportedTotalSupportsStr = formData.get('selfReportedTotalSupports') ? String(formData.get('selfReportedTotalSupports')) : '';
  const selfReportedTotalSupports = selfReportedTotalSupportsStr && selfReportedTotalSupportsStr !== '0'
    ? parseInt(selfReportedTotalSupportsStr, 10)
    : null;
  
  const selfReportedTotalPlacementsStr = formData.get('selfReportedTotalPlacements') ? String(formData.get('selfReportedTotalPlacements')) : '';
  const selfReportedTotalPlacements = selfReportedTotalPlacementsStr && selfReportedTotalPlacementsStr !== '0'
    ? parseInt(selfReportedTotalPlacementsStr, 10)
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
    // 数値系は空＝非公開（0は表示しない）
    selfReportedCareerYears: selfReportedCareerYears || undefined,
    selfReportedTotalSupports: selfReportedTotalSupports || undefined,
    selfReportedTotalPlacements: selfReportedTotalPlacements || undefined,
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
