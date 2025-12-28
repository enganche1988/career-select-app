import { prisma } from '@/lib/prisma';
import Link from 'next/link';

type QuestionWithAnswers = {
  id: string;
  title: string;
  askerAgeRange: string | null;
  askerIndustry: string | null;
  createdAt: Date;
  _count: {
    answers: number;
  };
  answers: Array<{
    createdAt: Date;
  }>;
};

export default async function QuestionsPage() {
  let questions: QuestionWithAnswers[] = [];
  
  try {
    const result = await prisma.question.findMany({
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
        createdAt: new Date(),
        _count: { answers: 3 },
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
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A一覧</h1>
        <p className="text-sm text-gray-600">
          {questions.length}件の質問が見つかりました
        </p>
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
              <div className="text-xs text-gray-500 mt-1">
                投稿日: {formatDate(question.createdAt)}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

