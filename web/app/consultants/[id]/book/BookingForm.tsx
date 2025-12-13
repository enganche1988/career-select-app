import { createConsultationFromForm } from './actions';

type Props = {
  consultantId: string;
};

export default function BookingForm({ consultantId }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-3">相談方法と希望日時を送る</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        このコンサルタントとは、アプリ内のフォームから希望日時を送って日程調整を行います。後ほどコンサルタントから、メールなどで日程確定のご連絡を差し上げます。
      </p>
      <form action={createConsultationFromForm} className="space-y-6">
        <input type="hidden" name="consultantId" value={consultantId} />
        
        {/* 相談方法 */}
        <div>
          <label className="block mb-2 font-semibold text-gray-900">相談方法 *</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="meetingMethod"
                value="zoom"
                required
                defaultChecked
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">オンライン（Zoom / Google Meet など）</span>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="meetingMethod"
                value="phone"
                required
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">電話</span>
            </label>
          </div>
        </div>
        
        {/* 希望日時 */}
        <div>
          <label htmlFor="preferredTimes" className="block mb-2 font-semibold text-gray-900">
            希望日時（第1希望〜第2希望くらいまで） *
          </label>
          <textarea
            id="preferredTimes"
            name="preferredTimes"
            rows={3}
            required
            placeholder="第1希望：◯月◯日（◯）19:00〜 / 第2希望：◯月◯日（◯）20:00〜"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            複数の希望日時がある場合は、すべて記入してください。
          </p>
        </div>
        
        {/* 相談したい内容 */}
        <div>
          <label htmlFor="theme" className="block mb-2 font-semibold text-gray-900">
            相談したい内容 *
          </label>
          <textarea
            id="theme"
            name="theme"
            rows={5}
            required
            placeholder="現在のご状況や、気になっていることを簡単に教えてください。"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* 補足メモ（任意） */}
        <div>
          <label htmlFor="note" className="block mb-2 font-semibold text-gray-900">
            補足メモ（任意）
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder="その他、伝えておきたいことがあれば記入してください"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full px-6 py-4 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
        >
          この内容で相談を申し込む
        </button>
      </form>
    </div>
  );
}

