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
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  // 全職種・企業タイプを抽出（型安全な変換を使用）
  const allRoles = useMemo(() => {
    const rolesSet = new Set<string>();
    initialConsultants.forEach(c => {
      const roles = parseStringArray(c.expertiseRoles);
      roles.forEach(r => rolesSet.add(r));
    });
    return Array.from(rolesSet).sort();
  }, [initialConsultants]);

  const allCompanyTypes = useMemo(() => {
    const typesSet = new Set<string>();
    initialConsultants.forEach(c => {
      const types = parseStringArray(c.expertiseCompanyTypes);
      types.forEach(t => typesSet.add(t));
    });
    return Array.from(typesSet).sort();
  }, [initialConsultants]);

  // フィルタリング
  const filteredConsultants = useMemo(() => {
    let filtered = initialConsultants.filter(c => {
      // 職種フィルタ（型安全な変換を使用）
      if (selectedRoles.length > 0) {
        const roles = parseStringArray(c.expertiseRoles);
        // 新規検索用フィールドも考慮
        const specialtyJobFunctions = Array.isArray(c.specialtyJobFunctions) ? c.specialtyJobFunctions : [];
        const allJobFunctions = [...roles, ...specialtyJobFunctions];
        if (!selectedRoles.some(r => allJobFunctions.includes(r))) return false;
      }

      // 企業タイプフィルタ（型安全な変換を使用）
      if (selectedCompanyTypes.length > 0) {
        const types = parseStringArray(c.expertiseCompanyTypes);
        if (!selectedCompanyTypes.some(t => types.includes(t))) return false;
      }

      // キーワード検索
      if (keyword.trim()) {
        const searchLower = keyword.toLowerCase();
        const searchableText = [
          c.name,
          c.specialties,
          c.achievementsSummary || '',
          c.bio || '',
        ].join(' ').toLowerCase();
        if (!searchableText.includes(searchLower)) return false;
      }

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
  }, [initialConsultants, selectedRoles, selectedCompanyTypes, keyword, sortBy]);

  const handleReset = () => {
    setSelectedRoles([]);
    setSelectedCompanyTypes([]);
    setKeyword('');
    setSortBy('recommended');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左サイドバー */}
        <aside className="w-full md:w-64 shrink-0">
          <FilterSidebar
            allRoles={allRoles}
            allCompanyTypes={allCompanyTypes}
            selectedRoles={selectedRoles}
            selectedCompanyTypes={selectedCompanyTypes}
            keyword={keyword}
            onRolesChange={setSelectedRoles}
            onCompanyTypesChange={setSelectedCompanyTypes}
            onKeywordChange={setKeyword}
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
          
          {/* カードグリッド */}
          <ConsultantGrid consultants={filteredConsultants} />
        </main>
      </div>
    </div>
  );
}
