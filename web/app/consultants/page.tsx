import { prisma } from '@/lib/prisma';
import ConsultantsClient from './ConsultantsClient';
import { Consultant } from '@prisma/client';
import { getMockConsultants } from '@/lib/mockData';
import { createAnswerExcerpt, type ConsultantListDTO } from '@/lib/types/consultantList';

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

/**
 * コンサルタント一覧用のデータ取得（N+1回避、抜粋のみ）
 */
export default async function ConsultantsPage() {
  let consultants: ConsultantWithReviews[] = [];
  
  try {
    // N+1を避けるため、必要な関連データを一度に取得
    // まず、Answerテーブルを含む完全なクエリを試行
    try {
      const result = await prisma.consultant.findMany({
        select: {
          id: true,
          name: true,
          ageRange: true,
          previousIndustry: true,
          previousJobFunction: true,
          specialtyJobFunctions: true,
          expertiseRoles: true,
          headline: true,
          reviews: {
            select: {
              type: true,
              score: true,
              isApproved: true,
            },
          },
          _count: {
            select: { answers: true },
          },
          answers: {
            take: 3, // 最新3件まで
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true, // 抜粋生成用に全文取得（DB側で抜粋生成は非効率のため）
              createdAt: true,
              question: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      
      // 型変換（selectを使っているため、型アサーションが必要）
      // 実際のデータ構造は同じなので、型アサーションで対応
      consultants = result.map((c) => ({
        ...c,
        reviews: c.reviews,
        _count: c._count,
        answers: c.answers,
      })) as ConsultantWithReviews[];
    } catch (answerError: any) {
      // Answerテーブルが存在しない場合（P2021エラー）、answersなしで再試行
      if (answerError?.code === 'P2021' || answerError?.message?.includes('does not exist')) {
        console.warn('Answerテーブルが見つかりません。answersなしで取得します。');
        const result = await prisma.consultant.findMany({
          select: {
            id: true,
            name: true,
            ageRange: true,
            previousIndustry: true,
            previousJobFunction: true,
            specialtyJobFunctions: true,
            expertiseRoles: true,
            headline: true,
            reviews: {
              select: {
                type: true,
                score: true,
                isApproved: true,
              },
            },
            _count: {
              select: { reviews: true }, // answersが存在しないため、reviewsを選択
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        
        // answersと_count.answersを空/0で補完
        consultants = result.map((c) => ({
          ...c,
          reviews: c.reviews,
          _count: { 
            answers: 0, // Answerテーブルが存在しないため0
            ...c._count // 他の_countフィールドも保持
          },
          answers: [], // 空配列で補完
        })) as unknown as ConsultantWithReviews[];
      } else {
        // その他のエラーは再スロー
        throw answerError;
      }
    }
  } catch (error) {
    console.error('データベース接続エラー:', error);
    // DB接続失敗時はダミーデータを使用
    consultants = getMockConsultants() as ConsultantWithReviews[];
  }

  return <ConsultantsClient consultants={consultants} />;
}
