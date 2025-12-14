'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * 新規コンサルタントを作成（最小入力：名前・メール）
 */
export async function createConsultant(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') ? (formData.get('email') as string) : null;

  if (!name || name.trim() === '') {
    throw new Error('名前は必須です');
  }

  try {
    // 最小入力でConsultantレコードを作成
    const consultant = await prisma.consultant.create({
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        experienceYears: 0, // デフォルト値（後で編集可能）
        specialtyIndustries: [],
        specialtyJobFunctions: [],
      },
    });

    // キャッシュを無効化（公開一覧に即時反映）
    revalidatePath('/consultants');
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/profile`);

    // 作成後、そのコンサルのプロフィール編集画面に遷移
    redirect(`/dashboard/profile?consultantId=${consultant.id}`);
  } catch (error: any) {
    console.error('コンサルタント作成エラー:', error);
    // メールアドレスの重複エラーなど
    if (error.code === 'P2002') {
      throw new Error('このメールアドレスは既に使用されています');
    }
    throw new Error('コンサルタントの作成に失敗しました');
  }
}

export async function toggleConsultationStatus(formData: FormData) {
  const consultationId = formData.get('consultationId') as string;
  const prevStatus = formData.get('prevStatus') as string;
  
  // scheduled -> completed, completed -> scheduled に切り替え
  const newStatus = prevStatus === 'scheduled' ? 'completed' : 'scheduled';
  
  await prisma.consultation.update({ 
    where: { id: consultationId }, 
    data: { status: newStatus } 
  });
  
  revalidatePath('/dashboard');
}
