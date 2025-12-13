/**
 * Canva風の背景レイヤーコンポーネント
 * 薄いグラデーション + 巨大な円弧（半円） + 装飾ドットで"Canvaっぽい空気"を作る
 */
export default function CanvaBackground({ variant = 'default' }: { variant?: 'default' | 'light' | 'accent' }) {
  const baseColorClass = variant === 'light' ? 'bg-slate-50' : variant === 'accent' ? 'bg-blue-50' : 'bg-slate-50';
  
  // アクセントカラーのクラスを決定（Tailwindの動的クラス名問題を回避）
  const accent200 = variant === 'accent' ? 'from-blue-200' : 'from-slate-200';
  const accent300 = variant === 'accent' ? 'from-blue-300' : 'from-slate-300';
  const accent100 = variant === 'accent' ? 'from-blue-100' : 'from-slate-100';
  const accent50 = variant === 'accent' ? 'via-blue-50' : 'via-slate-50';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* ベース：白基調の背景 */}
      <div className={`absolute inset-0 ${baseColorClass}`} />
      
      {/* 薄い放射状グラデーション（中央から外側へ） */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(148, 163, 184, 0.12) 0%, rgba(241, 245, 249, 0.7) 50%, rgba(241, 245, 249, 1) 100%)`,
        }}
      />
      
      {/* ノイズテクスチャ（うっすら） */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
      
      {/* 装飾ドット（うっすら） */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(100, 116, 139, 0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* 円形ブラー要素1：右上（大きめ、くすんだブルー） */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${accent200}/25 via-slate-300/18 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl`} />
      
      {/* 円形ブラー要素2：左下（中サイズ、くすんだブルー） */}
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr ${accent300}/20 via-slate-400/15 to-transparent rounded-full translate-y-1/4 -translate-x-1/4 blur-3xl`} />
      
      {/* 円形ブラー要素3：左上（中サイズ、くすんだブルー/グレー） */}
      <div className={`absolute top-0 left-0 w-[450px] h-[450px] bg-gradient-to-br from-slate-400/15 ${accent200}/12 to-transparent rounded-full -translate-y-1/4 -translate-x-1/4 blur-3xl`} />
      
      {/* 円形ブラー要素4：右下（小さめ、くすんだブルー） */}
      <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl ${accent200}/20 via-slate-300/15 to-transparent rounded-full translate-y-1/3 translate-x-1/3 blur-2xl`} />
      
      {/* 円弧・曲線的な印象を出すための追加レイヤー */}
      {/* 右上：楕円形の曲線要素 */}
      <div className={`absolute top-0 right-0 w-[700px] h-[500px] bg-gradient-to-bl ${accent100}/15 via-transparent to-transparent rounded-full -translate-y-1/4 translate-x-1/4 blur-3xl`} />
      
      {/* 左下：楕円形の曲線要素 */}
      <div className={`absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr ${accent200}/15 via-transparent to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl`} />
      
      {/* 斜めグラデーションレイヤー（奥行き追加、控えめに） */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${accent50}/8 to-slate-200/10`} />
    </div>
  );
}

