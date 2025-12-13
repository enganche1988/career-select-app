import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAgeRangeLabel,
  getEducationCategoryDisplayLabel,
  getIndustryLabel,
  getJobFunctionLabel,
  getExpertiseTagLabel,
  getEducationCategoryLabel,
} from '@/lib/constants/profileOptions';
import { parseStringArray } from '@/lib/types/consultant';
import { getMockConsultant, type ConsultantWithReviews } from '@/lib/mockData';

function formatDateJP(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
}

// レビュアーの属性を表示用テキストに変換
function formatReviewerMeta(meta: any): string {
  if (!meta || typeof meta !== 'object') return '';
  
  const parts: string[] = [];
  
  // 年代
  const ageMap: Record<string, string> = {
    '20s_early': '20代前半',
    '20s_late': '20代後半',
    '30s_early': '30代前半',
    '30s_late': '30代後半',
    '40s_plus': '40代以上',
  };
  if (meta.ageRange && ageMap[meta.ageRange]) {
    parts.push(ageMap[meta.ageRange]);
  }
  
  // 業種
  const industryMap: Record<string, string> = {
    'it_internet': 'IT・インターネット',
    'saas_startup': 'SaaS・スタートアップ',
    'mega_venture': 'メガベンチャー',
    'manufacturing': '製造業',
    'hr_consulting': '人材・コンサル',
    'finance': '金融',
    'advertising_media': '広告・メディア',
    'other_service': 'その他サービス',
  };
  if (meta.industry && industryMap[meta.industry]) {
    parts.push(industryMap[meta.industry]);
  }
  
  // 職種
  const jobMap: Record<string, string> = {
    'engineer': 'エンジニア',
    'designer': 'デザイナー',
    'pdm_pm': 'PdM / PM',
    'sales': '営業',
    'cs': 'カスタマーサクセス',
    'hr_recruiting': '人事 / 採用',
    'accounting_finance': '経理・財務',
    'consultant': 'コンサルタント',
    'other': 'その他',
  };
  if (meta.jobCategory && jobMap[meta.jobCategory]) {
    parts.push(jobMap[meta.jobCategory]);
  }
  
  // 会社規模
  const sizeMap: Record<string, string> = {
    'large': '大企業',
    'mega_venture': 'メガベンチャー',
    'startup': 'スタートアップ',
    'foreign': '外資系企業',
    'sme': '中小企業',
  };
  if (meta.companySize && sizeMap[meta.companySize]) {
    parts.push(sizeMap[meta.companySize]);
  }
  
  return parts.join(' / ');
}

// OGPメタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    
    let consultant;
    try {
      consultant = await prisma.consultant.findUnique({
        where: { id },
        include: {
          reviews: {
            where: { isApproved: true },
          },
        },
      });
    } catch (dbError) {
      return {
        title: 'CareerSelect',
        description: 'キャリアコンサルタントマッチングプラットフォーム',
      };
    }

    if (!consultant) {
      return {
        title: 'コンサルタントが見つかりません | CareerSelect',
      };
    }

    const approvedReviews = consultant.reviews.filter(r => r.isApproved);
    const avgScore = approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.score, 0) / approvedReviews.length).toFixed(1)
      : '0.0';

    return {
      title: `${consultant.name} | CareerSelect`,
      description: consultant.headline || consultant.profileSummary || `${consultant.name}のプロフィール`,
      openGraph: {
        title: `${consultant.name} | CareerSelect`,
        description: consultant.headline || consultant.profileSummary || `${consultant.name}のプロフィール`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'CareerSelect',
      description: 'キャリアコンサルタントマッチングプラットフォーム',
    };
  }
}


export default async function ConsultantDetailPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ reviewed?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  
  let consultant: ConsultantWithReviews | null = null;
  let isMockData = false;
  
  try {
    const result = await prisma.consultant.findUnique({
      where: { id },
      include: {
        reviews: true,
        consultations: true,
        user: true,
      },
    });
    consultant = result as ConsultantWithReviews | null;
  } catch (error) {
    console.error('データベース接続エラー:', error);
    // DB接続失敗時はダミーデータを使用
    consultant = getMockConsultant(id);
    isMockData = true;
  }
  
  if (!consultant) {
    // ダミーデータにも該当IDがない場合は、最初のダミーを使用
    const { getMockConsultants } = await import('@/lib/mockData');
    const mockConsultants = getMockConsultants();
    consultant = {
      ...mockConsultants[0],
      consultations: [],
      user: null,
    } as ConsultantWithReviews;
    isMockData = true;
  }
  
  // 承認済みレビューのみフィルタリング
  const allReviews = consultant.reviews.filter(r => r.isApproved !== false);
  const consultReviews = allReviews.filter(r => r.type === 'consultation');
  const outcomeReviews = allReviews.filter(r => r.type === 'outcome');
  
  // 平均スコア計算
  const allAvgScore = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.score, 0) / allReviews.length).toFixed(1)
    : null;

  // 型安全な変換を使用
  const specialtyJobFunctions = Array.isArray(consultant.specialtyJobFunctions) ? consultant.specialtyJobFunctions : [];
  const expertiseRoles = parseStringArray(consultant.expertiseRoles);
  const expertiseTags = specialtyJobFunctions.length > 0 ? specialtyJobFunctions : expertiseRoles;

  // 検索軸プロフィール
  const ageRangeLabel = getAgeRangeLabel(consultant.ageRange);
  const educationDisplayLabel = getEducationCategoryDisplayLabel(consultant.education);
  const educationLabel = getEducationCategoryLabel(consultant.education);
  const industryLabel = getIndustryLabel(consultant.previousIndustry);
  const jobFunctionLabel = getJobFunctionLabel(consultant.previousJobFunction);
  const previousCompanies = Array.isArray(consultant.previousCompanies) 
    ? consultant.previousCompanies 
    : [];
  
  // ファーストビュー用の1行表示（例：30代前半｜早慶｜IT業界 × エンジニア）
  const firstViewParts: string[] = [];
  if (ageRangeLabel) firstViewParts.push(ageRangeLabel);
  if (educationDisplayLabel) firstViewParts.push(educationDisplayLabel);
  if (industryLabel && jobFunctionLabel) {
    firstViewParts.push(`${industryLabel} × ${jobFunctionLabel}`);
  } else if (industryLabel) {
    firstViewParts.push(industryLabel);
  } else if (jobFunctionLabel) {
    firstViewParts.push(jobFunctionLabel);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* DB接続エラー時の通知バナー */}
      {isMockData && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ 現在、データベース接続の準備中です。表示されている情報はサンプルデータです。
          </p>
        </div>
      )}
      
      {/* ① ファーストビュー：名前・検索軸プロフィールを最も目立たせる */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-10 mb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* サムネイル */}
          {consultant.thumbnailUrl ? (
            <div className="flex-shrink-0">
              <img
                src={consultant.thumbnailUrl}
                alt={consultant.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-6xl font-bold flex-shrink-0 shadow-lg">
              {consultant.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            {/* 名前（最も目立たせる） */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
              {consultant.name}
            </h1>
            {/* 肩書き */}
            {consultant.headline && (
              <p className="text-xl text-gray-700 mb-6 font-medium">{consultant.headline}</p>
            )}
            
            {/* 検索軸プロフィール（1行表示・目立たせる） */}
            {firstViewParts.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  {firstViewParts.map((part, i) => (
                    <span key={i} className="flex items-center">
                      {i > 0 && <span className="text-gray-300 mx-2 text-lg">｜</span>}
                      <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-800">
                        {part}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 得意領域タグ */}
            {expertiseTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {expertiseTags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100"
                  >
                    {getExpertiseTagLabel(tag)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ② レビュー（口コミ） */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">レビュー</h2>
        {allReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-base mb-2 font-medium">レビュー募集中</p>
            <p className="text-sm text-gray-400">このコンサルタントへのレビューはまだありません</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 平均評価 */}
            {allAvgScore && (
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-4xl text-yellow-400">★</span>
                  <span className="text-3xl font-bold text-gray-900">{allAvgScore}</span>
                </div>
                <span className="text-gray-600 text-base">
                  （{allReviews.length}件のレビュー）
                </span>
              </div>
            )}

            {/* 相談レビュー */}
            {consultReviews.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">相談レビュー</h3>
                <div className="space-y-6">
                  {consultReviews.map(r => {
                    const metaText = r.meta ? formatReviewerMeta(r.meta) : '';
                    return (
                      <div key={r.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                            相談レビュー
                          </span>
                          {metaText && (
                            <span className="text-xs text-gray-500">{metaText}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-yellow-400 text-xl">{'★'.repeat(r.score)}</span>
                          <span className="text-gray-600 text-sm">（{r.score}/5）</span>
                        </div>
                        <p className="text-gray-800 leading-relaxed mb-3 whitespace-pre-line text-base">
                          {r.comment}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateJP(r.createdAt.toISOString())}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 転職レビュー */}
            {outcomeReviews.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">転職レビュー</h3>
                <div className="space-y-6">
                  {outcomeReviews.map(r => {
                    const metaText = r.meta ? formatReviewerMeta(r.meta) : '';
                    return (
                      <div key={r.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="inline-block px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-xs font-semibold">
                            転職レビュー
                          </span>
                          {metaText && (
                            <span className="text-xs text-gray-500">{metaText}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-yellow-400 text-xl">{'★'.repeat(r.score)}</span>
                          <span className="text-gray-600 text-sm">（{r.score}/5）</span>
                        </div>
                        <p className="text-gray-800 leading-relaxed mb-3 whitespace-pre-line text-base">
                          {r.comment}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateJP(r.createdAt.toISOString())}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ③ 自己申告実績（カード化して視認性を上げる） */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">実績</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-sm">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {consultant.selfReportedCareerYears ?? '—'}
            </div>
            <div className="text-sm font-semibold text-gray-700">コンサルタント歴</div>
            <div className="text-xs text-gray-500 mt-1">年</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-sm">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {consultant.selfReportedTotalSupports ?? '—'}
            </div>
            <div className="text-sm font-semibold text-gray-700">累計支援人数</div>
            <div className="text-xs text-gray-500 mt-1">名</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-sm">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {consultant.selfReportedTotalPlacements ?? '—'}
            </div>
            <div className="text-sm font-semibold text-gray-700">転職成功数</div>
            <div className="text-xs text-gray-500 mt-1">名</div>
          </div>
        </div>
        {(consultant.selfReportedCareerYears === null && 
          consultant.selfReportedTotalSupports === null && 
          consultant.selfReportedTotalPlacements === null) && (
          <p className="text-sm text-gray-400 text-center mt-6">実績情報を準備中です</p>
        )}
      </div>

      {/* ④ 学歴・職歴（控えめに表示） */}
      {(educationLabel || previousCompanies.length > 0) && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">学歴・職歴</h2>
          <div className="space-y-5">
            {educationLabel && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">学歴</div>
                <div className="text-base text-gray-700">
                  {educationLabel}
                </div>
              </div>
            )}
            {(industryLabel || jobFunctionLabel || previousCompanies.length > 0) && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">前職</div>
                <div className="text-base text-gray-700">
                  {industryLabel && jobFunctionLabel && `${industryLabel} × ${jobFunctionLabel}`}
                  {industryLabel && !jobFunctionLabel && industryLabel}
                  {!industryLabel && jobFunctionLabel && jobFunctionLabel}
                </div>
                {previousCompanies.length > 0 && (
                  <div className="text-sm text-gray-500 mt-2">
                    {previousCompanies.join('、')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ⑤ 支援スタイル・メッセージ */}
      {consultant.profileSummary && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">支援スタイル・メッセージ</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
            {consultant.profileSummary}
          </div>
        </div>
      )}

      {/* ⑥ CTA「相談してみる」 */}
      <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-white rounded-3xl shadow-lg border border-blue-200 p-10 text-center mb-12">
        <p className="text-gray-800 mb-6 text-lg font-medium">
          このコンサルタントに相談してみたいと感じたら、こちらからご予約ください。
        </p>
        <Link
          href={`/consultants/${consultant.id}/book`}
          className="inline-block px-10 py-4 bg-blue-700 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          相談してみる
        </Link>
      </div>
    </div>
  );
}
