import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <Link
          href="/consultants"
          className="inline-block px-12 py-5 bg-blue-700 text-white rounded-lg font-bold text-xl hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
        >
          コンサルタント一覧を見る
        </Link>
      </div>
    </section>
  );
}


