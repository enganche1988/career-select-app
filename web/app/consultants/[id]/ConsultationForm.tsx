'use client';

import { useState } from 'react';
import { createConsultation } from './actions';

type Props = {
  consultantId: string;
  timelexUrl?: string | null;
};

export default function ConsultationForm({ consultantId, timelexUrl }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const result = await createConsultation(formData);
      if (result?.error) {
        setMessage(result.error);
      } else {
        setMessage('相談リクエストを受け付けました（デモ用）');
        setShowForm(false);
        // フォームをリセット
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) form.reset();
      }
    } catch (error) {
      setMessage('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
          {message}
        </div>
      )}
      
      {timelexUrl && (
        <div className="mb-4">
          <a
            href={timelexUrl}
            target="_blank"
            rel="noopener"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded font-bold mb-2 hover:bg-blue-700 transition"
          >
            TimeLexで日程を選ぶ（別タブで開く）
          </a>
          <p className="text-xs text-gray-500">※ 日程調整は外部サービス TimeLex 上で行います。</p>
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
        >
          このコンサルタントに相談予約する
        </button>
      ) : (
        <form action={handleSubmit} className="space-y-4 max-w-md border p-4 rounded-lg bg-white">
          <input type="hidden" name="consultantId" value={consultantId} />
          
          <div>
            <label className="block mb-1 font-semibold text-sm">希望日時</label>
            <input
              type="datetime-local"
              name="scheduledAt"
              required
              className="border rounded p-2 w-full text-sm"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-semibold text-sm">相談したいテーマ</label>
            <textarea
              name="theme"
              rows={3}
              required
              placeholder="例）エンジニア転職について相談したいです"
              className="border rounded p-2 w-full text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? '送信中...' : '予約を送信'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setMessage(null);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50 transition"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
      
      <p className="text-xs text-gray-500 mt-2">※ 現状はデモのため、固定のダミーユーザーで予約されます</p>
    </div>
  );
}

