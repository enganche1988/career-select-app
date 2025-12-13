/**
 * CareerSelect - Consultant型定義
 * 
 * 検索軸プロフィールと自己申告実績の型安全性を向上させるための型定義
 * Json型から適切な型への変換を提供
 */

// ============================================
// 検索軸プロフィール - 年代
// ============================================
export type AgeRange = 
  | '20s_early'  // 20代前半
  | '20s_late'   // 20代後半
  | '30s_early'  // 30代前半
  | '30s_late'   // 30代後半
  | '40s_plus';  // 40代以上

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  '20s_early': '20代前半',
  '20s_late': '20代後半',
  '30s_early': '30代前半',
  '30s_late': '30代後半',
  '40s_plus': '40代以上',
};

// ============================================
// 検索軸プロフィール - 学歴
// ============================================
export type Education = 
  | 'high_school'  // 高校卒業
  | 'vocational'   // 専門学校卒業
  | 'university'   // 大学卒業
  | 'graduate';    // 大学院卒業

export const EDUCATION_LABELS: Record<Education, string> = {
  'high_school': '高校卒業',
  'vocational': '専門学校卒業',
  'university': '大学卒業',
  'graduate': '大学院卒業',
};

// ============================================
// 検索軸プロフィール - 業界
// ============================================
export type Industry = 
  | 'it_internet'      // IT・インターネット
  | 'saas_startup'     // SaaS / スタートアップ
  | 'mega_venture'     // メガベンチャー
  | 'manufacturing'    // 製造業
  | 'finance'          // 金融
  | 'consulting'        // コンサルティング
  | 'retail'            // 小売・流通
  | 'other';            // その他

export const INDUSTRY_LABELS: Record<Industry, string> = {
  'it_internet': 'IT・インターネット',
  'saas_startup': 'SaaS / スタートアップ',
  'mega_venture': 'メガベンチャー',
  'manufacturing': '製造業',
  'finance': '金融',
  'consulting': 'コンサルティング',
  'retail': '小売・流通',
  'other': 'その他',
};

// ============================================
// 検索軸プロフィール - 職種
// ============================================
export type JobFunction = 
  | 'engineer'    // エンジニア
  | 'pdm_pm'      // PM / PdM
  | 'designer'    // デザイナー
  | 'sales'       // 営業
  | 'marketing'   // マーケティング
  | 'hr'          // 人事
  | 'finance'     // 経理・財務
  | 'consultant'  // コンサルタント
  | 'other';      // その他

export const JOB_FUNCTION_LABELS: Record<JobFunction, string> = {
  'engineer': 'エンジニア',
  'pdm_pm': 'PM / PdM',
  'designer': 'デザイナー',
  'sales': '営業',
  'marketing': 'マーケティング',
  'hr': '人事',
  'finance': '経理・財務',
  'consultant': 'コンサルタント',
  'other': 'その他',
};

// ============================================
// 企業タイプ（既存のexpertiseCompanyTypes用）
// ============================================
export type CompanyType = 
  | '大企業'
  | 'メガベンチャー'
  | 'スタートアップ'
  | '外資系'
  | '上場準備企業';

// ============================================
// 得意職種（既存のexpertiseRoles用）
// ============================================
export type ExpertiseRole = 
  | 'エンジニア'
  | 'PdM/PM'
  | 'デザイナー'
  | 'コーポレート（人事・総務・経理）'
  | '営業'
  | 'マーケティング'
  | 'カスタマーサクセス';

// ============================================
// 型変換ヘルパー関数
// ============================================

/**
 * Json型の配列を文字列配列に安全に変換
 */
export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(v => String(v)).filter(v => v.length > 0);
  }
  return [];
}

/**
 * Json型の配列をIndustry型の配列に変換
 */
export function parseIndustries(value: unknown): Industry[] {
  const arr = parseStringArray(value);
  return arr.filter((v): v is Industry => v in INDUSTRY_LABELS);
}

/**
 * Json型の配列をJobFunction型の配列に変換
 */
export function parseJobFunctions(value: unknown): JobFunction[] {
  const arr = parseStringArray(value);
  return arr.filter((v): v is JobFunction => v in JOB_FUNCTION_LABELS);
}

/**
 * AgeRange型に安全に変換
 */
export function parseAgeRange(value: unknown): AgeRange | null {
  if (typeof value === 'string' && value in AGE_RANGE_LABELS) {
    return value as AgeRange;
  }
  return null;
}

/**
 * Education型に安全に変換
 */
export function parseEducation(value: unknown): Education | null {
  if (typeof value === 'string' && value in EDUCATION_LABELS) {
    return value as Education;
  }
  return null;
}

