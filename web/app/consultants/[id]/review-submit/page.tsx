import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ReviewForm from './ReviewForm';

async function getConsultant(id: string) {
  return await prisma.consultant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      headline: true,
      expertiseRoles: true,
      expertiseCompanyTypes: true,
      thumbnailUrl: true,
    },
  });
}

export default async function ReviewSubmitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const consultant = await getConsultant(id);
  
  if (!consultant) return notFound();

  // 型安全な変換を使用
  const { parseStringArray } = await import('@/lib/types/consultant');
  const expertiseRoles = parseStringArray(consultant.expertiseRoles);
  const expertiseCompanyTypes = parseStringArray(consultant.expertiseCompanyTypes);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* 1. コンサルタント情報ヘッダー */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {consultant.name}さんへのレビュー投稿
        </h1>
        <div className="flex items-start gap-4 mb-4">
          {consultant.thumbnailUrl ? (
            <img
              src={consultant.thumbnailUrl}
              alt={consultant.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {consultant.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            {consultant.headline && (
              <p className="text-gray-700 mb-3 font-medium">{consultant.headline}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {expertiseRoles.slice(0, 3).map((role, i) => (
                <span
                  key={i}
                  className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  {role}
                </span>
              ))}
              {expertiseCompanyTypes.slice(0, 2).map((type, i) => (
                <span
                  key={i}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          実名は公開されません。年代・職種などの属性情報とコメントのみが表示されます。
        </p>
      </div>

      {/* 2. レビュー入力フォーム */}
      <ReviewForm consultantId={consultant.id} />
    </div>
  );
}


