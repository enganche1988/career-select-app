import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Consultant, Review } from '@prisma/client';
import { getMockConsultants, type ConsultantWithReviews } from '@/lib/mockData';

// 星評価を表示するコンポーネント
function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

// コンサルタントプロフィールカード（吹き出し風）
function ConsultantCard({ consultant }: { consultant: ConsultantWithReviews }) {
  const avgScore = consultant.reviews.length > 0
    ? consultant.reviews.reduce((sum, r) => sum + r.score, 0) / consultant.reviews.length
    : 5.0; // レビューがない場合は5.0を表示

  // 説明文（headlineまたはprofileSummaryを使用）
  const description = consultant.headline || consultant.profileSummary || consultant.bio || '';

  return (
    <Link
      href={`/consultants/${consultant.id}`}
      className="block bg-white rounded-3xl shadow-md border border-gray-100/80 p-8 hover:shadow-xl hover:border-gray-200/60 transition-all duration-300 group"
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="flex flex-col items-center text-center">
        {/* プロフィール画像 */}
        <div className="mb-5">
          {consultant.thumbnailUrl ? (
            <img
              src={consultant.thumbnailUrl}
              alt={consultant.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-50 shadow-sm"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 via-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-sm">
              {consultant.name.charAt(0)}
            </div>
          )}
        </div>
        {/* 名前 */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition">
          {consultant.name}
        </h3>
        {/* 星評価 */}
        <div className="mb-4">
          <StarRating score={Math.round(avgScore)} />
        </div>
        {/* 説明文 */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default async function HeroSection() {
  // 上位4名のコンサルタントを取得
  let consultants: ConsultantWithReviews[] = [];
  
  try {
    const result = await prisma.consultant.findMany({
      include: {
        reviews: true,
      },
      take: 4,
    });
    consultants = result as ConsultantWithReviews[];
  } catch (error) {
    console.error('データベース接続エラー:', error);
    // DB接続失敗時はダミーデータを使用
    consultants = getMockConsultants().slice(0, 4);
  }

  // 4名に満たない場合は空のカードを表示
  const topRowConsultants = consultants.slice(0, 2);
  const bottomRowConsultants = consultants.slice(2, 4);

  return (
    <section className="w-full relative py-24 md:py-36 overflow-hidden">
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
      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {/* 見出し */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.3] tracking-tight mb-6">
            転職は"誰に"相談するかで決まる
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            大手エージェントでは担当者を選べません。
            <br className="hidden md:block" />
            CareerSelect は、実績・口コミ・人柄から「相談相手を指名できる」転職相談サービスです。
          </p>
        </div>

        {/* 上段：2つのコンサルタントカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {topRowConsultants.map((consultant) => (
            <ConsultantCard key={consultant.id} consultant={consultant} />
          ))}
          {/* データが不足している場合は空のカードを表示 */}
          {topRowConsultants.length < 2 && (
            <div className="bg-white rounded-3xl shadow-md border border-gray-100/80 p-8 opacity-50">
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full bg-gray-200 mb-5" />
                <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
                <div className="h-16 w-full bg-gray-100 rounded" />
              </div>
            </div>
          )}
        </div>

        {/* 中央：検索ボタン（横長で丸く、上品なグラデ＋柔らかい影） */}
        <div className="text-center mb-8 md:mb-10">
          <Link
            href="/consultants"
            className="inline-block w-full max-w-3xl mx-auto px-16 py-6 bg-gradient-to-r from-emerald-600 via-emerald-600 to-blue-600 text-white rounded-3xl font-bold text-xl md:text-2xl hover:from-emerald-700 hover:via-emerald-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
            style={{
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25), 0 4px 8px rgba(16, 185, 129, 0.15)',
            }}
          >
            コンサルタントを検索
          </Link>
        </div>

        {/* 下段：2つのコンサルタントカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {bottomRowConsultants.map((consultant) => (
            <ConsultantCard key={consultant.id} consultant={consultant} />
          ))}
          {/* データが不足している場合は空のカードを表示 */}
          {bottomRowConsultants.length < 2 && (
            <div className="bg-white rounded-3xl shadow-md border border-gray-100/80 p-8 opacity-50">
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full bg-gray-200 mb-5" />
                <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
                <div className="h-16 w-full bg-gray-100 rounded" />
              </div>
            </div>
          )}
        </div>

        {/* 最下部：テキスト */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-relaxed">
            エージェント会社に問い合わせても担当者は選べない
          </p>
        </div>
      </div>
    </section>
  );
}

