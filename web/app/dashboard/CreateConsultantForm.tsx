'use client';

import { useState } from 'react';
import { createConsultant } from './actions';

export default function CreateConsultantForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      await createConsultant(formData);
      // 成功時はServer Action内でリダイレクトされるため、ここには到達しない
    } catch (err: any) {
      setError(err.message || 'コンサルタントの作成に失敗しました');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-sm"
      >
        + 新規コンサルタント追加
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">新規コンサルタント追加</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例：山田太郎"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Email（任意）</label>
            <input
              name="email"
              type="email"
              className="border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="consultant@example.com"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              認証・ログイン用（認証導入時に必須化予定）
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '作成中...' : '作成する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

