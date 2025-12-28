/**
 * 質問投稿ページ（仮置き実装）
 * TODO: 実際の質問投稿機能を実装する
 */

import Link from 'next/link';

export default function NewQuestionPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">質問を投稿する</h1>
        <p className="text-gray-600 mb-8">
          この機能は現在準備中です。質問投稿機能は今後実装予定です。
        </p>
        <div className="flex gap-4">
          <Link
            href="/questions"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Q&A一覧に戻る
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

