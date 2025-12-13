'use client';

import { useState } from 'react';
import Link from 'next/link';

type ReviewProps = {
  review: {
    id: string;
    consultant: {
      id: string;
      name: string;
    };
    type: string;
    typeLabel: string;
    typeBgColor: string;
    score: number;
    comment: string;
    metaText: string;
    meta: any;
    createdAt: string;
  };
};

export default function ReviewApprovalCard({ review }: ReviewProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleApprove = async () => {
    if (!confirm('このレビューを承認しますか？')) {
      return;
    }

    setIsApproving(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/reviews/${review.id}/approve`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '承認に失敗しました');
      }

      // 承認成功
      setIsApproved(true);
    } catch (error) {
      console.error('承認エラー:', error);
      setErrorMessage(
        error instanceof Error ? error.message : '承認に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${
      isApproved ? 'border-green-300 bg-green-50' : 'border-gray-200'
    } p-6 transition-all`}>
      {/* ヘッダー: コンサルタント名とレビュー種別 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href={`/consultants/${review.consultant.id}`}
              className="text-lg font-bold text-gray-900 hover:text-blue-600 transition"
            >
              {review.consultant.name}
            </Link>
            <span className={`inline-block px-2 py-1 ${review.typeBgColor} rounded text-xs font-medium`}>
              {review.typeLabel}
            </span>
          </div>
          {review.metaText && (
            <p className="text-sm text-gray-600">{review.metaText}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            投稿日時: {new Date(review.createdAt).toLocaleString('ja-JP')}
          </p>
        </div>
      </div>

      {/* スコア */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-400 text-xl">{'★'.repeat(review.score)}</span>
        <span className="text-gray-600 text-sm">（{review.score}/5）</span>
      </div>

      {/* コメント */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">良かった点</h3>
        <p className="text-gray-800 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
          {review.comment}
        </p>
      </div>

      {/* 改善点（ある場合） */}
      {review.meta?.improvementPoints && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">改善してほしい点</h3>
          <p className="text-gray-800 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
            {review.meta.improvementPoints}
          </p>
        </div>
      )}

      {/* 詳細情報（折りたたみ可能） */}
      <details className="mb-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
          詳細情報を表示
        </summary>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm space-y-2">
          <div>
            <span className="font-semibold text-gray-700">相談時の状況:</span>{' '}
            <span className="text-gray-600">{review.meta?.consultationSituation || '未記入'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">最終的な結果:</span>{' '}
            <span className="text-gray-600">{review.meta?.outcome || '未記入'}</span>
          </div>
          {review.meta?.twitterUrl && (
            <div>
              <span className="font-semibold text-gray-700">X (Twitter):</span>{' '}
              <a
                href={review.meta.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {review.meta.twitterUrl}
              </a>
            </div>
          )}
          {review.meta?.noteUrl && (
            <div>
              <span className="font-semibold text-gray-700">note / ブログ:</span>{' '}
              <a
                href={review.meta.noteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {review.meta.noteUrl}
              </a>
            </div>
          )}
          <div>
            <span className="font-semibold text-gray-700">SNSリンク表示:</span>{' '}
            <span className="text-gray-600">
              {review.meta?.showSnsLink ? 'OK' : 'NG'}
            </span>
          </div>
        </div>
      </details>

      {/* エラーメッセージ */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* 承認ボタン */}
      {isApproved ? (
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-center">
          <p className="text-green-800 font-semibold">✓ 承認済み</p>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isApproving ? '承認中...' : '✓ 承認する'}
          </button>
          <button
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            onClick={() => alert('削除機能は未実装です')}
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
}
