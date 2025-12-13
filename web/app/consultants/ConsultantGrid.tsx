'use client';

import Link from 'next/link';
import { Consultant } from '@prisma/client';
import { parseStringArray } from '@/lib/types/consultant';
import {
  getAgeRangeLabel,
  getEducationCategoryDisplayLabel,
  getIndustryLabel,
  getJobFunctionLabel,
  getExpertiseTagLabel,
} from '@/lib/constants/profileOptions';

type ConsultantWithReviews = Consultant & {
  reviews: Array<{ type: string; score: number; isApproved?: boolean }>;
};

type Props = {
  consultants: ConsultantWithReviews[];
};

export default function ConsultantGrid({ consultants }: Props) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {consultants.map((c) => {
        // 承認済みレビューのみ
        const approvedReviews = c.reviews.filter(r => r.isApproved !== false);
        const totalReviewCount = approvedReviews.length;
        const avgScore = totalReviewCount > 0
          ? (approvedReviews.reduce((sum, r) => sum + r.score, 0) / totalReviewCount).toFixed(1)
          : null;
        
        // 検索軸プロフィール（必須表示）
        const ageRangeLabel = getAgeRangeLabel(c.ageRange);
        const educationDisplayLabel = getEducationCategoryDisplayLabel(c.education);
        const industryLabel = getIndustryLabel(c.previousIndustry);
        const jobFunctionLabel = getJobFunctionLabel(c.previousJobFunction);
        
        // 検索軸プロフィール（1行表示用、必須）
        const profileParts: string[] = [];
        if (ageRangeLabel) profileParts.push(ageRangeLabel);
        if (educationDisplayLabel) profileParts.push(educationDisplayLabel);
        if (industryLabel && jobFunctionLabel) {
          profileParts.push(`${industryLabel} × ${jobFunctionLabel}`);
        } else if (industryLabel) {
          profileParts.push(industryLabel);
        } else if (jobFunctionLabel) {
          profileParts.push(jobFunctionLabel);
        }
        
        // 得意領域タグ（specialtyJobFunctions優先、なければexpertiseRoles）
        const specialtyJobFunctions = Array.isArray(c.specialtyJobFunctions) ? c.specialtyJobFunctions : [];
        const expertiseRoles = parseStringArray(c.expertiseRoles);
        const expertiseTags = specialtyJobFunctions.length > 0 
          ? specialtyJobFunctions 
          : expertiseRoles;
        const displayTags = expertiseTags.slice(0, 3);
        const remainingTagsCount = expertiseTags.length - 3;
        
        // 自己申告実績の代表値（支援人数優先、なければ転職成功数）
        const achievementValue = c.selfReportedTotalSupports 
          ? `支援実績：${c.selfReportedTotalSupports}名`
          : c.selfReportedTotalPlacements
          ? `転職成功：${c.selfReportedTotalPlacements}名`
          : null;
        
        return (
          <Link
            key={c.id}
            href={`/consultants/${c.id}`}
            className="group block"
          >
            <div className="flex flex-col h-full w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* 1. サムネイル */}
              <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                {c.thumbnailUrl ? (
                  <img 
                    src={c.thumbnailUrl} 
                    alt={c.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-bold">
                      {c.name.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 2. カード内容 */}
              <div className="p-4 flex flex-col gap-2.5 flex-1 min-h-0">
                {/* 2-1. 名前 */}
                <div className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {c.name}
                </div>
                
                {/* 2-2. 検索軸プロフィール（1行・必須） */}
                {profileParts.length > 0 ? (
                  <div className="text-xs text-gray-600 flex items-center gap-1 flex-wrap">
                    {profileParts.map((part, i) => (
                      <span key={i} className="flex items-center">
                        {i > 0 && <span className="text-gray-400 mx-1">｜</span>}
                        <span>{part}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">プロフィール情報準備中</div>
                )}
                
                {/* 2-3. 得意領域タグ（最大3、残りは +n） */}
                {displayTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {displayTags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md"
                      >
                        {getExpertiseTagLabel(tag)}
                      </span>
                    ))}
                    {remainingTagsCount > 0 && (
                      <span className="text-xs text-gray-500 font-medium">
                        +{remainingTagsCount}
                      </span>
                    )}
                  </div>
                )}
                
                {/* 2-4. 自己申告実績の代表値 */}
                {achievementValue && (
                  <div className="text-xs text-gray-700 font-medium">
                    {achievementValue}
                  </div>
                )}
                
                {/* 2-5. レビューサマリ */}
                {avgScore && totalReviewCount > 0 ? (
                  <div className="flex items-center gap-1.5 mt-auto">
                    <div className="flex items-center gap-0.5">
                      <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="text-sm font-bold text-gray-900">{avgScore}</span>
                    </div>
                    <span className="text-xs text-gray-500">（{totalReviewCount}件）</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 mt-auto">
                    レビュー準備中
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
