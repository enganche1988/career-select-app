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
  getSpecialtyJobFunctionLabel,
} from '@/lib/constants/profileOptions';

type ConsultantWithReviews = Consultant & {
  reviews: Array<{ type: string; score: number; isApproved?: boolean }>;
  _count: {
    answers: number;
  };
  answers: Array<{
    id: string;
    content: string;
    createdAt: Date;
    question: {
      id: string;
      title: string;
    };
  }>;
};

type Props = {
  consultants: ConsultantWithReviews[];
};

export default function ConsultantGrid({ consultants }: Props) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const formatAnswerExcerpt = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    // 文の途中で切れないように、最後の句点や改行の位置で切る
    const truncated = content.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('。');
    const lastNewline = truncated.lastIndexOf('\n');
    const cutPoint = Math.max(lastPeriod, lastNewline);
    if (cutPoint > maxLength * 0.7) {
      return truncated.substring(0, cutPoint + 1) + '...';
    }
    return truncated + '...';
  };

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
        
        return (
          <div
            key={c.id}
            className="flex flex-col h-full w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* A. 上部：最小プロフィール */}
            <div className="p-4 border-b border-gray-100">
              <div className="text-base font-bold text-gray-900 mb-2">
                {c.name}
              </div>
              
              {/* 検索軸プロフィール（1行・必須） */}
              {profileParts.length > 0 ? (
                <div className="text-xs text-gray-600 flex items-center gap-1 flex-wrap mb-2">
                  {profileParts.map((part, i) => (
                    <span key={i} className="flex items-center">
                      {i > 0 && <span className="text-gray-400 mx-1">｜</span>}
                      <span>{part}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 mb-2">プロフィール情報準備中</div>
              )}
              
              {/* 得意領域タグ（最大3） */}
              {displayTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center mb-2">
                  {displayTags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md"
                    >
                      {getSpecialtyJobFunctionLabel(tag) || getExpertiseTagLabel(tag)}
                    </span>
                  ))}
                </div>
              )}
              
              {/* 指標ミニ */}
              <div className="flex items-center gap-4 text-xs text-gray-600">
                {avgScore && totalReviewCount > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="font-bold text-gray-900">{avgScore}</span>
                    </div>
                    <span>レビュー{totalReviewCount}件</span>
                  </>
                ) : (
                  <span className="text-gray-400">レビュー準備中</span>
                )}
                <span>回答{c._count.answers}件</span>
              </div>
            </div>
            
            {/* B. 中央：回答一覧（固定高さ＋縦スクロール） */}
            <div className="flex-1 min-h-0 p-4">
              {c.answers.length > 0 ? (
                <div className="h-64 overflow-y-auto space-y-4 pr-2">
                  {c.answers.map((answer) => (
                    <div key={answer.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <Link
                        href={`/questions/${answer.question.id}`}
                        className="text-sm font-medium text-gray-900 mb-2 block hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {answer.question.title}
                      </Link>
                      <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                        {formatAnswerExcerpt(answer.content)}
                      </p>
                      <div className="text-xs text-gray-500">
                        {formatDate(answer.createdAt)}
                      </div>
                    </div>
                  ))}
                  {c._count.answers > 3 && (
                    <Link
                      href={`/consultants/${c.id}#answers`}
                      className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium pt-2"
                    >
                      この人の回答をもっと見る
                    </Link>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-sm text-gray-400">
                  回答はまだありません
                </div>
              )}
            </div>
            
            {/* C. 下部：CTA */}
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <Link
                href={`/consultants/${c.id}`}
                className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                詳細を見る
              </Link>
              <Link
                href={`/consultants/${c.id}`}
                className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                この人に相談する
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
