'use client';

import Link from 'next/link';
import { calcConsultantExpectedScore } from '@/lib/consultantScore';
import { Consultant } from '@prisma/client';
import { parseStringArray } from '@/lib/types/consultant';

type ConsultantWithReviews = Consultant & {
  reviews: Array<{ type: string; score: number }>;
};

type Props = {
  consultants: ConsultantWithReviews[];
};

export default function ConsultantGrid({ consultants }: Props) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {consultants.map((c) => {
        const consultationReviews = c.reviews.filter(r => r.type === 'consultation');
        const outcomeReviews = c.reviews.filter(r => r.type === 'outcome');
        const totalReviewCount = c.reviews.length;
        const avgScore = totalReviewCount > 0
          ? ((consultationReviews.reduce((sum, r) => sum + r.score, 0) + outcomeReviews.reduce((sum, r) => sum + r.score, 0)) / totalReviewCount).toFixed(1)
          : null;
        const expScore = calcConsultantExpectedScore(c);
        const isTopExpert = expScore >= 4.0;
        
        // 型安全な変換を使用
        const expertiseRoles = parseStringArray(c.expertiseRoles);
        const expertiseCompanyTypes = parseStringArray(c.expertiseCompanyTypes);
        
        return (
          <Link
            key={c.id}
            href={`/consultants/${c.id}`}
            className="group block"
          >
            <div className="flex flex-col h-full w-full bg-white rounded-2xl shadow-sm border overflow-hidden">
              {/* 画像エリア */}
              <div className="relative w-full h-32 bg-gray-200 overflow-hidden">
                {c.thumbnailUrl ? (
                  <img 
                    src={c.thumbnailUrl} 
                    alt={c.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold">
                      {c.name.charAt(0)}
                    </div>
                  </div>
                )}
                {/* Top Expert バッジ */}
                {isTopExpert && (
                  <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    Top Expert
                  </div>
                )}
                {/* お気に入りアイコン */}
                <button
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              {/* カード内容 */}
              <div className="p-3 flex flex-col gap-1.5 flex-1">
                {/* 名前 */}
                <div className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {c.name}
                </div>
                
                {/* 評価 */}
                {avgScore && (
                  <div className="text-xs text-gray-700 flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="font-semibold">{avgScore}</span>
                    <span className="text-gray-500">（{totalReviewCount}件）</span>
                  </div>
                )}
                
                {/* 職種タグ（最大3個） */}
                {expertiseRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {expertiseRoles.slice(0, 3).map((role, i) => (
                      <span key={i} className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        {String(role)}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* 企業タイプタグ（最大2個） */}
                {expertiseCompanyTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {expertiseCompanyTypes.slice(0, 2).map((type, i) => (
                      <span key={i} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                        {String(type)}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* 実績サマリー */}
                {c.achievementsSummary && (
                  <p className="text-xs text-gray-600 line-clamp-2 leading-snug flex-1">
                    {c.achievementsSummary}
                  </p>
                )}
                
                {/* 下部情報 */}
                <div className="text-[10px] text-gray-500 pt-1.5 border-t border-gray-100">
                  経験：{c.experienceYears}年 ／ 期待スコア：{expScore}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
