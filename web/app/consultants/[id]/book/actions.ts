'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createConsultationFromTimeRex(formData: FormData) {
  const consultantId = formData.get('consultantId') as string;
  const schedulerUrl = formData.get('schedulerUrl') as string;

  // ダミーユーザーを取得（最初のUserを使用）
  const dummyUser = await prisma.user.findFirst();
  if (!dummyUser) {
    throw new Error('ユーザーが見つかりません');
  }

  await prisma.consultation.create({
    data: {
      userId: dummyUser.id,
      consultantId,
      scheduledAt: new Date(), // 仮の日時（TimeRexで確定後に更新される想定）
      status: 'scheduled_request',
      theme: 'TimeRexから日程調整予定',
      note: `TimeRex URL: ${schedulerUrl}`,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/consultants/${consultantId}`);

  // TimeRexページを開きつつ、成功メッセージを表示
  // クライアント側でTimeRexを開くために、リダイレクト先で処理
  redirect(`/consultants/${consultantId}/book?success=1&schedulerUrl=${encodeURIComponent(schedulerUrl)}`);
}

export async function createConsultationFromForm(formData: FormData) {
  const consultantId = formData.get('consultantId') as string;
  const preferredTimes = formData.get('preferredTimes') as string;
  const theme = formData.get('theme') as string;
  const meetingMethod = formData.get('meetingMethod') as string;
  const noteInput = formData.get('note') ? String(formData.get('note')) : null;

  if (!consultantId || !preferredTimes || !theme || !meetingMethod) {
    redirect(`/consultants/${consultantId}/book?error=1`);
    return;
  }

  try {
    // ダミーユーザーを取得（最初のUserを使用）
    const dummyUser = await prisma.user.findFirst();
    if (!dummyUser) {
      redirect(`/consultants/${consultantId}/book?error=1`);
      return;
    }

    // noteに希望日時・相談テーマ・補足メモをまとめて保存
    let note = `希望日時:\n${preferredTimes}\n\n相談テーマ: ${theme}`;
    if (noteInput) {
      note += `\n\n補足メモ: ${noteInput}`;
    }

    await prisma.consultation.create({
      data: {
        userId: dummyUser.id,
        consultantId,
        scheduledAt: new Date(), // 仮の日時（実際の日程はコンサルタントと調整後に更新）
        status: 'scheduled_request',
        theme,
        meetingMethod,
        note,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath(`/consultants/${consultantId}`);

    redirect(`/consultants/${consultantId}/book?success=1`);
  } catch (error) {
    console.error('予約作成エラー:', error);
    redirect(`/consultants/${consultantId}/book?error=1`);
  }
}

