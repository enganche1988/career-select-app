'use client';

import { createConsultationFromTimeRex } from './actions';

type Props = {
  schedulerUrl: string;
  consultantId: string;
};

export default function TimeRexButton({ schedulerUrl, consultantId }: Props) {
  async function handleSubmit(formData: FormData) {
    // TimeRexを新しいタブで開く
    window.open(schedulerUrl, '_blank', 'noopener,noreferrer');
    
    // サーバーアクションを実行
    await createConsultationFromTimeRex(formData);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="consultantId" value={consultantId} />
      <input type="hidden" name="schedulerUrl" value={schedulerUrl} />
      <button
        type="submit"
        className="w-full px-6 py-4 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
      >
        TimeRexで日程を選ぶ
      </button>
      <p className="text-xs text-gray-500 text-center">
        このボタンを押すと、アプリ内に予約リクエストが記録され、TimeRexの画面が開きます。
      </p>
    </form>
  );
}

