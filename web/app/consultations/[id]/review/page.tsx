import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { createReview } from './actions';

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: { user: true, consultant: true },
  });
  if (!consultation) return notFound();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">口コミ投稿</h2>
      <p className="mb-2 text-gray-700">
        コンサルタント: <b>{consultation.consultant.name}</b> ／ ユーザー: <b>{consultation.user.name}</b>
      </p>
      <form action={async (formData) => {
        await createReview(
          consultation.id,
          consultation.userId,
          consultation.consultantId,
          formData
        );
      }} className="space-y-5 max-w-md">
        <div>
          <label className="block mb-1 font-semibold">レビュー種別</label>
          <div className="flex gap-6 mt-1">
            <label className="inline-flex items-center">
              <input type="radio" name="type" value="consultation" defaultChecked className="mr-2" />相談レビュー
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="type" value="outcome" className="mr-2" />転職実績レビュー
            </label>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold">評価（1〜5）</label>
          <div className="flex gap-4 mt-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="inline-flex items-center">
                <input type="radio" name="score" value={num} defaultChecked={num === 5} className="mr-1" />
                {'★'.repeat(num)}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold">コメント</label>
          <textarea name="comment" rows={3} required placeholder="例）相談できて一歩踏み出せました" className="border rounded p-2 w-full" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold">口コミを送信する</button>
      </form>
    </div>
  );
}
