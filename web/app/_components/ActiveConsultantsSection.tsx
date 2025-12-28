import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAgeRangeLabel, getIndustryLabel } from '@/lib/constants/profileOptions';

type ConsultantWithLatestAnswer = {
  id: string;
  name: string;
  ageRange: string | null;
  previousIndustry: string | null;
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

export default async function ActiveConsultantsSection() {
  let consultants: ConsultantWithLatestAnswer[] = [];
  
  try {
    // 回答が活発なコンサルタントを取得（最新回答を含む）
    const result = await prisma.consultant.findMany({
      take: 6,
      include: {
        answers: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            question: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      where: {
        answers: {
          some: {},
        },
      },
      orderBy: {
        answers: {
          _count: 'desc',
        },
      },
    });
    
    consultants = result.filter(c => c.answers.length > 0) as ConsultantWithLatestAnswer[];
  } catch (error) {
    console.error('データベース接続エラー:', error);
    // 仮データ
    consultants = [
      {
        id: '1',
        name: '山田太郎',
        ageRange: '30s_early',
        previousIndustry: 'it',
        answers: [{
          id: '1',
          content: 'スタートアップへの転職は、スキルセットと価値観のマッチングが重要です。大手企業での経験を活かしつつ、新しい環境での成長意欲を示すことがポイントになります。',
          createdAt: new Date(),
          question: {
            id: '1',
            title: '30代で転職を考えています。大手からスタートアップへの転職は現実的ですか？',
          },
        }],
      },
    ] as ConsultantWithLatestAnswer[];
  }

  const formatAnswerExcerpt = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          回答が見えるコンサルタント
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map((consultant) => {
            const latestAnswer = consultant.answers[0];
            if (!latestAnswer) return null;
            
            const profileParts: string[] = [];
            if (consultant.ageRange) {
              profileParts.push(getAgeRangeLabel(consultant.ageRange));
            }
            if (consultant.previousIndustry) {
              profileParts.push(getIndustryLabel(consultant.previousIndustry));
            }
            
            return (
              <div
                key={consultant.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {consultant.name}
                  </h3>
                  {profileParts.length > 0 && (
                    <div className="text-xs text-gray-600">
                      {profileParts.join(' / ')}
                    </div>
                  )}
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <Link
                    href={`/questions/${latestAnswer.question.id}`}
                    className="text-sm font-medium text-gray-900 mb-2 block hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {latestAnswer.question.title}
                  </Link>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {formatAnswerExcerpt(latestAnswer.content)}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href={`/consultants/${consultant.id}#answers`}
                    className="flex-1 text-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
                  >
                    この人の回答を見る
                  </Link>
                  <Link
                    href={`/consultants/${consultant.id}`}
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                  >
                    この人に相談する
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

