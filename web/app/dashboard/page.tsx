import { prisma } from '@/lib/prisma';
import { toggleConsultationStatus } from './actions';
import Link from 'next/link';
import ConsultantSelectorClient from './ConsultantSelectorClient';

async function getCurrentConsultant(consultantId?: string) {
  try {
    if (consultantId) {
      const consultant = await prisma.consultant.findUnique({
        where: { id: consultantId },
        include: {
          consultations: {
            include: { user: true },
            orderBy: { scheduledAt: 'desc' },
          },
        },
      });
      if (consultant) return consultant;
    }
    // フォールバック: 最初のConsultant
    return await prisma.consultant.findFirst({
      include: {
        consultations: {
          include: { user: true },
          orderBy: { scheduledAt: 'desc' },
        },
      },
    });
  } catch (error) {
    console.error('データベース接続エラー:', error);
    return null;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ consultantId?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const consultant = await getCurrentConsultant(resolvedSearchParams?.consultantId);

  if (!consultant) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-bold text-red-800 mb-2">データベース接続エラー</h1>
          <p className="text-red-700 mb-4">
            Vercel環境ではSQLiteファイルベースのデータベースは使用できません。
          </p>
          <p className="text-sm text-red-600">
            本番環境ではPostgreSQLなどのクラウドデータベースの設定が必要です。
          </p>
        </div>
      </div>
    );
  }

  // 全コンサルタント一覧を取得（切り替え用）
  let allConsultants: Array<{ id: string; name: string }> = [];
  try {
    const result = await prisma.consultant.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    allConsultants = result;
  } catch (error) {
    console.error('データベース接続エラー:', error);
  }

  const scheduledConsultations = consultant.consultations.filter(
    (c) => c.status === 'scheduled' || c.status === 'scheduled_request' || c.status === 'pending'
  );
  const completedConsultations = consultant.consultations.filter((c) => c.status === 'completed');
  const canceledConsultations = consultant.consultations.filter((c) => c.status === 'canceled');

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">コンサルタントダッシュボード</h2>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">
            現在表示中のコンサルタント: <span className="font-semibold text-blue-700">{consultant.name}</span>
            <Link
              href={`/dashboard/profile?consultantId=${consultant.id}`}
              className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
            >
              プロフィール編集
            </Link>
          </p>
        </div>
        <p className="text-xs text-gray-500">
          ※ 現在はPOCのため、コンサルタントの切り替えとログインは簡易的な仕組みで実装されています。
        </p>
      </div>

      {/* コンサルタント切り替えUI */}
      <div className="mb-6">
        <ConsultantSelectorClient currentConsultantId={consultant.id} consultants={allConsultants} />
      </div>

      {/* プロフィール編集カード */}
      <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-2">プロフィール設定</h3>
        <p className="text-sm text-gray-600 mb-4">
          公開されるプロフィール情報（自己紹介やタグ、SNSリンク）を編集できます。
        </p>
        <Link
          href={`/dashboard/profile?consultantId=${consultant.id}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          プロフィールを編集する
        </Link>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">予約一覧</h3>

        {consultant.consultations.length === 0 ? (
          <p className="text-gray-500">予約がありません</p>
        ) : (
          <div className="space-y-6">
            {scheduledConsultations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  予定中 ({scheduledConsultations.length}件)
                </h4>
                <ul className="divide-y border rounded-lg">
                  {scheduledConsultations.map((cons) => (
                    <li key={cons.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{cons.user.name}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(cons.scheduledAt).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="inline-block rounded px-2 py-0.5 text-xs bg-blue-100 text-blue-700 font-medium">
                              {cons.status === 'scheduled_request' ? '予約リクエスト' : cons.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                            <span>希望日時: {new Date(cons.scheduledAt).toLocaleString('ja-JP', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}</span>
                            {cons.meetingMethod && (
                              <span>連絡手段: {cons.meetingMethod === 'phone' ? '電話' : cons.meetingMethod === 'zoom' ? 'Zoom' : cons.meetingMethod}</span>
                            )}
                          </div>
                          {cons.theme && (
                            <p className="text-sm text-gray-700 mt-2 font-medium line-clamp-1">
                              {cons.theme}
                            </p>
                          )}
                          {cons.note && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {cons.note.length > 50 ? `${cons.note.substring(0, 50)}...` : cons.note}
                            </p>
                          )}
                        </div>
                        <form action={toggleConsultationStatus}>
                          <input type="hidden" name="consultationId" value={cons.id} />
                          <input type="hidden" name="prevStatus" value={cons.status} />
                          <button
                            type="submit"
                            className="px-3 py-1.5 text-sm border rounded bg-blue-50 hover:bg-blue-100 transition"
                          >
                            完了にする
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {completedConsultations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  完了 ({completedConsultations.length}件)
                </h4>
                <ul className="divide-y border rounded-lg">
                  {completedConsultations.map((cons) => (
                    <li key={cons.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{cons.user.name}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(cons.scheduledAt).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="inline-block rounded px-2 py-0.5 text-xs bg-green-100 text-green-700 font-medium">
                              {cons.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                            <span>希望日時: {new Date(cons.scheduledAt).toLocaleString('ja-JP', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}</span>
                            {cons.meetingMethod && (
                              <span>連絡手段: {cons.meetingMethod === 'phone' ? '電話' : cons.meetingMethod === 'zoom' ? 'Zoom' : cons.meetingMethod}</span>
                            )}
                          </div>
                          {cons.theme && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{cons.theme}</p>
                          )}
                        </div>
                        <form action={toggleConsultationStatus}>
                          <input type="hidden" name="consultationId" value={cons.id} />
                          <input type="hidden" name="prevStatus" value={cons.status} />
                          <button
                            type="submit"
                            className="px-3 py-1.5 text-sm border rounded bg-gray-50 hover:bg-gray-100 transition"
                          >
                            予定に戻す
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {canceledConsultations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  キャンセル ({canceledConsultations.length}件)
                </h4>
                <ul className="divide-y border rounded-lg">
                  {canceledConsultations.map((cons) => (
                    <li key={cons.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{cons.user.name}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(cons.scheduledAt).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="inline-block rounded px-2 py-0.5 text-xs bg-gray-100 text-gray-700 font-medium">
                              {cons.status}
                            </span>
                          </div>
                          {cons.theme && (
                            <p className="text-sm text-gray-700 mt-1 line-clamp-2">{cons.theme}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
