'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createReview(
  consultationId: string,
  userId: string,
  consultantId: string,
  formData: FormData
) {
  const type = String(formData.get('type'));
  const score = Number(formData.get('score'));
  const comment = String(formData.get('comment'));
  
  await prisma.review.create({
    data: {
      type,
      score,
      comment,
      userId,
      consultantId,
      consultationId,
    },
  });
  
  redirect(`/consultants/${consultantId}?reviewed=1`);
}


