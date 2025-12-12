# CareerSelect ドキュメント

## 概要

このディレクトリには、CareerSelectプロジェクトの仕様書、設計書、実装ガイドが含まれています。

## ドキュメント一覧

### 基本仕様

- **[requirements.md](./requirements.md)** - プロジェクトの基本要件とユースケース
  - ユーザーストーリー
  - 必要なページとURL
  - データモデル案
  - POCで必須の機能

### コンサルタント管理構造（公式仕様）

- **[consultant-management-spec.md](./consultant-management-spec.md)** - コンサルタント管理構造の完全な仕様書
  - 3レイヤー構造の説明
  - データモデル設計
  - 実装フェーズ
  - データ移行計画
  - UI実装ガイド
  - セキュリティ・整合性

- **[prisma-schema-migration-plan.md](./prisma-schema-migration-plan.md)** - Prismaスキーマ移行プラン
  - 現在のスキーマ構造
  - 新しいスキーマ構造
  - 移行ステップ
  - フィールドマッピング詳細
  - リスクと対策
  - ロールバック計画

- **[prisma-schema-new-models.md](./prisma-schema-new-models.md)** - 新モデル定義（参考実装）
  - 完全なスキーマ定義
  - インデックス推奨
  - データ型の説明
  - 使用例

- **[consultant-registration-ui-mock.md](./consultant-registration-ui-mock.md)** - コンサルタント登録画面UI実装ガイド
  - 画面構成
  - セクション詳細
  - UI実装例（コード）
  - バリデーション
  - サーバーアクション例

## コンサルタント管理構造の概要

### 3レイヤー構造

1. **プロフィール情報（検索軸）**
   - `ConsultantProfile` モデルで管理
   - 基本属性、経歴、専門領域を含む

2. **自己申告の実績（selfReportedXXX）**
   - `ConsultantProfile` 内の selfReported フィールド
   - コンサルタント本人が入力
   - MVPフェーズではこれのみ使用

3. **CareerSelect プラットフォーム内の実績（platformXXX）**
   - `ConsultantStats` モデルで自動計測
   - Consultation / Review / 転職完了から自動集計
   - 手動編集不可（verified データ）

### モデル構成

```
Consultant (1) ── (1) ConsultantProfile
     │
     └── (1) ConsultantStats
```

### 実装フェーズ

- **Phase 1 (MVP)**: selfReported のみ使用
- **Phase 2**: platformXXX の自動集計実装
- **Phase 3**: selfReported と platform の統合表示

## 関連ファイル

- **AGENT.md** (プロジェクトルート) - AIエージェント運用ルールとコンサルタント管理構造の概要
- **prisma/schema.prisma** (web/prisma/) - 現在のPrismaスキーマ定義

## 更新履歴

- 2025-12-11: コンサルタント管理構造の公式仕様を追加
  - 3レイヤー構造の定義
  - ConsultantProfile / ConsultantStats モデルの設計
  - UI実装ガイドの作成

