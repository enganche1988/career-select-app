import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CareerSelect</h3>
            <p className="text-sm text-gray-400">
              キャリアコンサルタント個人を探して指名できる転職相談サービス
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">メニュー</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/consultants" className="text-gray-400 hover:text-white transition">
                  コンサルタント一覧
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                  コンサルタント用ダッシュボード
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">サービスについて</h4>
            <p className="text-sm text-gray-400">
              実績や口コミをもとに、自分に合うコンサルタントを比較・指名できます。
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2024 CareerSelect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


