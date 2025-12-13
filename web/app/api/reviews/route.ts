import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * POST /api/reviews
 * レビューを投稿する
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // リクエストボディのバリデーション
    const {
      consultantId,
      reviewType,
      ageRange,
      jobCategory,
      industry,
      companySize,
      consultationSituation,
      outcome,
      satisfaction,
      goodPoints,
      improvementPoints,
      twitterUrl,
      noteUrl,
      showSnsLink,
    } = body;

    // 必須フィールドのチェック
    if (!consultantId || !reviewType || !satisfaction || !goodPoints) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // コンサルタントの存在確認
    const consultant = await prisma.consultant.findUnique({
      where: { id: consultantId },
    });

    if (!consultant) {
      return NextResponse.json(
        { error: '指定されたコンサルタントが見つかりません' },
        { status: 404 }
      );
    }

    // スコアの変換と検証
    const score = parseInt(satisfaction, 10);
    if (isNaN(score) || score < 1 || score > 5) {
      return NextResponse.json(
        { error: '評価は1から5の間で指定してください' },
        { status: 400 }
      );
    }

    // meta情報の構築
    const meta = {
      ageRange,
      jobCategory,
      industry,
      companySize,
      consultationSituation,
      outcome,
      improvementPoints: improvementPoints || null,
      twitterUrl: twitterUrl || null,
      noteUrl: noteUrl || null,
      showSnsLink: showSnsLink || false,
    };

    // レビューを作成（isApproved = false で保存）
    const review = await prisma.review.create({
      data: {
        consultantId,
        type: reviewType,
        score,
        comment: goodPoints,
        meta,
        isApproved: false, // 運営承認待ち
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'レビューを受け付けました。内容は運営が確認のうえ掲載されます。',
        reviewId: review.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('レビュー投稿エラー:', error);
    return NextResponse.json(
      { error: 'レビューの投稿に失敗しました' },
      { status: 500 }
    );
  }
}
