'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createConsultation(formData: FormData) {
  try {
    const consultantId = formData.get('consultantId') as string;
    const scheduledAtStr = formData.get('scheduledAt') as string;
    const theme = formData.get('theme') as string;
    
    if (!consultantId || !scheduledAtStr) {
      return { error: '必須項目が入力されていません' };
    }
    
    // ダミーユーザーを取得（最初のUserを使用）
    const dummyUser = await prisma.user.findFirst();
    if (!dummyUser) {
      return { error: 'ユーザーが見つかりません' };
    }
    
    await prisma.consultation.create({
      data: {
        userId: dummyUser.id,
        consultantId,
        scheduledAt: new Date(scheduledAtStr),
        status: 'scheduled',
        theme: theme || null,
      },
    });
    
    revalidatePath(`/consultants/${consultantId}`);
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Consultation creation error:', error);
    return { error: '予約の作成に失敗しました' };
  }
}

