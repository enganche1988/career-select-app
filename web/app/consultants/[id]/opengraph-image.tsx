import { ImageResponse } from '@vercel/og';
import { prisma } from '@/lib/prisma';

// 画像サイズ: OGP標準サイズ
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;

    // コンサルタント情報とレビューを取得
    const consultant = await prisma.consultant.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { isApproved: true },
        },
      },
    });

    if (!consultant) {
      // コンサルタントが見つからない場合はデフォルト画像を返す
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9fafb',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ fontSize: 32, color: '#6b7280' }}>CareerSelect</div>
          </div>
        ),
        { ...size }
      );
    }

    // 平均スコア計算
    const approvedReviews = consultant.reviews.filter(r => r.isApproved);
    const avgScore = approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.score, 0) / approvedReviews.length).toFixed(1)
      : '0.0';

    // 代表的なレビューを抽出（スコアが高い順、コメントが短めのもの）
    const representativeReview = approvedReviews
      .filter(r => r.comment && r.comment.length > 0)
      .sort((a, b) => {
        // スコアが高い順、同じスコアならコメントが短い順（一言コメント向き）
        if (b.score !== a.score) return b.score - a.score;
        return a.comment.length - b.comment.length;
      })[0];

    // レビューコメントを1行に整形（長すぎる場合は省略）
    const reviewComment = representativeReview
      ? representativeReview.comment
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 80) + (representativeReview.comment.length > 80 ? '...' : '')
      : '';

    // 支援実績数（totalSupportCountが0の場合は、完了した相談数をカウント）
    let supportCount = consultant.totalSupportCount;
    if (supportCount === 0) {
      try {
        supportCount = await prisma.consultation.count({
          where: {
            consultantId: id,
            status: 'completed',
          },
        });
      } catch (error) {
        // カウント取得に失敗した場合は0のまま
        supportCount = 0;
      }
    }

    return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb', // 薄いグレー背景
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* 左上: CareerSelect ロゴ */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            fontSize: 32,
            fontWeight: 'bold',
            color: '#1e40af', // 青
          }}
        >
          CareerSelect
        </div>

        {/* 中央: 評価スコア */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 120, color: '#fbbf24' }}>★</span>
            <span
              style={{
                fontSize: 120,
                fontWeight: 'bold',
                color: '#111827',
              }}
            >
              {avgScore}
            </span>
          </div>

          {/* 一言コメント */}
          {reviewComment && (
            <div
              style={{
                fontSize: 32,
                color: '#374151',
                textAlign: 'center',
                maxWidth: 900,
                lineHeight: 1.4,
                paddingLeft: 60,
                paddingRight: 60,
              }}
            >
              「{reviewComment}」
            </div>
          )}
        </div>

        {/* 下部: 支援実績とコンサルタント名 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 60,
            paddingRight: 60,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: '#6b7280',
            }}
          >
            支援実績：{supportCount}名
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#111827',
            }}
          >
            {consultant.name}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
  } catch (error) {
    // エラーが発生した場合はデフォルト画像を返す
    console.error('OGP画像生成エラー:', error);
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ fontSize: 32, color: '#6b7280' }}>CareerSelect</div>
        </div>
      ),
      { ...size }
    );
  }
}

