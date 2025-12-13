import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * PATCH /api/reviews/[id]/approve
 * レビューを承認する（isApproved を true に更新）
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // レビューの存在確認
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { error: '指定されたレビューが見つかりません' },
        { status: 404 }
      );
    }

    // すでに承認済みの場合
    if (review.isApproved) {
      return NextResponse.json(
        { message: 'このレビューはすでに承認済みです' },
        { status: 200 }
      );
    }

    // レビューを承認
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isApproved: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'レビューを承認しました',
        review: updatedReview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('レビュー承認エラー:', error);
    return NextResponse.json(
      { error: 'レビューの承認に失敗しました' },
      { status: 500 }
    );
  }
}
