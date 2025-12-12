# Prismaスキーマ移行プラン

## 概要

既存の `Consultant` モデルを、新しい3モデル構造（Consultant, ConsultantProfile, ConsultantStats）に移行する計画です。

## 現在のスキーマ構造

```prisma
model Consultant {
  id                    String
  name                  String
  email                 String?  // 現在はunique制約なし
  experienceYears       Int
  totalSupportCount     Int @default(0)
  expertiseRoles        Json?
  expertiseCompanyTypes Json?
  thumbnailUrl          String?
  headline              String?
  profileSummary        String?
  // ... その他多数のフィールド
}
```

## 新しいスキーマ構造

```prisma
model Consultant {
  id            String   @id @default(uuid())
  email         String   @unique
  
  profile       ConsultantProfile?
  stats         ConsultantStats?
  
  consultations Consultation[]
  reviews       Review[]
}

model ConsultantProfile {
  id           String      @id @default(uuid())
  consultant   Consultant  @relation(fields: [consultantId], references: [id])
  consultantId String      @unique
  
  // A. Demographics
  displayName  String
  ageRange     String
  gender       String?
  education    String?
  avatarUrl    String?
  
  // B. Background
  previousIndustry    String?
  previousJobFunction String?
  previousCompanies   String[]
  
  // C. Expertise
  specialtyIndustries   String[]
  specialtyJobFunctions String[]
  targetLevels          String[]
  preferredCompanySizes String[]
  
  // Self-reported metrics
  selfReportedTotalSupports        Int?
  selfReportedTotalPlacements      Int?
  selfReportedAverageAnnualIncome  Int?
  selfReportedCareerYears          Int?
}

model ConsultantStats {
  id           String      @id @default(uuid())
  consultant   Consultant  @relation(fields: [consultantId], references: [id])
  consultantId String      @unique
  
  platformConsultationCount Int   @default(0)
  platformPlacementCount    Int   @default(0)
  platformReviewCount       Int   @default(0)
  platformAverageRating     Float @default(0)
  
  meta Json?
}
```

## 移行ステップ

### Step 1: 新モデルの追加（既存データ保持）

```prisma
// ConsultantProfile と ConsultantStats を追加
// Consultant に email を追加（nullable から開始）
model Consultant {
  // ... 既存フィールドはそのまま
  email         String?   @unique  // 新規追加（nullable）
  profile       ConsultantProfile?
  stats         ConsultantStats?
}
```

### Step 2: データ移行スクリプト実行

既存の Consultant データから ConsultantProfile と ConsultantStats を作成：

```typescript
// migration script
const consultants = await prisma.consultant.findMany();

for (const consultant of consultants) {
  // ConsultantProfile を作成
  await prisma.consultantProfile.create({
    data: {
      consultantId: consultant.id,
      displayName: consultant.name,
      selfReportedCareerYears: consultant.experienceYears,
      selfReportedTotalSupports: consultant.totalSupportCount,
      specialtyJobFunctions: consultant.expertiseRoles || [],
      preferredCompanySizes: consultant.expertiseCompanyTypes || [],
      avatarUrl: consultant.thumbnailUrl,
      // その他のフィールドはデフォルト値またはnull
    }
  });
  
  // ConsultantStats を作成（初期値は0）
  await prisma.consultantStats.create({
    data: {
      consultantId: consultant.id,
      platformConsultationCount: 0,
      platformPlacementCount: 0,
      platformReviewCount: 0,
      platformAverageRating: 0,
    }
  });
}
```

### Step 3: email を必須化

```prisma
model Consultant {
  email         String   @unique  // nullable を削除
  // ...
}
```

### Step 4: 既存フィールドの非推奨化（段階的削除）

既存のフィールドは後方互換性のため残すが、新規コードでは使用しない：

```prisma
model Consultant {
  // 非推奨フィールド（後方互換性のため残す）
  name                  String?  // ConsultantProfile.displayName を使用
  experienceYears       Int?     // ConsultantProfile.selfReportedCareerYears を使用
  totalSupportCount     Int?      // ConsultantProfile.selfReportedTotalSupports を使用
  // ...
}
```

## フィールドマッピング詳細

### Consultant → ConsultantProfile

| 既存フィールド | 新フィールド | 変換ロジック |
|--------------|------------|------------|
| `name` | `displayName` | 直接コピー |
| `experienceYears` | `selfReportedCareerYears` | 直接コピー |
| `totalSupportCount` | `selfReportedTotalSupports` | 直接コピー |
| `expertiseRoles` (Json) | `specialtyJobFunctions` (String[]) | JSON配列を文字列配列に変換 |
| `expertiseCompanyTypes` (Json) | `preferredCompanySizes` (String[]) | JSON配列を文字列配列に変換 |
| `thumbnailUrl` | `avatarUrl` | 直接コピー |
| `headline` | - | 新規フィールドとして追加検討 |
| `profileSummary` | - | 新規フィールドとして追加検討 |

### ConsultantStats の初期値

- `platformConsultationCount`: Consultation テーブルから集計
- `platformPlacementCount`: Consultation の status='completed' かつ Review の type='outcome' から集計
- `platformReviewCount`: Review テーブルから集計（isApproved=true のみ）
- `platformAverageRating`: Review テーブルから平均値を計算（isApproved=true のみ）

## マイグレーション実行順序

1. **マイグレーション1**: 新モデル追加（ConsultantProfile, ConsultantStats）
2. **データ移行スクリプト実行**: 既存データを新モデルに移行
3. **マイグレーション2**: email を必須化
4. **アプリケーションコード更新**: 新モデルを使用するように変更
5. **マイグレーション3**: 既存フィールドを非推奨化（オプション）

## リスクと対策

### リスク1: データ損失
- **対策**: 移行前に全データをバックアップ
- **対策**: 移行スクリプトをテスト環境で実行

### リスク2: 既存コードの破壊
- **対策**: 既存フィールドは段階的に非推奨化
- **対策**: 新規コードと既存コードの両方をサポート

### リスク3: パフォーマンス低下
- **対策**: リレーションのインデックスを適切に設定
- **対策**: 必要に応じて JOIN クエリを最適化

## ロールバック計画

移行に問題が発生した場合：

1. マイグレーションをロールバック
2. 既存のスキーマに戻す
3. データ移行スクリプトの結果を確認
4. 問題を修正して再実行

