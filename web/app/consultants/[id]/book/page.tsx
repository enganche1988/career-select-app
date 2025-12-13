import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TimeRexRedirect from './TimeRexRedirect';
import BookingForm from './BookingForm';
import TimeRexButton from './TimeRexButton';

async function getConsultant(id: string) {
  return await prisma.consultant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      headline: true,
      profileSummary: true,
      expertiseRoles: true,
      expertiseCompanyTypes: true,
      thumbnailUrl: true,
      schedulerUrl: true,
      timelexUrl: true,
    },
  });
}

export default async function BookConsultationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ success?: string; schedulerUrl?: string; error?: string }>;
}) {
  const { id } = await params;
  const consultant = await getConsultant(id);
  if (!consultant) return notFound();

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const schedulerUrl = consultant.schedulerUrl || consultant.timelexUrl;
  const hasScheduler = !!schedulerUrl;
  const showTimeRexMessage = resolvedSearchParams?.success === '1' && resolvedSearchParams?.schedulerUrl;

  // 型安全な変換を使用
  const { parseStringArray } = await import('@/lib/types/consultant');
  const expertiseRoles = parseStringArray(consultant.expertiseRoles);
  const expertiseCompanyTypes = parseStringArray(consultant.expertiseCompanyTypes);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* TimeRex自動リダイレクト */}
      {showTimeRexMessage && (
        <TimeRexRedirect schedulerUrl={resolvedSearchParams.schedulerUrl!} />
      )}

      {/* 成功メッセージ */}
      {resolvedSearchParams?.success === '1' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          {showTimeRexMessage ? (
            <>
              <p className="text-green-800 font-semibold mb-2">
                TimeRexの画面で日程を確定してください。相談内容はコンサルタントのダッシュボードに記録されます（デモ）。
              </p>
              <p className="text-sm text-gray-600 mb-3">
                別タブでTimeRexのページが開きます。
              </p>
              <div className="flex gap-3 mt-3">
                <Link
                  href="/"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-sm"
                >
                  トップに戻る
                </Link>
                <Link
                  href="/consultants"
                  className="px-4 py-2 border border-green-600 text-green-700 rounded-lg font-medium hover:bg-green-50 transition text-sm"
                >
                  コンサルタント一覧へ戻る
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-green-800 font-semibold mb-2">相談予約リクエストを受け付けました。コンサルタントからのご連絡をお待ちください。</p>
              <div className="flex gap-3 mt-3">
                <Link
                  href="/"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-sm"
                >
                  トップページへ
                </Link>
                <Link
                  href="/consultants"
                  className="px-4 py-2 border border-green-600 text-green-700 rounded-lg font-medium hover:bg-green-50 transition text-sm"
                >
                  コンサルタント一覧へ
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* エラーメッセージ */}
      {resolvedSearchParams?.error === '1' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">
            送信に失敗しました。時間をおいて再度お試しください。
          </p>
        </div>
      )}

      {/* 1. コンサルタント概要カード */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {consultant.name}さんへの相談予約
        </h1>
        <div className="flex items-start gap-4 mb-4">
          {consultant.thumbnailUrl ? (
            <img
              src={consultant.thumbnailUrl}
              alt={consultant.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {consultant.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            {consultant.headline && (
              <p className="text-gray-700 mb-3 font-medium">{consultant.headline}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
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
          転職するかどうか迷っている段階のご相談でも大歓迎です。まずは30〜60分お話ししましょう。
        </p>
      </div>

      {/* 2. 共通説明コピー */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">相談方法と日程を選ぶ</h2>
        <p className="text-gray-700 leading-relaxed">
          このページから、相談方法（オンライン or 電話）と希望日時をお選びいただけます。コンサルタントの環境により、TimeRexでの自動日程調整 または フォームでの希望日時送信のいずれかをご利用いただけます。
        </p>
      </div>

      {/* 3. TimeRexがある場合 */}
      {hasScheduler ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">TimeRexで日程を選ぶ</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            このコンサルタントは日程調整ツール『TimeRex』を利用しています。下のボタンからTimeRexのページを開き、空いている日時から希望の時間帯をお選びください。予約が確定すると、CareerSelectのダッシュボードにも反映されます。（デモではモックの動作になります）
          </p>
          <TimeRexButton schedulerUrl={schedulerUrl} consultantId={consultant.id} />
        </div>
      ) : (
        /* 4. TimeRexがない場合 - アプリ内フォーム */
        <BookingForm consultantId={consultant.id} />
      )}

      {/* POC用説明 */}
      <p className="text-xs text-gray-500 mt-8 text-center">
        ※ 実際の本番環境では、メール通知や本格的な日程調整フローが追加される予定です。
      </p>
    </div>
  );
}
