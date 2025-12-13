import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { calcConsultantExpectedScore } from '@/lib/consultantScore';
import { Consultant, Review } from '@prisma/client';

type ConsultantWithReviews = Consultant & {
  reviews: Review[];
};

export default async function TopConsultantsSection() {
  // 上位3名のコンサルタントを取得（期待スコア順）
  let consultants: ConsultantWithReviews[] = [];
  
  try {
    const result = await prisma.consultant.findMany({
      include: {
        reviews: true,
      },
      take: 3,
    });
    consultants = result as ConsultantWithReviews[];
  } catch (error) {
    console.error('データベース接続エラー:', error);
    // エラー時は空の配列を返す
  }

  // 期待スコアでソート
  const sortedConsultants = consultants
    .map(c => ({
      ...c,
      expScore: calcConsultantExpectedScore(c),
    }))
    .sort((a, b) => b.expScore - a.expScore);

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            注目のキャリアコンサルタント
          </h2>
          <p className="text-gray-600 mb-4">
            人気のコンサルタントや、高評価レビューのあるコンサルを紹介します。
          </p>
          <Link
            href="/consultants"
            className="text-blue-700 font-semibold hover:text-blue-800 transition flex items-center gap-1 inline-block"
          >
            すべて見る
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedConsultants.map((consultant) => {
            const avgScore =
              consultant.reviews.length > 0
                ? (
                    consultant.reviews.reduce((sum, r) => sum + r.score, 0) /
                    consultant.reviews.length
                  ).toFixed(1)
                : null;
            const expertiseRoles = Array.isArray(consultant.expertiseRoles)
              ? consultant.expertiseRoles
              : [];
            const expertiseCompanyTypes = Array.isArray(consultant.expertiseCompanyTypes)
              ? consultant.expertiseCompanyTypes
              : [];

            return (
              <Link
                key={consultant.id}
                href={`/consultants/${consultant.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group"
              >
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                  {consultant.thumbnailUrl ? (
                    <img
                      src={consultant.thumbnailUrl}
                      alt={consultant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                      <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-bold">
                        {consultant.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  {consultant.expScore >= 4.0 && (
                    <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      Top Expert
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition">
                    {consultant.name}
                  </h3>
                  {avgScore && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="font-semibold text-gray-900">{avgScore}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        （{consultant.reviews.length}件のレビュー）
                      </span>
                    </div>
                  )}
                  {expertiseRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {expertiseRoles.slice(0, 2).map((role, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md"
                        >
                          {String(role)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mb-4">
                    経験: {consultant.experienceYears}年
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-800">
                      詳しく見る →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

