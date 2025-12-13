import { prisma } from '@/lib/prisma';
import ConsultantsClient from './ConsultantsClient';
import { Consultant } from '@prisma/client';

type ConsultantWithReviews = Consultant & {
  reviews: Array<{ type: string; score: number }>;
};

export default async function ConsultantsPage() {
  let consultants: ConsultantWithReviews[] = [];
  
  try {
    const result = await prisma.consultant.findMany({
      include: {
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    consultants = result as ConsultantWithReviews[];
  } catch (error) {
    console.error('データベース接続エラー:', error);
    // Vercel環境などでSQLiteファイルにアクセスできない場合のフォールバック
    // エラーメッセージを表示するか、空の配列を返す
  }

  return <ConsultantsClient consultants={consultants} />;
}
