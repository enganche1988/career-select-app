# Prismaスキーマ - 新モデル定義（参考実装）

## 概要

このドキュメントは、新しいコンサルタント管理構造に基づいたPrismaスキーマの完全な定義です。
実際のマイグレーション時は、`docs/prisma-schema-migration-plan.md` の手順に従って段階的に移行してください。

## 完全なスキーマ定義

```prisma
// Prisma 6.xスキーマ（CareerSelect）
// PostgreSQL (Neon) を使用
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String         @id @default(uuid())
  name          String
  email         String         @unique
  createdAt     DateTime       @default(now())
  consultations Consultation[]
  consultant    Consultant?
  reviews       Review[]
}

model Consultant {
  id            String   @id @default(uuid())
  email         String   @unique
  
  profile       ConsultantProfile?
  stats         ConsultantStats?
  
  consultations Consultation[]
  reviews       Review[]
  
  // 後方互換性のため残す（段階的に非推奨化）
  name                  String?  // ConsultantProfile.displayName を使用
  bio                   String?
  specialties           String?
  experienceYears       Int?     // ConsultantProfile.selfReportedCareerYears を使用
  createdAt             DateTime  @default(now())
  userId                String?   @unique
  user                  User?    @relation(fields: [userId], references: [id])
  headline              String?
  profileSummary        String?
  achievementsSummary   String?
  expertiseRoles        Json?     // ConsultantProfile.specialtyJobFunctions を使用
  expertiseCompanyTypes Json?     // ConsultantProfile.preferredCompanySizes を使用
  twitterUrl            String?
  linkedinUrl           String?
  schedulerUrl          String?
  thumbnailUrl          String?   // ConsultantProfile.avatarUrl を使用
  profileSourceRaw      String?
  totalSupportCount     Int?       // ConsultantProfile.selfReportedTotalSupports を使用
  snsFollowersTwitter   Int?
  snsFollowersLinkedin  Int?
  snsFollowersInstagram Int?
  externalLinks         Json?
  timelexUrl            String?
  twitterHandle         String?
}

model ConsultantProfile {
  id           String      @id @default(uuid())
  consultant   Consultant  @relation(fields: [consultantId], references: [id], onDelete: Cascade)
  consultantId String      @unique
  
  // A. Demographics（基本属性）
  displayName  String
  ageRange     String
  gender       String?
  education    String?
  avatarUrl    String?
  
  // B. Background（経歴）
  previousIndustry    String?
  previousJobFunction String?
  previousCompanies   String[]  @default([])
  
  // C. Expertise（専門領域）
  specialtyIndustries   String[]  @default([])
  specialtyJobFunctions String[]  @default([])
  targetLevels          String[]  @default([])
  preferredCompanySizes String[]  @default([])
  
  // Self-reported metrics（自己申告実績）
  selfReportedTotalSupports        Int?
  selfReportedTotalPlacements      Int?
  selfReportedAverageAnnualIncome  Int?
  selfReportedCareerYears          Int?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ConsultantStats {
  id           String      @id @default(uuid())
  consultant   Consultant  @relation(fields: [consultantId], references: [id], onDelete: Cascade)
  consultantId String      @unique
  
  // Platform metrics（プラットフォーム実績）
  platformConsultationCount Int   @default(0)
  platformPlacementCount    Int   @default(0)
  platformReviewCount       Int   @default(0)
  platformAverageRating     Float @default(0)
  
  meta Json?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Consultation {
  id            String     @id @default(uuid())
  user          User       @relation(fields: [userId], references: [id])
  userId        String
  consultant    Consultant @relation(fields: [consultantId], references: [id])
  consultantId  String
  scheduledAt   DateTime
  status        String // "scheduled" | "completed" | "canceled" | "scheduled_request" | "pending"
  theme         String?
  note          String?
  meetingMethod String? // "phone" | "zoom"
  reviews       Review[]
  createdAt     DateTime   @default(now())
}

model Review {
  id             String        @id @default(uuid())
  user           User?         @relation(fields: [userId], references: [id])
  userId         String?
  consultant     Consultant    @relation(fields: [consultantId], references: [id])
  consultantId   String
  consultation   Consultation? @relation(fields: [consultationId], references: [id])
  consultationId String?
  type           String // "consultation" | "outcome"
  score          Int
  comment        String
  meta           Json?
  isApproved     Boolean       @default(false)
  createdAt      DateTime      @default(now())
}
```

## インデックス推奨

```prisma
// 検索パフォーマンス向上のため
model ConsultantProfile {
  // ... フィールド定義 ...
  
  @@index([specialtyIndustries])
  @@index([specialtyJobFunctions])
  @@index([preferredCompanySizes])
}

model ConsultantStats {
  // ... フィールド定義 ...
  
  @@index([platformConsultationCount])
  @@index([platformAverageRating])
}
```

## データ型の説明

### String[] 型（PostgreSQL）
PostgreSQLでは `String[]` は配列型として直接サポートされています。
Prismaでは自動的に配列として扱われます。

### Json 型
`ConsultantStats.meta` は将来の拡張用にJSON型を使用しています。
例：
```typescript
meta: {
  lastCalculatedAt: "2025-12-11T00:00:00Z",
  calculationVersion: "1.0",
  customMetrics: { ... }
}
```

## リレーションの説明

### Consultant ↔ ConsultantProfile
- 1対1の関係
- `onDelete: Cascade` により、Consultantが削除されるとProfileも自動削除

### Consultant ↔ ConsultantStats
- 1対1の関係
- `onDelete: Cascade` により、Consultantが削除されるとStatsも自動削除

## 使用例

### ConsultantProfile の作成

```typescript
const consultant = await prisma.consultant.create({
  data: {
    email: 'consultant@example.com',
    profile: {
      create: {
        displayName: '山田太郎',
        ageRange: '30s_early',
        gender: 'male',
        specialtyIndustries: ['it_internet', 'saas_startup'],
        specialtyJobFunctions: ['engineer', 'pdm_pm'],
        selfReportedCareerYears: 8,
        selfReportedTotalSupports: 80,
      }
    },
    stats: {
      create: {
        platformConsultationCount: 0,
        platformPlacementCount: 0,
        platformReviewCount: 0,
        platformAverageRating: 0,
      }
    }
  }
});
```

### ConsultantStats の自動更新

```typescript
// Consultation 完了時に自動更新
async function updateConsultantStats(consultantId: string) {
  const consultationCount = await prisma.consultation.count({
    where: { consultantId, status: 'completed' }
  });
  
  const reviews = await prisma.review.findMany({
    where: { consultantId, isApproved: true }
  });
  
  const reviewCount = reviews.length;
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
    : 0;
  
  await prisma.consultantStats.update({
    where: { consultantId },
    data: {
      platformConsultationCount: consultationCount,
      platformReviewCount: reviewCount,
      platformAverageRating: averageRating,
      meta: {
        lastCalculatedAt: new Date().toISOString(),
        calculationVersion: '1.0'
      }
    }
  });
}
```

