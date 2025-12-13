'use client';

import { useState, useMemo } from 'react';
import { Consultant } from '@prisma/client';
import ConsultantGrid from './ConsultantGrid';
import FilterSidebar from './FilterSidebar';
import { calcConsultantExpectedScore } from '@/lib/consultantScore';
import { parseStringArray } from '@/lib/types/consultant';

type ConsultantWithReviews = Consultant & {
  reviews: Array<{ type: string; score: number }>;
};

type Props = {
  consultants: ConsultantWithReviews[];
};

type SortOption = 'recommended' | 'score-high' | 'score-low' | 'reviews-high';

export default function ConsultantsClient({ consultants: initialConsultants }: Props) {
  const [selectedAgeRange, setSelectedAgeRange] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  const [selectedExpertiseTags, setSelectedExpertiseTags] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedJobFunction, setSelectedJobFunction] = useState<string | null>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  // フィルタリング（即更新）
  const filteredConsultants = useMemo(() => {
    let filtered = initialConsultants.filter(c => {
      // 年代フィルタ
      if (selectedAgeRange && c.ageRange !== selectedAgeRange) return false;

      // 学歴フィルタ
      if (selectedEducation && c.education !== selectedEducation) return false;

      // 得意領域タグフィルタ
      if (selectedExpertiseTags.length > 0) {
        const specialtyJobFunctions = Array.isArray(c.specialtyJobFunctions) ? c.specialtyJobFunctions : [];
        const expertiseRoles = parseStringArray(c.expertiseRoles);
        const allTags = [...specialtyJobFunctions, ...expertiseRoles];
        if (!selectedExpertiseTags.some(tag => allTags.includes(tag))) return false;
      }

      // 前職業界フィルタ
      if (selectedIndustry && c.previousIndustry !== selectedIndustry) return false;

      // 前職職種フィルタ
      if (selectedJobFunction && c.previousJobFunction !== selectedJobFunction) return false;

      // オンライン可否フィルタ（schedulerUrlまたはtimelexUrlがあるか）
      if (onlineOnly && !c.schedulerUrl && !c.timelexUrl) return false;

      return true;
    });

    // ソート
    filtered = [...filtered].sort((a, b) => {
      const scoreA = calcConsultantExpectedScore(a);
      const scoreB = calcConsultantExpectedScore(b);
      const reviewsA = a.reviews.length;
      const reviewsB = b.reviews.length;
      const avgScoreA = reviewsA > 0
        ? a.reviews.reduce((sum, r) => sum + r.score, 0) / reviewsA
        : 0;
      const avgScoreB = reviewsB > 0
        ? b.reviews.reduce((sum, r) => sum + r.score, 0) / reviewsB
        : 0;

      switch (sortBy) {
        case 'recommended':
          // 期待スコア + レビュー数の組み合わせ
          return (scoreB * 0.6 + reviewsB * 0.4) - (scoreA * 0.6 + reviewsA * 0.4);
        case 'score-high':
          return scoreB - scoreA;
        case 'score-low':
          return scoreA - scoreB;
        case 'reviews-high':
          return reviewsB - reviewsA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    initialConsultants, 
    selectedAgeRange,
    selectedEducation,
    selectedExpertiseTags,
    selectedIndustry,
    selectedJobFunction,
    onlineOnly,
    sortBy
  ]);

  const handleReset = () => {
    setSelectedAgeRange(null);
    setSelectedEducation(null);
    setSelectedExpertiseTags([]);
    setSelectedIndustry(null);
    setSelectedJobFunction(null);
    setOnlineOnly(false);
    setSortBy('recommended');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左サイドバー */}
        <aside className="w-full md:w-64 shrink-0">
          <FilterSidebar
            selectedAgeRange={selectedAgeRange}
            selectedEducation={selectedEducation}
            selectedExpertiseTags={selectedExpertiseTags}
            selectedIndustry={selectedIndustry}
            selectedJobFunction={selectedJobFunction}
            onlineOnly={onlineOnly}
            onAgeRangeChange={setSelectedAgeRange}
            onEducationChange={setSelectedEducation}
            onExpertiseTagsChange={setSelectedExpertiseTags}
            onIndustryChange={setSelectedIndustry}
            onJobFunctionChange={setSelectedJobFunction}
            onOnlineOnlyChange={setOnlineOnly}
            onReset={handleReset}
          />
        </aside>
        
        {/* 右メインエリア */}
        <main className="flex-1">
          {/* ヘッダーとソート */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">キャリアコンサルタント</h1>
                <p className="text-sm text-gray-600">
                  {filteredConsultants.length}件のコンサルタントが見つかりました
                </p>
              </div>
              
              {/* ソート */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-900">並び替え:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
                >
                  <option value="recommended">推奨順</option>
                  <option value="score-high">期待スコア: 高い順</option>
                  <option value="score-low">期待スコア: 低い順</option>
                  <option value="reviews-high">レビュー数: 多い順</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 0件時の専用UI */}
          {filteredConsultants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  条件に合うコンサルタントが見つかりませんでした
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  条件を少し広げてみてください
                </p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  フィルターをリセット
                </button>
              </div>
            </div>
          ) : (
            /* カードグリッド */
            <ConsultantGrid consultants={filteredConsultants} />
          )}
        </main>
      </div>
    </div>
  );
}
