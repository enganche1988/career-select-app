import Link from 'next/link';

const categories = [
  { name: '20代・第二新卒', icon: '🎓' },
  { name: 'ミドル・ハイクラス', icon: '💼' },
  { name: '大企業からスタートアップへ', icon: '🚀' },
  { name: 'スタートアップ経験者', icon: '⚡' },
  { name: '外資・グローバル', icon: '🌍' },
  { name: 'ワーママ/ワーパパ支援', icon: '👨‍👩‍👧' },
];

export default function CategorySection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          どんなコンサルタントがいるか
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-6 md:overflow-visible">
          {categories.map((category, index) => (
            <Link
              key={index}
              href="/consultants"
              className="flex flex-col items-center gap-3 min-w-[140px] md:min-w-0 p-4 rounded-xl hover:bg-gray-50 transition group"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-700 transition">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


