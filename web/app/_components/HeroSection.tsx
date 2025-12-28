import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="w-full relative py-24 md:py-32 overflow-hidden">
      {/* 背景レイヤー：Canva風の絵作り */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* ベース：白基調の背景 */}
        <div className="absolute inset-0 bg-slate-50" />
        
        {/* 薄いlinear-gradient + radial-gradientの組み合わせ（ふわっとした空気） */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(241, 245, 249, 0.9) 0%, rgba(241, 245, 249, 1) 50%, rgba(241, 245, 249, 0.95) 100%),
              radial-gradient(circle at 50% 20%, rgba(148, 163, 184, 0.08) 0%, rgba(241, 245, 249, 0.6) 40%, rgba(241, 245, 249, 1) 80%)
            `,
          }}
        />
        
        {/* 巨大な円弧（半円）1：右上 */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-200/20 via-blue-100/12 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        {/* 巨大な円弧（半円）2：左下 */}
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-slate-300/18 via-blue-200/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        {/* 巨大な円弧（半円）3：左上 */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-slate-200/15 via-blue-100/8 to-transparent rounded-full -translate-y-1/3 -translate-x-1/3 blur-3xl" />
        
        {/* 角に装飾ドット（小さな円）1：右上 */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-blue-600/30 rounded-full blur-sm" />
        <div className="absolute top-8 right-8 w-12 h-12 bg-blue-700/25 rounded-full blur-sm" />
        
        {/* 角に装飾ドット（小さな円）2：左下 */}
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-blue-600/25 rounded-full blur-sm" />
        
        {/* 角に装飾ドット（小さな円）3：右下 */}
        <div className="absolute bottom-6 right-6 w-14 h-14 bg-blue-700/20 rounded-full blur-sm" />
        
        {/* ノイズテクスチャ（うっすら） */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>
      
      {/* コンテンツ */}
      <div className="relative max-w-4xl mx-auto px-6 z-10">
        {/* 見出し */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.3] tracking-tight mb-6">
            キャリアの悩みを、人の回答で選ぶ。
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-10">
            匿名の質問に、複数のキャリアコンサルタントが公開で答えます。
          </p>
          
          {/* CTAボタン（2つのみ） */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/questions/new"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 via-emerald-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:from-emerald-700 hover:via-emerald-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              質問してみる
            </Link>
            <Link
              href="/questions"
              className="inline-block px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-2xl font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-sm"
            >
              Q&Aを見る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
