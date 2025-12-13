import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import XProfileCard from './XProfileCard';

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
      // データベース接続エラーの場合はデフォルトメタデータを返す
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

    // 平均スコア計算
    const approvedReviews = consultant.reviews.filter(r => r.isApproved);
    const avgScore = approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.score, 0) / approvedReviews.length).toFixed(1)
      : '0.0';

    // 代表的なレビューを抽出
    const representativeReview = approvedReviews
      .filter(r => r.comment && r.comment.length > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.comment.length - b.comment.length;
      })[0];

    const reviewComment = representativeReview
      ? representativeReview.comment
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 100) + (representativeReview.comment.length > 100 ? '...' : '')
      : '';

    // 支援実績数
    let supportCount = consultant.totalSupportCount;
    if (supportCount === 0) {
      try {
        supportCount = await prisma.consultation.count({
          where: {
            consultantId: id,
            status: 'completed',
          },
        });
      } catch (error) {
        supportCount = 0;
      }
    }

    const description = reviewComment || `${consultant.name}のキャリアコンサルタントプロフィール。評価${avgScore}、支援実績${supportCount}名。`;

    return {
      title: `${consultant.name} | CareerSelect`,
      description,
      openGraph: {
        title: `${consultant.name} | CareerSelect`,
        description,
        // OGP画像は一時的に無効化（エラー回避のため）
        // images: [
        //   {
        //     url: `/consultants/${id}/opengraph-image`,
        //     width: 1200,
        //     height: 630,
        //     alt: `${consultant.name}の成績表`,
        //   },
        // ],
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: `${consultant.name} | CareerSelect`,
        description,
        // images: [`/consultants/${id}/opengraph-image`],
      },
    };
  } catch (error) {
    // エラーが発生した場合はデフォルトメタデータを返す
    console.error('メタデータ生成エラー:', error);
    return {
      title: 'CareerSelect',
      description: 'キャリアコンサルタントマッチングプラットフォーム',
    };
  }
}

// モックデータ生成関数（DB接続エラー時用）
function createMockConsultant(id: string) {
  return {
    id,
    name: 'サンプルコンサルタント',
    headline: 'キャリア支援のプロフェッショナル',
    profileSummary: '現在、データベース接続の準備中です。しばらくお待ちください。',
    achievementsSummary: null,
    expertiseRoles: ['エンジニア', 'PM / PdM'],
    expertiseCompanyTypes: ['スタートアップ', 'メガベンチャー'],
    thumbnailUrl: null,
    twitterUrl: null,
    linkedinUrl: null,
    schedulerUrl: null,
    timelexUrl: null,
    experienceYears: 5,
    totalSupportCount: 0,
    reviews: [],
    consultations: [],
    user: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    bio: null,
    specialties: null,
    userId: null,
    snsFollowersTwitter: null,
    snsFollowersLinkedin: null,
    snsFollowersInstagram: null,
    externalLinks: null,
    twitterHandle: null,
    profileSourceRaw: null,
  };
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
  
  let consultant;
  let isMockData = false;
  
  try {
    consultant = await prisma.consultant.findUnique({
      where: { id },
      include: {
        reviews: true,
        consultations: true,
        user: true,
      },
    });
  } catch (error) {
    console.error('データベース接続エラー:', error);
    // エラー時はモックデータを返す
    consultant = createMockConsultant(id);
    isMockData = true;
  }
  
  if (!consultant) {
    // DB接続は成功したが、該当IDのコンサルタントが見つからない場合
    return notFound();
  }
  
  // 承認済みレビューのみフィルタリング
  const allReviews = consultant.reviews.filter(r => r.isApproved === true);
  const consultReviews = allReviews.filter(r => r.type === 'consultation');
  const outcomeReviews = allReviews.filter(r => r.type === 'outcome');
  
  // 平均スコア計算（全レビュー）
  const allAvgScore = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.score, 0) / allReviews.length).toFixed(1)
    : null;
  const avgConsultScore = consultReviews.length > 0
    ? (consultReviews.reduce((sum, r) => sum + r.score, 0) / consultReviews.length).toFixed(1)
    : null;
  const avgOutcomeScore = outcomeReviews.length > 0
    ? (outcomeReviews.reduce((sum, r) => sum + r.score, 0) / outcomeReviews.length).toFixed(1)
    : null;

  // 型安全な変換を使用
  const { parseStringArray } = await import('@/lib/types/consultant');
  const expertiseRoles = parseStringArray(consultant.expertiseRoles);
  const expertiseCompanyTypes = parseStringArray(consultant.expertiseCompanyTypes);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* DB接続エラー時の通知バナー */}
      {isMockData && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ 現在、データベース接続の準備中です。表示されている情報はサンプルデータです。
          </p>
        </div>
      )}
      
      {/* 1. ヘッダー：基本情報まとめ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* サムネイル画像 */}
          {consultant.thumbnailUrl ? (
            <div className="flex-shrink-0">
              <img
                src={consultant.thumbnailUrl}
                alt={consultant.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold flex-shrink-0 shadow-md">
              {consultant.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            {/* 名前 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{consultant.name}</h1>
            {/* 肩書き */}
            {consultant.headline && (
              <p className="text-lg text-gray-700 mb-3">{consultant.headline}</p>
            )}
            {/* 平均評価とレビュー件数 */}
            {allAvgScore && allReviews.length > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-2xl text-yellow-400">★</span>
                  <span className="text-xl font-bold text-gray-900">{allAvgScore}</span>
                </div>
                <span className="text-gray-600">
                  （{allReviews.length}件のレビュー）
                </span>
              </div>
            )}
            {/* サブコピー */}
            <p className="text-sm text-gray-600 mb-6">
              転職するかどうか迷っている段階のご相談でも大歓迎です。
            </p>
            {/* CTAボタン */}
            <Link
              href={`/consultants/${consultant.id}/book`}
              className="inline-block px-8 py-4 bg-blue-700 text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
            >
              このコンサルタントに相談する
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 得意領域タグ */}
      {(expertiseRoles.length > 0 || expertiseCompanyTypes.length > 0) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">得意な領域</h2>
          <div className="space-y-4">
            {expertiseRoles.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">職種</h3>
                <div className="flex flex-wrap gap-2">
                  {expertiseRoles.map((role, i) => (
                    <span
                      key={i}
                      className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {expertiseCompanyTypes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">企業タイプ</h3>
                <div className="flex flex-wrap gap-2">
                  {expertiseCompanyTypes.map((type, i) => (
                    <span
                      key={i}
                      className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. 自己紹介セクション */}
      {consultant.profileSummary && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">自己紹介</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {consultant.profileSummary}
          </p>
        </div>
      )}

      {/* 4. これまでの支援実績セクション */}
      {consultant.achievementsSummary && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">これまでの支援実績</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {consultant.achievementsSummary}
          </div>
        </div>
      )}

      {/* 5. X（旧Twitter）での発信セクション */}
      {consultant.twitterUrl && (
        <div className="mb-8">
          <XProfileCard twitterUrl={consultant.twitterUrl} />
        </div>
      )}

      {/* 6. レビューセクション */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">このコンサルタントへのレビュー</h2>
        <p className="text-sm text-gray-600 mb-6">
          実際に相談した方・転職まで支援を受けた方の声です。「相談レビュー」と「転職レビュー」を分けて掲載しています。
        </p>

        {/* 相談レビュー */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            相談レビュー
            {avgConsultScore && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                （平均: {avgConsultScore} / {consultReviews.length}件）
              </span>
            )}
          </h3>
          {consultReviews.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">
              まだレビューはありません。今後、相談や転職支援を受けた方の声が順次掲載されます。
            </p>
          ) : (
            <div className="space-y-4">
              {consultReviews.map(r => {
                const metaText = r.meta ? formatReviewerMeta(r.meta) : '';
                return (
                  <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        相談レビュー
                      </span>
                      {metaText && (
                        <span className="text-xs text-gray-500">{metaText}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-lg">{'★'.repeat(r.score)}</span>
                      <span className="text-gray-600 text-sm">（{r.score}/5）</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed mb-2 whitespace-pre-line">
                      {r.comment}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateJP(r.createdAt.toISOString())}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 転職レビュー */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            転職レビュー
            {avgOutcomeScore && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                （平均: {avgOutcomeScore} / {outcomeReviews.length}件）
              </span>
            )}
          </h3>
          {outcomeReviews.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">
              まだレビューはありません。今後、相談や転職支援を受けた方の声が順次掲載されます。
            </p>
          ) : (
            <div className="space-y-4">
              {outcomeReviews.map(r => {
                const metaText = r.meta ? formatReviewerMeta(r.meta) : '';
                return (
                  <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                        転職レビュー
                      </span>
                      {metaText && (
                        <span className="text-xs text-gray-500">{metaText}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-lg">{'★'.repeat(r.score)}</span>
                      <span className="text-gray-600 text-sm">（{r.score}/5）</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed mb-2 whitespace-pre-line">
                      {r.comment}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateJP(r.createdAt.toISOString())}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 7. フッターCTA */}
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-700 mb-4">
          このコンサルタントに相談してみたいと感じたら、こちらからご予約ください。
        </p>
        <Link
          href={`/consultants/${consultant.id}/book`}
          className="inline-block px-8 py-4 bg-blue-700 text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
        >
          相談を予約する
        </Link>
      </div>
    </div>
  );
}
