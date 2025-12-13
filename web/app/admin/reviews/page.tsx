import { prisma } from '@/lib/prisma';
import ReviewApprovalCard from './ReviewApprovalCard';

// レビュアー属性を表示用テキストに変換
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

export default async function AdminReviewsPage() {
  // 承認待ちレビューを取得
  const pendingReviews = await prisma.review.findMany({
    where: {
      isApproved: false,
    },
    include: {
      consultant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          レビュー承認管理
        </h1>
        <p className="text-gray-600">
          承認待ちのレビューを確認し、問題がなければ承認してください。
        </p>
      </div>

      {/* 統計情報 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">承認待ち</p>
            <p className="text-3xl font-bold text-blue-600">
              {pendingReviews.length}件
            </p>
          </div>
        </div>
      </div>

      {/* レビュー一覧 */}
      {pendingReviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">
            承認待ちのレビューはありません
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingReviews.map((review) => {
            const metaText = review.meta ? formatReviewerMeta(review.meta) : '';
            const typeLabel =
              review.type === 'consultation' ? '相談レビュー' : '転職レビュー';
            const typeBgColor =
              review.type === 'consultation' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700';

            return (
              <ReviewApprovalCard
                key={review.id}
                review={{
                  id: review.id,
                  consultant: review.consultant,
                  type: review.type,
                  typeLabel,
                  typeBgColor,
                  score: review.score,
                  comment: review.comment,
                  metaText,
                  meta: review.meta,
                  createdAt: review.createdAt.toISOString(),
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
