'use client';

import { useState } from 'react';

type Props = {
  consultantId: string;
};

export default function ReviewForm({ consultantId }: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    reviewType: 'consultation',
    ageRange: '',
    jobCategory: '',
    industry: '',
    companySize: '',
    consultationSituation: '',
    outcome: '',
    satisfaction: '',
    goodPoints: '',
    improvementPoints: '',
    twitterUrl: '',
    noteUrl: '',
    showSnsLink: false,
    agreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // APIにレビューを送信
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultantId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'レビューの送信に失敗しました');
      }

      // 送信成功
      setIsSubmitted(true);
    } catch (error) {
      console.error('レビュー送信エラー:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'レビューの送信に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* (1) レビュー種別 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">レビューの種類</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="reviewType"
              value="consultation"
              checked={formData.reviewType === 'consultation'}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">キャリア相談の感想（相談レビュー）</span>
          </label>
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="reviewType"
              value="outcome"
              checked={formData.reviewType === 'outcome'}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">転職支援全体の振り返り（転職レビュー）</span>
          </label>
        </div>
      </section>

      {/* (2) あなたの属性 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">
          あなたの属性（公開されるのはこの情報までです）
        </h2>

        {/* 年代 */}
        <div>
          <label htmlFor="ageRange" className="block mb-2 font-semibold text-gray-900">
            年代 <span className="text-red-500">*</span>
          </label>
          <select
            id="ageRange"
            name="ageRange"
            value={formData.ageRange}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            <option value="20s_early">20代前半</option>
            <option value="20s_late">20代後半</option>
            <option value="30s_early">30代前半</option>
            <option value="30s_late">30代後半</option>
            <option value="40s_plus">40代以上</option>
          </select>
        </div>

        {/* 職種 */}
        <div>
          <label htmlFor="jobCategory" className="block mb-2 font-semibold text-gray-900">
            現在（または当時）の職種 <span className="text-red-500">*</span>
          </label>
          <select
            id="jobCategory"
            name="jobCategory"
            value={formData.jobCategory}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            <option value="engineer">エンジニア</option>
            <option value="designer">デザイナー</option>
            <option value="pdm_pm">PM / PdM</option>
            <option value="sales">営業</option>
            <option value="cs">カスタマーサクセス</option>
            <option value="hr_recruiting">人事・採用</option>
            <option value="accounting_finance">経理・財務</option>
            <option value="consultant">コンサルタント</option>
            <option value="other">その他</option>
          </select>
        </div>

        {/* 業界 */}
        <div>
          <label htmlFor="industry" className="block mb-2 font-semibold text-gray-900">
            業界 <span className="text-red-500">*</span>
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            <option value="it_internet">IT・インターネット</option>
            <option value="saas_startup">SaaS / スタートアップ</option>
            <option value="mega_venture">メガベンチャー</option>
            <option value="manufacturing">製造業</option>
            <option value="hr_consulting">人材・コンサル</option>
            <option value="finance">金融</option>
            <option value="advertising_media">広告・メディア</option>
            <option value="other_service">その他サービス</option>
            <option value="other">その他</option>
          </select>
        </div>

        {/* 会社規模 */}
        <div>
          <label htmlFor="companySize" className="block mb-2 font-semibold text-gray-900">
            会社規模 <span className="text-red-500">*</span>
          </label>
          <select
            id="companySize"
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            <option value="large">大企業（1000名以上）</option>
            <option value="mega_venture">メガベンチャー（300〜1000名）</option>
            <option value="startup">スタートアップ（〜300名）</option>
            <option value="sme">中小企業</option>
            <option value="foreign">外資系企業</option>
            <option value="freelance">フリーランス / 個人事業</option>
          </select>
        </div>

        {/* 相談時のご状況 */}
        <div>
          <label htmlFor="consultationSituation" className="block mb-2 font-semibold text-gray-900">
            相談時のご状況 <span className="text-red-500">*</span>
          </label>
          <select
            id="consultationSituation"
            name="consultationSituation"
            value={formData.consultationSituation}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            <option value="first_change">初めての転職活動</option>
            <option value="second_third_change">2〜3回目の転職活動</option>
            <option value="hesitating">転職するかどうか迷っていた</option>
            <option value="career_anxiety">現職でのキャリアに不安があった</option>
            <option value="salary_conditions">年収・条件を上げたかった</option>
            <option value="work_style">働き方（リモート / 時短など）を変えたかった</option>
          </select>
        </div>

        {/* 転職結果 */}
        <div>
          <label htmlFor="outcome" className="block mb-2 font-semibold text-gray-900">
            最終的な結果 <span className="text-red-500">*</span>
          </label>
          <select
            id="outcome"
            name="outcome"
            value={formData.outcome}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            <option value="stayed">今回は転職せず、現職にとどまった</option>
            <option value="in_progress">選考中（まだ転職活動の途中）</option>
            <option value="changed">このコンサルの支援で転職が決まった</option>
          </select>
        </div>
      </section>

      {/* (3) 評価 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">評価</h2>
        <div>
          <label htmlFor="satisfaction" className="block mb-2 font-semibold text-gray-900">
            全体の満足度 <span className="text-red-500">*</span>
          </label>
          <select
            id="satisfaction"
            name="satisfaction"
            value={formData.satisfaction}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            <option value="1">★1（不満）</option>
            <option value="2">★2</option>
            <option value="3">★3（普通）</option>
            <option value="4">★4</option>
            <option value="5">★5（とても満足）</option>
          </select>
        </div>
      </section>

      {/* (4) コメント */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">コメント</h2>
        <div>
          <label htmlFor="goodPoints" className="block mb-2 font-semibold text-gray-900">
            相談・支援を通して「良かった」と感じた点があれば教えてください。 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="goodPoints"
            name="goodPoints"
            value={formData.goodPoints}
            onChange={handleChange}
            required
            rows={5}
            placeholder="例：自分では気づいていなかった強みを言語化してもらえた／転職しない選択肢も含めてフラットに話してもらえた など"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="improvementPoints" className="block mb-2 font-semibold text-gray-900">
            気になった点や、もっと良くなると思う点があれば教えてください。（任意）
          </label>
          <textarea
            id="improvementPoints"
            name="improvementPoints"
            value={formData.improvementPoints}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </section>

      {/* (5) SNSアカウント（任意） */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">任意のSNSアカウント</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          任意で、SNSアカウントを教えていただければ、「実在する方からのレビュー」として信頼性の参考になります。実名やアカウント名は、そのまま公開せずに運営確認のみに利用することも可能です。
        </p>
        <div>
          <label htmlFor="twitterUrl" className="block mb-2 font-semibold text-gray-900">
            X（旧Twitter）アカウントURL or @ID
          </label>
          <input
            type="text"
            id="twitterUrl"
            name="twitterUrl"
            value={formData.twitterUrl}
            onChange={handleChange}
            placeholder="@username または https://twitter.com/username"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="noteUrl" className="block mb-2 font-semibold text-gray-900">
            note / ブログURL
          </label>
          <input
            type="url"
            id="noteUrl"
            name="noteUrl"
            value={formData.noteUrl}
            onChange={handleChange}
            placeholder="https://note.com/username など"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="showSnsLink"
            checked={formData.showSnsLink}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">このSNSアカウントへのリンクをレビューに表示してもよい</span>
        </label>
      </section>

      {/* (6) 同意 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreed"
            checked={formData.agreed}
            onChange={handleChange}
            required
            className="w-5 h-5 mt-0.5 text-blue-600 focus:ring-blue-500 flex-shrink-0"
          />
          <span className="text-sm text-gray-700">
            利用規約とプライバシーポリシーに同意し、この内容がCareerSelect上に掲載されることに同意します。（実名やメールアドレスは一切掲載されません）
            <span className="text-red-500"> *</span>
          </span>
        </label>
      </section>

      {/* (7) 送信ボタン */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting || isSubmitted}
          className="px-8 py-4 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '送信中...' : isSubmitted ? '送信完了' : 'この内容でレビューを送信する'}
        </button>
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-800 font-semibold mb-2">エラーが発生しました</p>
          <p className="text-sm text-gray-700">{errorMessage}</p>
        </div>
      )}

      {/* 送信後のメッセージ */}
      {isSubmitted && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 font-semibold mb-2">
            レビューを受け付けました
          </p>
          <p className="text-sm text-gray-700">
            内容は運営が確認のうえ掲載されます。貴重なご意見をありがとうございました。
          </p>
        </div>
      )}
    </form>
  );
}


