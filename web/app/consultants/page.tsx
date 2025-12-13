import { prisma } from '@/lib/prisma';
import ConsultantsClient from './ConsultantsClient';
import { Consultant } from '@prisma/client';
import { getMockConsultants } from '@/lib/mockData';

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
    // DB接続失敗時はダミーデータを使用
    consultants = getMockConsultants();
  }

  return <ConsultantsClient consultants={consultants} />;
}
