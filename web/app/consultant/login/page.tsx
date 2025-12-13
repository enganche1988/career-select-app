import { prisma } from '@/lib/prisma';
import Link from 'next/link';

type ConsultantSelect = {
  id: string;
  name: string;
  headline: string | null;
  profileSummary: string | null;
};

export default async function ConsultantLoginPage() {
  let consultants: ConsultantSelect[] = [];
  
  try {
    const result = await prisma.consultant.findMany({
      select: {
        id: true,
        name: true,
        headline: true,
        profileSummary: true,
      },
      orderBy: { name: 'asc' },
    });
    consultants = result;
  } catch (error) {
    console.error('データベース接続エラー:', error);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">コンサルタント用ログイン（デモ）</h1>
        <p className="text-gray-600">
          POC用のため、実際のログイン認証は行っていません。編集するコンサルタントを選んでください。
        </p>
      </div>

      <div className="space-y-4">
        {consultants.map((consultant) => (
          <div
            key={consultant.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{consultant.name}</h3>
                {consultant.headline && (
                  <p className="text-sm text-gray-600 mb-2">{consultant.headline}</p>
                )}
                {consultant.profileSummary && (
                  <p className="text-sm text-gray-500 line-clamp-2">{consultant.profileSummary}</p>
                )}
              </div>
              <Link
                href={`/dashboard?consultantId=${consultant.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition whitespace-nowrap"
              >
                このコンサルとしてダッシュボードを開く
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


