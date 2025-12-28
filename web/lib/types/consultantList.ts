/**
 * コンサルタント一覧ページ用のDTO型定義
 * 表示専用の軽量なデータ構造
 */

import { Consultant } from '@prisma/client';

/**
 * レビューサマリー
 */
export type ReviewSummary = {
  avgScore: number | null; // 平均評価
  count: number; // レビュー件数
};

/**
 * Q&Aサマリー
 */
export type QASummary = {
  answerCount: number; // 回答数
};

/**
 * 最新回答（抜粋）
 */
export type LatestAnswer = {
  questionId: string;
  questionTitle: string;
  answerExcerpt: string; // 2〜4行分の抜粋（約120文字）
  answeredAt: Date;
};

/**
 * コンサルタント一覧用DTO
 */
export type ConsultantListDTO = Pick<
  Consultant,
  | 'id'
  | 'name'
  | 'ageRange'
  | 'previousIndustry'
  | 'previousJobFunction'
  | 'specialtyJobFunctions'
  | 'expertiseRoles'
  | 'headline'
> & {
  reviewSummary: ReviewSummary;
  qaSummary: QASummary;
  latestAnswers: LatestAnswer[]; // 最新3件まで
};

/**
 * 回答内容から抜粋を生成（2〜4行分、約120文字）
 */
export function createAnswerExcerpt(content: string, maxLength: number = 120): string {
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
}

