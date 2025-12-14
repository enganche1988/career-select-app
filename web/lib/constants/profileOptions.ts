/**
 * 検索軸プロフィールの選択肢定数
 * 表記ゆれを防ぎ、管理画面と公開画面で統一する
 */

// ============================================
// 年代
// ============================================
export const AGE_RANGES = [
  { value: '20s_early', label: '20代前半' },
  { value: '20s_late', label: '20代後半' },
  { value: '30s_early', label: '30代前半' },
  { value: '30s_late', label: '30代後半' },
  { value: '40s_plus', label: '40代以上' },
] as const;

export type AgeRange = typeof AGE_RANGES[number]['value'];

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  '20s_early': '20代前半',
  '20s_late': '20代後半',
  '30s_early': '30代前半',
  '30s_late': '30代後半',
  '40s_plus': '40代以上',
};

// ============================================
// 学歴カテゴリ（検索用、必須）
// 詳細ページのファーストビューで表示される具体的なカテゴリ
// ============================================
export const EDUCATION_CATEGORIES = [
  { value: 'high_school', label: '高校卒業', displayLabel: '高校卒業' },
  { value: 'vocational', label: '専門学校卒業', displayLabel: '専門学校卒業' },
  { value: 'waseda_keio', label: '早慶', displayLabel: '早慶' },
  { value: 'kyudai', label: '旧帝大', displayLabel: '旧帝大' },
  { value: 'march', label: 'MARCH', displayLabel: 'MARCH' },
  { value: 'kankandoritsu', label: '関関同立', displayLabel: '関関同立' },
  { value: 'university', label: '大学卒業（その他）', displayLabel: '' }, // ファーストビューでは表示しない
  { value: 'graduate', label: '大学院卒業（その他）', displayLabel: '' }, // ファーストビューでは表示しない
] as const;

export type EducationCategory = typeof EDUCATION_CATEGORIES[number]['value'];

export const EDUCATION_CATEGORY_LABELS: Record<EducationCategory, string> = {
  'high_school': '高校卒業',
  'vocational': '専門学校卒業',
  'waseda_keio': '早慶',
  'kyudai': '旧帝大',
  'march': 'MARCH',
  'kankandoritsu': '関関同立',
  'university': '大学卒業',
  'graduate': '大学院卒業',
};

/**
 * 学歴カテゴリの表示ラベルを取得（ファーストビュー用）
 * 抽象的な「大学卒業」「大学院卒業」は表示せず、具体的なカテゴリ（早慶、旧帝大など）のみ表示
 */
export function getEducationCategoryDisplayLabel(value: string | null | undefined): string {
  if (!value) return '';
  // 抽象的なカテゴリ（university, graduate）は表示しない
  if (value === 'university' || value === 'graduate') return '';
  const category = EDUCATION_CATEGORIES.find(c => c.value === value);
  return category?.displayLabel || EDUCATION_CATEGORY_LABELS[value as EducationCategory] || '';
}

// ============================================
// 業界（前職業界）
// ============================================
export const INDUSTRIES = [
  { value: 'it_internet', label: 'IT・インターネット' },
  { value: 'saas', label: 'SaaS' },
  { value: 'manufacturing', label: '製造業' },
  { value: 'finance', label: '金融' },
  { value: 'consulting', label: 'コンサルティング' },
  { value: 'retail', label: '小売・流通' },
  { value: 'hr_consulting', label: '人材・コンサル' },
  { value: 'advertising_media', label: '広告・メディア' },
  { value: 'other_service', label: 'その他サービス' },
  { value: 'other', label: 'その他' },
] as const;

export type Industry = typeof INDUSTRIES[number]['value'];

export const INDUSTRY_LABELS: Record<Industry, string> = {
  'it_internet': 'IT・インターネット',
  'saas': 'SaaS',
  'manufacturing': '製造業',
  'finance': '金融',
  'consulting': 'コンサルティング',
  'retail': '小売・流通',
  'hr_consulting': '人材・コンサル',
  'advertising_media': '広告・メディア',
  'other_service': 'その他サービス',
  'other': 'その他',
};

// ============================================
// 得意企業タイプ（Company Type）
// ============================================
export const COMPANY_TYPES = [
  { value: 'large', label: '大企業' },
  { value: 'mega_venture', label: 'メガベンチャー' },
  { value: 'startup', label: 'スタートアップ' },
  { value: 'foreign', label: '外資系企業' },
  { value: 'sme', label: '中小企業' },
  { value: 'other', label: 'その他（自由入力）' },
] as const;

export type CompanyType = typeof COMPANY_TYPES[number]['value'];

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  'large': '大企業',
  'mega_venture': 'メガベンチャー',
  'startup': 'スタートアップ',
  'foreign': '外資系企業',
  'sme': '中小企業',
  'other': 'その他',
};

// ============================================
// 得意業界（Specialty Industries）
// 事業内容ベースの分類
// ============================================
export const SPECIALTY_INDUSTRIES = [
  { value: 'it_internet', label: 'IT・インターネット' },
  { value: 'saas', label: 'SaaS' },
  { value: 'manufacturing', label: '製造業' },
  { value: 'finance', label: '金融' },
  { value: 'consulting', label: 'コンサルティング' },
  { value: 'retail', label: '小売・流通' },
  { value: 'hr_consulting', label: '人材・コンサル' },
  { value: 'advertising_media', label: '広告・メディア' },
  { value: 'other_service', label: 'その他サービス' },
  { value: 'other', label: 'その他（自由入力）' },
] as const;

export type SpecialtyIndustry = typeof SPECIALTY_INDUSTRIES[number]['value'];

export const SPECIALTY_INDUSTRY_LABELS: Record<SpecialtyIndustry, string> = {
  'it_internet': 'IT・インターネット',
  'saas': 'SaaS',
  'manufacturing': '製造業',
  'finance': '金融',
  'consulting': 'コンサルティング',
  'retail': '小売・流通',
  'hr_consulting': '人材・コンサル',
  'advertising_media': '広告・メディア',
  'other_service': 'その他サービス',
  'other': 'その他',
};

// ============================================
// 職種（前職職種）
// ============================================
export const JOB_FUNCTIONS = [
  { value: 'engineer', label: 'エンジニア' },
  { value: 'pdm_pm', label: 'PM / PdM' },
  { value: 'designer', label: 'デザイナー' },
  { value: 'sales', label: '営業' },
  { value: 'marketing', label: 'マーケティング' },
  { value: 'hr', label: '人事' },
  { value: 'finance', label: '経理・財務' },
  { value: 'consultant', label: 'コンサルタント' },
  { value: 'other', label: 'その他' },
] as const;

export type JobFunction = typeof JOB_FUNCTIONS[number]['value'];

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
// 得意領域タグ（検索用・後方互換性のため残す）
// ============================================
export const EXPERTISE_TAGS = [
  { value: 'engineer', label: 'エンジニア' },
  { value: 'pdm_pm', label: 'PM / PdM' },
  { value: 'designer', label: 'デザイナー' },
  { value: 'sales', label: '営業' },
  { value: 'marketing', label: 'マーケティング' },
  { value: 'hr', label: '人事' },
  { value: 'finance', label: '経理・財務' },
  { value: 'consultant', label: 'コンサルタント' },
] as const;

export type ExpertiseTag = typeof EXPERTISE_TAGS[number]['value'];

export const EXPERTISE_TAG_LABELS: Record<ExpertiseTag, string> = {
  'engineer': 'エンジニア',
  'pdm_pm': 'PM / PdM',
  'designer': 'デザイナー',
  'sales': '営業',
  'marketing': 'マーケティング',
  'hr': '人事',
  'finance': '経理・財務',
  'consultant': 'コンサルタント',
};

// ============================================
// 得意職種（Specialty Job Functions）
// 転職検索で使われる粒度に揃える
// ============================================
export const SPECIALTY_JOB_FUNCTIONS = [
  { value: 'engineer', label: 'エンジニア' },
  { value: 'pdm_pm', label: 'PdM / PM' },
  { value: 'designer', label: 'デザイナー' },
  { value: 'sales', label: '営業' },
  { value: 'cs', label: 'カスタマーサクセス' },
  { value: 'hr_recruiting', label: '人事 / 採用' },
  { value: 'accounting_finance', label: '経理・財務' },
  { value: 'consultant', label: 'コンサルタント' },
  { value: 'other', label: 'その他（自由入力）' },
] as const;

export type SpecialtyJobFunction = typeof SPECIALTY_JOB_FUNCTIONS[number]['value'];

export const SPECIALTY_JOB_FUNCTION_LABELS: Record<SpecialtyJobFunction, string> = {
  'engineer': 'エンジニア',
  'pdm_pm': 'PdM / PM',
  'designer': 'デザイナー',
  'sales': '営業',
  'cs': 'カスタマーサクセス',
  'hr_recruiting': '人事 / 採用',
  'accounting_finance': '経理・財務',
  'consultant': 'コンサルタント',
  'other': 'その他',
};

// ============================================
// ヘルパー関数
// ============================================

/**
 * 年代のラベルを取得
 */
export function getAgeRangeLabel(value: string | null | undefined): string {
  if (!value) return '';
  return AGE_RANGE_LABELS[value as AgeRange] || value;
}

/**
 * 学歴カテゴリのラベルを取得
 */
export function getEducationCategoryLabel(value: string | null | undefined): string {
  if (!value) return '';
  return EDUCATION_CATEGORY_LABELS[value as EducationCategory] || value;
}

/**
 * 業界のラベルを取得
 */
export function getIndustryLabel(value: string | null | undefined): string {
  if (!value) return '';
  return INDUSTRY_LABELS[value as Industry] || value;
}

/**
 * 職種のラベルを取得
 */
export function getJobFunctionLabel(value: string | null | undefined): string {
  if (!value) return '';
  return JOB_FUNCTION_LABELS[value as JobFunction] || value;
}

/**
 * 得意領域タグのラベルを取得
 */
export function getExpertiseTagLabel(value: string): string {
  return EXPERTISE_TAG_LABELS[value as ExpertiseTag] || value;
}

/**
 * 企業タイプのラベルを取得
 */
export function getCompanyTypeLabel(value: string | null | undefined): string {
  if (!value) return '';
  return COMPANY_TYPE_LABELS[value as CompanyType] || value;
}

/**
 * 得意業界のラベルを取得
 */
export function getSpecialtyIndustryLabel(value: string | null | undefined): string {
  if (!value) return '';
  return SPECIALTY_INDUSTRY_LABELS[value as SpecialtyIndustry] || value;
}

/**
 * 得意職種のラベルを取得
 */
export function getSpecialtyJobFunctionLabel(value: string | null | undefined): string {
  if (!value) return '';
  return SPECIALTY_JOB_FUNCTION_LABELS[value as SpecialtyJobFunction] || value;
}

