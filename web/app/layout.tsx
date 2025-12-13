import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="w-full px-4 sm:px-8 py-3 shadow bg-white mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-blue-700">CareerSelect</Link>
          {/* 公開ユーザー向け画面ではナビリンクを非表示（初期フェーズではLP的な体験を優先） */}
          <nav className="hidden">
            <Link href="/consultants" className="hover:text-blue-700 font-medium">コンサルタント一覧</Link>
            {/* 管理画面へのリンクは公開導線から削除（方針5: 画面分離） */}
          </nav>
        </header>
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
