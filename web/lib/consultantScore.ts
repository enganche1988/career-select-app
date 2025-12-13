import { Consultant } from '@prisma/client';

/**
 * Consultantのプロフィール情報・活動指標から期待スコア（1.0～5.0）を算出
 * スコア計算：
 * ・経験年数：1年につき+0.15（最大+1.5、10年以上同スコア）
 * ・SNSフォロワー合計：1,000人毎に+0.25（最大+1.0、4,000人以上同スコア）
 * ・外部リンク数：1件あたり+0.3（最大+0.9、3件まで）
 * ・実績サマリー（achievementsSummary）記入済み：+0.6
 * ベース1.0、最大で概ね5.0点満点
 */
export function calcConsultantExpectedScore(c: Pick<Consultant, 'experienceYears'|'snsFollowersTwitter'|'snsFollowersLinkedin'|'snsFollowersInstagram'|'externalLinks'|'achievementsSummary'>): number {
  let score = 1.0; // ベース

  // 経験年数加点
  score += Math.min(10, c.experienceYears) * 0.15;

  // SNSフォロワー合計（null=0扱い）
  const followers =
    (c.snsFollowersTwitter ?? 0) + (c.snsFollowersLinkedin ?? 0) + (c.snsFollowersInstagram ?? 0);
  score += Math.min(4, Math.floor(followers/1000)) * 0.25;

  // 外部リンク数加点
  let linksCount = 0;
  try {
    if(Array.isArray(c.externalLinks)) linksCount = c.externalLinks.length;
    else if(typeof c.externalLinks === 'object' && c.externalLinks) linksCount = Object.keys(c.externalLinks).length; // Type fallback
  } catch {}
  score += Math.min(3, linksCount) * 0.3;

  // 実績サマリー加点
  if (c.achievementsSummary && c.achievementsSummary.trim() !== '') score += 0.6;

  // 1.0～5.0上限
  return Math.min(5.0, Math.round(score * 10) / 10);
}

