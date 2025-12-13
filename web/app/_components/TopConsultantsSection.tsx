import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { calcConsultantExpectedScore } from '@/lib/consultantScore';
import { Consultant, Review } from '@prisma/client';
import CanvaSection from './ui/CanvaSection';
import CanvaCard from './ui/CanvaCard';
import { getMockConsultants, type ConsultantWithReviews } from '@/lib/mockData';

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
    // DB接続失敗時はダミーデータを使用
    consultants = getMockConsultants().slice(0, 3);
  }

  // 期待スコアでソート
  const sortedConsultants = consultants
    .map(c => ({
      ...c,
      expScore: calcConsultantExpectedScore(c),
    }))
    .sort((a, b) => b.expScore - a.expScore);

  return (
    <CanvaSection variant="light">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          注目のキャリアコンサルタント
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          人気のコンサルタントや、高評価レビューのあるコンサルを紹介します。
        </p>
        <Link
          href="/consultants"
          className="text-emerald-700 font-bold hover:text-emerald-800 transition flex items-center gap-2 inline-block text-lg"
        >
          すべて見る
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              className="block"
            >
              <CanvaCard className="overflow-hidden group">
                <div className="relative w-full h-52 bg-gray-200 overflow-hidden">
                  {consultant.thumbnailUrl ? (
                    <img
                      src={consultant.thumbnailUrl}
                      alt={consultant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 via-blue-400 to-purple-500">
                      <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-bold">
                        {consultant.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  {consultant.expScore >= 4.0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                      Top Expert
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition">
                    {consultant.name}
                  </h3>
                  {avgScore && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="font-bold text-gray-900 text-lg">{avgScore}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        （{consultant.reviews.length}件のレビュー）
                      </span>
                    </div>
                  )}
                  {expertiseRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {expertiseRoles.slice(0, 2).map((role, i) => (
                        <span
                          key={i}
                          className="text-sm font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl"
                        >
                          {String(role)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-base text-gray-700 mb-4 font-medium">
                    経験: {consultant.experienceYears}年
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-base font-bold text-emerald-700 group-hover:text-emerald-800">
                      詳しく見る →
                    </span>
                  </div>
                </div>
              </CanvaCard>
            </Link>
          );
        })}
      </div>
    </CanvaSection>
  );
}
