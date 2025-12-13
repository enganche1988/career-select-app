'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
