'use client';

import { useState } from 'react';
import {
  AGE_RANGES,
  EDUCATION_CATEGORIES,
  INDUSTRIES,
  JOB_FUNCTIONS,
  EXPERTISE_TAGS,
} from '@/lib/constants/profileOptions';

type Props = {
  selectedAgeRange: string | null;
  selectedEducation: string | null;
  selectedExpertiseTags: string[];
  selectedIndustry: string | null;
  selectedJobFunction: string | null;
  onlineOnly: boolean;
  onAgeRangeChange: (ageRange: string | null) => void;
  onEducationChange: (education: string | null) => void;
  onExpertiseTagsChange: (tags: string[]) => void;
  onIndustryChange: (industry: string | null) => void;
  onJobFunctionChange: (jobFunction: string | null) => void;
  onOnlineOnlyChange: (onlineOnly: boolean) => void;
  onReset: () => void;
};

export default function FilterSidebar({
  selectedAgeRange,
  selectedEducation,
  selectedExpertiseTags,
  selectedIndustry,
  selectedJobFunction,
  onlineOnly,
  onAgeRangeChange,
  onEducationChange,
  onExpertiseTagsChange,
  onIndustryChange,
  onJobFunctionChange,
  onOnlineOnlyChange,
  onReset,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpertiseTagToggle = (tag: string) => {
    if (selectedExpertiseTags.includes(tag)) {
      onExpertiseTagsChange(selectedExpertiseTags.filter(t => t !== tag));
    } else {
      onExpertiseTagsChange([...selectedExpertiseTags, tag]);
    }
  };

  const hasActiveFilters = 
    selectedAgeRange !== null ||
    selectedEducation !== null ||
    selectedExpertiseTags.length > 0 ||
    selectedIndustry !== null ||
    selectedJobFunction !== null ||
    onlineOnly;

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">フィルター</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            リセット
          </button>
        )}
      </div>
      
      {/* 常時表示フィルタ */}
      
      {/* 年代（単一選択） */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3">年代</h4>
        <select
          value={selectedAgeRange || ''}
          onChange={(e) => onAgeRangeChange(e.target.value || null)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
        >
          <option value="">すべて</option>
          {AGE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* 学歴カテゴリ（単一選択） */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3">学歴</h4>
        <select
          value={selectedEducation || ''}
          onChange={(e) => onEducationChange(e.target.value || null)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
        >
          <option value="">すべて</option>
          {EDUCATION_CATEGORIES.map((edu) => (
            <option key={edu.value} value={edu.value}>
              {edu.label}
            </option>
          ))}
        </select>
      </div>

      {/* 得意領域（複数選択・タグ） */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3">得意領域</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {EXPERTISE_TAGS.map((tag) => (
            <label key={tag.value} className="flex items-center cursor-pointer group py-1 hover:bg-gray-50 rounded px-1 -mx-1 transition-colors">
              <input
                type="checkbox"
                checked={selectedExpertiseTags.includes(tag.value)}
                onChange={() => handleExpertiseTagToggle(tag.value)}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {tag.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 折りたたみフィルタ */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors"
        >
          <span>詳細フィルター</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="space-y-4">
            {/* 前職業界（単一選択） */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">前職業界</h4>
              <select
                value={selectedIndustry || ''}
                onChange={(e) => onIndustryChange(e.target.value || null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="">すべて</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 前職職種（単一選択） */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">前職職種</h4>
              <select
                value={selectedJobFunction || ''}
                onChange={(e) => onJobFunctionChange(e.target.value || null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="">すべて</option>
                {JOB_FUNCTIONS.map((job) => (
                  <option key={job.value} value={job.value}>
                    {job.label}
                  </option>
                ))}
              </select>
            </div>

            {/* オンライン対応可（トグル） */}
            <div>
              <label className="flex items-center cursor-pointer group hover:bg-gray-50 rounded px-1 -mx-1 py-1 transition-colors">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={(e) => onOnlineOnlyChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  オンライン相談可のみ
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
