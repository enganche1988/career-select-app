import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          転職は、誰に相談するかで決まる。
          <br className="hidden md:block" />
          <span className="text-blue-700">だから、キャリアコンサルタントを"選ぶ"。</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          大手エージェントでは担当者を選べません。
          <br />
          CareerSelect は、実績・口コミ・人柄から「相談相手を指名できる」転職相談サービスです。
        </p>
        <Link
          href="/consultants"
          className="inline-block px-8 py-4 bg-blue-700 text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
        >
          コンサルタントを探す
        </Link>
      </div>
    </section>
  );
}

