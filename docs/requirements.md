# requirements.md

## ユースケース

### ユーザー（求職者・User）
- コンサルタント一覧を閲覧
- コンサルタント詳細・プロフィール・口コミを閲覧
- コンサルタントへ相談予約
- 相談後に口コミ（相談レビュー/成果レビュー）を投稿

### コンサルタント（Consultant）
- ログイン
- 自分のプロフィールを登録・編集
- 自分への相談予約の一覧を確認
- 相談ステータスの変更（予定⇔完了）

### 管理者（Admin, 運営）
- データ全体の確認/管理（※POCフェーズはGUIなしも可）

---

## 必要なページとURL
- `/consultants` : コンサルタント一覧
- `/consultant/[id]` : コンサルタント詳細
- `/reserve` : 相談予約ページ
- `/review/[consultationId]` : 口コミ投稿（相談後）
- `/consultant/dashboard` : コンサルタント向けダッシュボード
- `/consultant/profile/edit` : プロフィール編集
- `/login` : ログイン（簡易認証）

---

## 必要なデータモデル（Prismaスキーマ案）

```prisma
model User {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  // ...他属性
  consultations Consultation[]
  reviews     Review[]
}

model Consultant {
  id          String   @id @default(uuid())
  name        String
  profile     String
  // ...他属性
  consultations Consultation[]
  reviews     Review[]
}

model Consultation {
  id             String   @id @default(uuid())
  consultant     Consultant @relation(fields: [consultantId], references: [id])
  consultantId   String
  user           User      @relation(fields: [userId], references: [id])
  userId         String
  status         String   // 'scheduled' | 'completed'
  datetime       DateTime
  reviews        Review[]
}

model Review {
  id             String   @id @default(uuid())
  type           String   // 'consultation' | 'outcome'
  content        String
  user           User      @relation(fields: [userId], references: [id])
  userId         String
  consultant     Consultant @relation(fields: [consultantId], references: [id])
  consultantId   String
  consultation   Consultation? @relation(fields: [consultationId], references: [id])
  consultationId String?
  createdAt      DateTime  @default(now())
}
```

---

## POCで必須の機能
- コンサルタント一覧/詳細/口コミ表示
- 相談予約・相談履歴
- 口コミ投稿（2種）
- コンサルタントのダッシュボード
- ログイン+マイページ編集

## 後回しにする機能（将来的に追加）
- 通知メール/チャット
- 相談/面談用のビデオ通話
- 詳細な分析ダッシュボード
- 運営用GUI/アドミン・承認機能

## 5. 初期トラクション用機能要件

【← ここにあなたが貼りたい追加ブロックをそのまま貼る】

---

## 6. コンサルタント管理構造（公式仕様）

### 概要
CareerSelect では、コンサルタント情報を以下の3レイヤーで管理します：

1. **プロフィール情報（検索軸）** - 検索・マッチングに使用される基本情報
2. **自己申告の実績（selfReportedXXX）** - コンサルタント自身が入力する実績情報
3. **CareerSelect プラットフォーム内の実績（platformXXX）** - Consultation / Review / 転職完了から自動計測される実績

### データモデル
- `Consultant`: 基本識別情報（id, email）とリレーション管理
- `ConsultantProfile`: プロフィール情報と自己申告実績
- `ConsultantStats`: プラットフォーム実績（自動集計、手動編集不可）

### 実装フェーズ
- **Phase 1 (MVP)**: selfReported のみ使用
- **Phase 2**: platformXXX の自動集計実装
- **Phase 3**: selfReported と platform の統合表示

詳細は `docs/consultant-management-spec.md` を参照してください。
