import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="w-full px-4 sm:px-8 py-3 shadow bg-white mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-blue-700">CareerSelect</Link>
          <nav className="mt-2 sm:mt-0 flex gap-4 text-base flex-wrap">
            <Link href="/consultants" className="hover:text-blue-700 font-medium">コンサルタント一覧</Link>
            <Link href="/dashboard" className="hover:text-blue-700 font-medium">コンサルタント用ダッシュボード</Link>
            <Link href="/dashboard/profile" className="hover:text-blue-700 font-medium">プロフィール編集</Link>
            <Link href="/consultant/login" className="hover:text-blue-700 font-medium">コンサルタントログイン</Link>
          </nav>
        </header>
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
