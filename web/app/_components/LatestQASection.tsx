import Link from 'next/link';
import { prisma } from '@/lib/prisma';

type QuestionWithAnswers = {
  id: string;
  title: string;
  askerAgeRange: string | null;
  askerIndustry: string | null;
  _count: {
    answers: number;
  };
  answers: Array<{
    createdAt: Date;
  }>;
};

export default async function LatestQASection() {
  let questions: QuestionWithAnswers[] = [];
  
  try {
    const result = await prisma.question.findMany({
      take: 8, // 5〜8件表示（要件に合わせて8件に設定）
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { answers: true },
        },
        answers: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            createdAt: true,
          },
        },
      },
    });
    questions = result;
  } catch (error) {
    console.error('データベース接続エラー:', error);
    // 仮データ
    questions = [
      {
        id: '1',
        title: '30代で転職を考えています。大手からスタートアップへの転職は現実的ですか？',
        askerAgeRange: '30s_early',
        askerIndustry: 'it',
        _count: { answers: 3 },
        answers: [{ createdAt: new Date() }],
      },
      {
        id: '2',
        title: '第二新卒として転職活動を始めたいのですが、どのように準備すべきですか？',
        askerAgeRange: '20s_early',
        askerIndustry: 'manufacturing',
        _count: { answers: 2 },
        answers: [{ createdAt: new Date() }],
      },
    ] as QuestionWithAnswers[];
  }

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const getAgeRangeLabel = (ageRange: string | null) => {
    if (!ageRange) return '';
    const labels: Record<string, string> = {
      '20s_early': '20代前半',
      '20s_late': '20代後半',
      '30s_early': '30代前半',
      '30s_late': '30代後半',
      '40s_plus': '40代以上',
    };
    return labels[ageRange] || '';
  };

  const getIndustryLabel = (industry: string | null) => {
    if (!industry) return '';
    const labels: Record<string, string> = {
      'it': 'IT',
      'manufacturing': '製造業',
      'finance': '金融',
      'retail': '小売',
      'service': 'サービス',
    };
    return labels[industry] || industry;
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            新着Q&A
          </h2>
          <Link
            href="/questions"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
          >
            もっと見る →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => {
            const latestAnswer = question.answers[0];
            const askerInfo: string[] = [];
            if (question.askerAgeRange) {
              askerInfo.push(getAgeRangeLabel(question.askerAgeRange));
            }
            if (question.askerIndustry) {
              askerInfo.push(getIndustryLabel(question.askerIndustry));
            }
            
            return (
              <Link
                key={question.id}
                href={`/questions/${question.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all group"
              >
                <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {question.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                  {askerInfo.length > 0 && (
                    <span>{askerInfo.join(' / ')}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {question._count.answers}件の回答
                  </span>
                </div>
                {latestAnswer && (
                  <div className="text-xs text-gray-500">
                    最新回答: {formatDate(latestAnswer.createdAt)}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

