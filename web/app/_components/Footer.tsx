import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-3xl font-bold mb-5">CareerSelect</h3>
            <p className="text-base text-gray-300 leading-relaxed">
              キャリアコンサルタント個人を探して指名できる転職相談サービス
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-5">サービスについて</h4>
            <p className="text-base text-gray-300 leading-relaxed">
              実績や口コミをもとに、自分に合うコンサルタントを比較・指名できます。
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-gray-400">
          <p>© 2024 CareerSelect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


