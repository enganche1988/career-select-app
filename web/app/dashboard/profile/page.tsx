import { prisma } from '@/lib/prisma';
import { updateConsultantProfile } from './actions';
import Link from 'next/link';

// parseStringArray関数を直接定義（古いコミット対応）
function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(v => String(v)).filter(v => v.length > 0);
  }
  return [];
}

const EXPERTISE_ROLES = [
  'エンジニア',
  'PdM/PM',
  'デザイナー',
  'コーポレート（人事・総務・経理）',
  '営業',
  'マーケティング',
  'カスタマーサクセス',
];

const COMPANY_TYPES = [
  '大企業',
  'メガベンチャー',
  'スタートアップ',
  '外資系',
  '上場準備企業',
];

async function getCurrentConsultant(consultantId?: string) {
  if (consultantId) {
    const consultant = await prisma.consultant.findUnique({
      where: { id: consultantId },
      include: {
        consultations: true,
        reviews: true,
      },
    });
    if (consultant) return consultant;
  }
  // フォールバック: 最初のConsultant
  return await prisma.consultant.findFirst({
    include: {
      consultations: true,
      reviews: true,
    },
  });
}

export default async function ConsultantProfileEditPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; consultantId?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const consultant = await getCurrentConsultant(resolvedSearchParams?.consultantId);
  
  if (!consultant) return <div>コンサルタントデータがありません</div>;

  // 型安全な変換を使用
  const currentRoles = parseStringArray(consultant.expertiseRoles);
  const currentCompanyTypes = parseStringArray(consultant.expertiseCompanyTypes);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">プロフィール編集</h2>
        <p className="text-sm text-gray-600 mb-1">
          このプロフィールは、{' '}
          <Link
            href={`/consultants/${consultant.id}`}
            target="_blank"
            className="text-blue-700 hover:underline"
          >
            /consultants/{consultant.id}
          </Link>{' '}
          にそのまま表示されます。
        </p>
        <p className="text-xs text-gray-500 mb-2">
          このページで編集した内容は、あなたの公開プロフィール（/consultants/[id]）に反映されます。
        </p>
        {resolvedSearchParams?.saved === '1' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
            保存しました
          </div>
        )}
      </div>

      <form action={updateConsultantProfile} className="space-y-6">
        <input type="hidden" name="consultantId" value={consultant.id} />

        {/* 基本情報 */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">基本情報</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Email（任意）</label>
              <input
                name="email"
                type="email"
                defaultValue={(consultant as any).email || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="consultant@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">認証・ログイン用（認証導入時に必須化予定）</p>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">名前 *</label>
              <input
                name="name"
                required
                defaultValue={consultant.name}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：山田太郎"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">肩書き</label>
              <input
                name="headline"
                defaultValue={consultant.headline || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：元大手人事／スタートアップ採用支援"
              />
              <p className="text-xs text-gray-500 mt-1">一言で自分の経歴や専門性を表現してください</p>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">サムネイル画像URL</label>
              <input
                name="thumbnailUrl"
                type="url"
                defaultValue={consultant.thumbnailUrl || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">顔写真やプロフィール画像のURLを入力してください</p>
            </div>
          </div>
        </div>

        {/* 検索軸プロフィール */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">検索軸プロフィール</h3>
          <p className="text-xs text-gray-500 mb-4">検索・マッチングに使用される基本情報です</p>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">年代 *</label>
              <select
                name="ageRange"
                required
                defaultValue={(consultant as any).ageRange || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="20s_early">20代前半</option>
                <option value="20s_late">20代後半</option>
                <option value="30s_early">30代前半</option>
                <option value="30s_late">30代後半</option>
                <option value="40s_plus">40代以上</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">学歴（任意）</label>
              <select
                name="education"
                defaultValue={(consultant as any).education || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="high_school">高校卒業</option>
                <option value="vocational">専門学校卒業</option>
                <option value="university">大学卒業</option>
                <option value="graduate">大学院卒業</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">前職業界（任意）</label>
              <select
                name="previousIndustry"
                defaultValue={(consultant as any).previousIndustry || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="it_internet">IT・インターネット</option>
                <option value="saas_startup">SaaS / スタートアップ</option>
                <option value="mega_venture">メガベンチャー</option>
                <option value="manufacturing">製造業</option>
                <option value="finance">金融</option>
                <option value="consulting">コンサルティング</option>
                <option value="retail">小売・流通</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">前職職種（任意）</label>
              <select
                name="previousJobFunction"
                defaultValue={(consultant as any).previousJobFunction || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="engineer">エンジニア</option>
                <option value="pdm_pm">PM / PdM</option>
                <option value="designer">デザイナー</option>
                <option value="sales">営業</option>
                <option value="marketing">マーケティング</option>
                <option value="hr">人事</option>
                <option value="finance">経理・財務</option>
                <option value="consultant">コンサルタント</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">前職企業（任意、複数可）</label>
              <input
                name="previousCompanies"
                type="text"
                defaultValue={Array.isArray((consultant as any).previousCompanies) 
                  ? (consultant as any).previousCompanies.join(', ')
                  : ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：Google LLC, Microsoft Corporation"
              />
              <p className="text-xs text-gray-500 mt-1">カンマ区切りで複数の企業名を入力できます</p>
            </div>
          </div>
        </div>

        {/* タグ */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">タグ</h3>
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-sm">得意職種（既存フィールド）</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {EXPERTISE_ROLES.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="expertiseRoles"
                      value={role}
                      defaultChecked={currentRoles.includes(role)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-sm">得意な企業タイプ（既存フィールド）</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COMPANY_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="expertiseCompanyTypes"
                      value={type}
                      defaultChecked={currentCompanyTypes.includes(type)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-sm">得意業界 *（検索用、複数選択可）</label>
              <p className="text-xs text-gray-500 mb-2">検索・マッチングに使用されます</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'it_internet', label: 'IT・インターネット' },
                  { value: 'saas_startup', label: 'SaaS / スタートアップ' },
                  { value: 'mega_venture', label: 'メガベンチャー' },
                  { value: 'manufacturing', label: '製造業' },
                  { value: 'finance', label: '金融' },
                  { value: 'consulting', label: 'コンサルティング' },
                  { value: 'retail', label: '小売・流通' },
                  { value: 'other', label: 'その他' },
                ].map((industry) => (
                  <label
                    key={industry.value}
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="specialtyIndustries"
                      value={industry.value}
                      defaultChecked={Array.isArray((consultant as any).specialtyIndustries) 
                        ? (consultant as any).specialtyIndustries.includes(industry.value)
                        : false}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{industry.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-sm">得意職種 *（検索用、複数選択可）</label>
              <p className="text-xs text-gray-500 mb-2">検索・マッチングに使用されます</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'engineer', label: 'エンジニア' },
                  { value: 'pdm_pm', label: 'PM / PdM' },
                  { value: 'designer', label: 'デザイナー' },
                  { value: 'sales', label: '営業' },
                  { value: 'marketing', label: 'マーケティング' },
                  { value: 'hr', label: '人事' },
                  { value: 'finance', label: '経理・財務' },
                  { value: 'consultant', label: 'コンサルタント' },
                  { value: 'other', label: 'その他' },
                ].map((job) => (
                  <label
                    key={job.value}
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="specialtyJobFunctions"
                      value={job.value}
                      defaultChecked={Array.isArray((consultant as any).specialtyJobFunctions) 
                        ? (consultant as any).specialtyJobFunctions.includes(job.value)
                        : false}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{job.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* リンク系 */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">リンク</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">X（Twitter）プロフィールURL</label>
              <input
                name="twitterUrl"
                type="url"
                defaultValue={consultant.twitterUrl || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/your_handle"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">LinkedIn URL</label>
              <input
                name="linkedinUrl"
                type="url"
                defaultValue={consultant.linkedinUrl || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/your_profile"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">予約ページURL</label>
              <input
                name="schedulerUrl"
                type="url"
                defaultValue={consultant.schedulerUrl || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://timellex.com/your_page"
              />
              <p className="text-xs text-gray-500 mt-1">TimeLexなどの予約ページのURL</p>
            </div>
          </div>
        </div>

        {/* 自己申告実績 */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">自己申告実績</h3>
          <p className="text-xs text-gray-500 mb-4">これらの情報は検索・マッチングに使用されます。正確に入力してください。</p>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">キャリア年数 *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="selfReportedCareerYears"
                  min="0"
                  max="50"
                  required
                  defaultValue={(consultant as any).selfReportedCareerYears ?? consultant.experienceYears ?? ''}
                  className="border rounded-lg p-2.5 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">年</span>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">累計支援人数（任意）</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="selfReportedTotalSupports"
                  min="0"
                  defaultValue={(consultant as any).selfReportedTotalSupports ?? consultant.totalSupportCount ?? ''}
                  className="border rounded-lg p-2.5 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">名</span>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">累計転職成功数（任意）</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="selfReportedTotalPlacements"
                  min="0"
                  defaultValue={(consultant as any).selfReportedTotalPlacements || ''}
                  className="border rounded-lg p-2.5 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">名</span>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">平均年収（任意）</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="selfReportedAverageAnnualIncome"
                  min="0"
                  defaultValue={(consultant as any).selfReportedAverageAnnualIncome || ''}
                  className="border rounded-lg p-2.5 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">万円</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">※ 支援した方の平均年収</p>
            </div>
          </div>
        </div>

        {/* プラットフォーム実績（表示のみ） */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">プラットフォーム実績（表示のみ）</h3>
          <p className="text-xs text-gray-600 mb-4">これらの数値はCareerSelectプラットフォーム内の実績から自動計算されます。手動で編集することはできません。</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="text-xs text-gray-500 mb-1">プラットフォーム内相談数</div>
              <div className="text-2xl font-bold text-gray-900">
                {consultant.consultations?.filter(c => c.status === 'completed').length || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-xs text-gray-500 mb-1">プラットフォーム内転職成功数</div>
              <div className="text-2xl font-bold text-gray-900">
                {consultant.reviews?.filter(r => r.type === 'outcome' && r.isApproved).length || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-xs text-gray-500 mb-1">プラットフォーム内レビュー数</div>
              <div className="text-2xl font-bold text-gray-900">
                {consultant.reviews?.filter(r => r.isApproved).length || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-xs text-gray-500 mb-1">プラットフォーム内平均評価</div>
              <div className="text-2xl font-bold text-gray-900">
                {consultant.reviews && consultant.reviews.length > 0
                  ? (consultant.reviews.reduce((sum, r) => sum + r.score, 0) / consultant.reviews.length).toFixed(1)
                  : '0.0'}
              </div>
            </div>
          </div>
        </div>

        {/* 自己紹介テキスト */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">自己紹介テキスト</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">自己紹介（profileSummary）</label>
              <textarea
                name="profileSummary"
                rows={4}
                defaultValue={consultant.profileSummary || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="自分の専門性や経験を簡潔に説明してください"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">実績サマリー（achievementsSummary）</label>
              <textarea
                name="achievementsSummary"
                rows={3}
                defaultValue={consultant.achievementsSummary || ''}
                className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="主な実績や成果を簡潔に記載してください"
              />
            </div>
          </div>
        </div>

        {/* 将来の自動生成用エリア */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">将来的にプロフィール文を自動生成するエリア（仮）</h3>
          <p className="text-xs text-gray-600">
            今後、名前・Xリンク・タグの情報から、自己紹介や実績サマリーを自動生成する予定です。
          </p>
        </div>

        {/* 保存ボタンと公開ページ確認 */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/consultants/${consultant.id}`}
            target="_blank"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-sm font-medium"
          >
            公開ページを確認する →
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}
