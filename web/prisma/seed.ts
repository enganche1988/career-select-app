import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.consultant.deleteMany();
  await prisma.user.deleteMany();

  // ユーザー
  const users = await prisma.user.createMany({
    data: [
      { name: '山田大輔', email: 'yamada@example.com' },
      { name: '佐藤里奈', email: 'sato@example.com' },
      { name: '田村健太', email: 'tamura@example.com' },
      { name: '小林真由美', email: 'kobayashi@example.com' },
    ],
  });
  const userList = await prisma.user.findMany();

  // コンサルタント
  const consultants = [
    await prisma.consultant.create({
      data: {
        email: 'miura@example.com', // Phase 1: email追加
        name: '三浦拓哉',
        bio: 'IT・Web業界転職はお任せください！直接エンジニア経験も活かしリアルなアドバイスが強み。',
        specialties: 'IT,Web,エンジニア',
        experienceYears: 8,
        userId: userList[0].id,
        headline: '元大手IT企業エンジニア → スタートアップCTO経験',
        profileSummary: 'IT・Web業界の転職支援を専門としています。直接エンジニア経験も活かし、技術的なキャリアパスから転職活動まで、リアルなアドバイスが強みです。',
        achievementsSummary: '大手IT企業からベンチャーまで、80名以上のエンジニア転職支援に実績。SNSでも毎日発信中。',
        twitterUrl: 'https://twitter.com/miura_takuya',
        linkedinUrl: 'https://linkedin.com/in/miura-takuya',
        schedulerUrl: 'https://timellex.example.com/miura-demo',
        thumbnailUrl: 'https://placehold.co/400x400?text=三浦拓哉',
        expertiseRoles: ['エンジニア', 'PdM', 'テックリード'],
        expertiseCompanyTypes: ['メガベンチャー', 'スタートアップ', '外資系'],
        // Phase 1: 検索用配列フィールド追加
        specialtyIndustries: ['it_internet', 'saas_startup', 'mega_venture'],
        specialtyJobFunctions: ['engineer', 'pdm_pm'],
        // Phase 1: 検索軸プロフィール
        ageRange: '30s_early',
        education: 'university',
        previousIndustry: 'it_internet',
        previousJobFunction: 'engineer',
        previousCompanies: ['Google LLC', 'Microsoft Corporation'],
        // Phase 1: 自己申告実績
        selfReportedCareerYears: 8,
        selfReportedTotalSupports: 80,
        selfReportedTotalPlacements: 45,
        selfReportedAverageAnnualIncome: 800,
        snsFollowersTwitter: 3500,
        snsFollowersLinkedin: 800,
        externalLinks: [
          { title: 'note: Webエンジニア転職術', url: 'https://note.com/sample_it', type: 'note' },
          { title: 'GitHub', url: 'https://github.com/sample_it', type: 'github' },
        ],
        timelexUrl: 'https://timellex.example.com/miura-demo',
        twitterHandle: 'miura_takuya',
      }
    }),
    await prisma.consultant.create({
      data: {
        email: 'kinoshita@example.com',
        name: '木下絵里',
        bio: '製造業や法人営業、メーカー転職なら必ず役立つ事例が語れます。',
        specialties: 'メーカー,営業,製造',
        experienceYears: 11,
        userId: userList[1].id,
        headline: '元大手メーカー営業 → スタートアップ営業責任者',
        profileSummary: '製造業や法人営業、メーカー転職の支援を専門としています。営業系への転職、管理職希望にも強い実績があります。',
        achievementsSummary: '営業系への転職、管理職希望にも強い。直近3年の内定率、業界平均を大きく上回っています。',
        twitterUrl: 'https://twitter.com/kinoshita_eri',
        linkedinUrl: 'https://linkedin.com/in/kinoshita-eri',
        schedulerUrl: 'https://timellex.example.com/kinoshita-demo',
        thumbnailUrl: 'https://placehold.co/400x400?text=木下絵里',
        expertiseRoles: ['営業', 'マーケティング', 'セールス'],
        expertiseCompanyTypes: ['大企業', 'メーカー'],
        specialtyIndustries: ['manufacturing', 'saas_startup'],
        specialtyJobFunctions: ['sales', 'marketing'],
        ageRange: '30s_late',
        education: 'university',
        previousIndustry: 'manufacturing',
        previousJobFunction: 'sales',
        previousCompanies: ['トヨタ自動車', 'パナソニック'],
        selfReportedCareerYears: 11,
        selfReportedTotalSupports: 60,
        selfReportedTotalPlacements: 35,
        selfReportedAverageAnnualIncome: 750,
        snsFollowersTwitter: 1020,
        snsFollowersLinkedin: 1200,
        snsFollowersInstagram: 400,
        externalLinks: [
          { title: 'Instagram: 体験談まとめ', url: 'https://instagram.com/sample_marketing', type: 'instagram' },
        ],
        timelexUrl: 'https://timellex.example.com/kinoshita-demo',
        twitterHandle: 'kinoshita_eri',
      }
    }),
    await prisma.consultant.create({
      data: {
        email: 'takahashi@example.com',
        name: '高橋悠馬',
        bio: '管理部門やコーポレート職への転職に精通。働き方の疑問も一緒に整理しましょう。',
        specialties: 'コーポレート,人事,総務',
        experienceYears: 6,
        userId: userList[2].id,
        headline: '元外資系人事 → スタートアップ人事責任者',
        profileSummary: '管理部門やコーポレート職への転職に精通しています。働き方の疑問も一緒に整理しましょう。',
        achievementsSummary: '総務・人事採用・経理バックオフィスの支援実績が延べ50社以上。LinkedInでの社内改革記事が反響。',
        linkedinUrl: 'https://linkedin.com/in/takahashi-yuma',
        schedulerUrl: 'https://timellex.example.com/takahashi-demo',
        thumbnailUrl: 'https://placehold.co/400x400?text=高橋悠馬',
        expertiseRoles: ['人事', '総務', '労務'],
        expertiseCompanyTypes: ['大企業', '外資系'],
        specialtyIndustries: ['consulting', 'finance'],
        specialtyJobFunctions: ['hr', 'finance'],
        ageRange: '30s_early',
        education: 'graduate',
        previousIndustry: 'consulting',
        previousJobFunction: 'hr',
        previousCompanies: ['マッキンゼー・アンド・カンパニー', 'アクセンチュア'],
        selfReportedCareerYears: 6,
        selfReportedTotalSupports: 50,
        selfReportedTotalPlacements: 30,
        selfReportedAverageAnnualIncome: 900,
        snsFollowersLinkedin: 2100,
        externalLinks: [
          { title: 'LinkedIn プロフィール', url: 'https://linkedin.com/in/sample_hr', type: 'linkedin' },
        ],
        timelexUrl: 'https://timellex.example.com/takahashi-demo',
        twitterHandle: 'takahashi_yuma',
      }
    }),
    await prisma.consultant.create({
      data: {
        email: 'suzuki@example.com',
        name: '鈴木葵',
        bio: '子育て・ケアとキャリア形成の両立支援が得意です。女性の転職や両立も親身に相談。',
        specialties: '両立支援,事務,女性転職',
        experienceYears: 13,
        userId: userList[3].id,
        headline: '元大手企業人事 → ワーママ転職支援専門',
        profileSummary: '子育て・ケアとキャリア形成の両立支援が得意です。女性の転職や両立も親身に相談します。',
        achievementsSummary: 'ワーママ転職の支援・カウンセリング実績多数。事務・時短勤務など多様な働き方提案を発信しています。',
        twitterUrl: 'https://twitter.com/suzuki_aoi',
        schedulerUrl: 'https://timellex.example.com/suzuki-demo',
        thumbnailUrl: 'https://placehold.co/400x400?text=鈴木葵',
        expertiseRoles: ['事務', 'コーポレート', '両立支援'],
        expertiseCompanyTypes: ['大企業', 'スタートアップ'],
        specialtyIndustries: ['it_internet', 'saas_startup'],
        specialtyJobFunctions: ['hr', 'other'],
        ageRange: '30s_late',
        education: 'university',
        previousIndustry: 'it_internet',
        previousJobFunction: 'hr',
        previousCompanies: ['楽天', 'サイバーエージェント'],
        selfReportedCareerYears: 13,
        selfReportedTotalSupports: 100,
        selfReportedTotalPlacements: 60,
        selfReportedAverageAnnualIncome: 650,
        snsFollowersTwitter: 480,
        snsFollowersInstagram: 1220,
        externalLinks: [
          { title: 'note: 働くママ応援コラム', url: 'https://note.com/sample_mama', type: 'note' },
        ],
        timelexUrl: 'https://timellex.example.com/suzuki-demo',
        twitterHandle: 'suzuki_aoi',
      }
    }),
  ];

  // 各Consultant＝Userの組み合わせでConsultation+Reviewを作る
  let consultCount = 0;
  for (let i = 0; i < consultants.length; i++) {
    const consultant = consultants[i];
    const user = userList[(i+1)%userList.length];
    // 相談予約
    const consultation1 = await prisma.consultation.create({
      data: {
        userId: user.id,
        consultantId: consultant.id,
        scheduledAt: new Date(Date.now() - (i+1)*5*24*60*60*1000),
        status: 'completed',
      },
    });
    const consultation2 = await prisma.consultation.create({
      data: {
        userId: user.id,
        consultantId: consultant.id,
        scheduledAt: new Date(Date.now() - (i+1)*2*24*60*60*1000),
        status: 'completed',
      },
    });
    // 相談レビュー
    await prisma.review.createMany({
      data: [
        {
          type: 'consultation',
          score: 5,
          comment: '話しやすくて不安が一気に減りました。\n自分でも気づかなかった強みを見つけてくれた！',
          userId: user.id,
          consultantId: consultant.id,
          consultationId: consultation1.id
        },
        {
          type: 'consultation',
          score: 4,
          comment: '丁寧にヒアリングしてもらい、考えが整理できました。',
          userId: user.id,
          consultantId: consultant.id,
          consultationId: consultation2.id
        },
      ]
    });
    // 転職実績レビュー
    await prisma.review.createMany({
      data: [
        {
          type: 'outcome',
          score: 5,
          comment: '選考対策が的確で、年収も上がりました！',
          userId: user.id,
          consultantId: consultant.id,
          consultationId: consultation1.id
        },
        {
          type: 'outcome',
          score: 4,
          comment: '面接練習のおかげで自信がつきました。\n転職して正解だったと思います。',
          userId: user.id,
          consultantId: consultant.id,
          consultationId: consultation2.id
        },
      ]
    });
    consultCount += 2;
  }

  console.log(`Seeded: ${consultants.length} consultants, ${userList.length} users, ${consultCount * 2} consultations, with multiple reviews each.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
