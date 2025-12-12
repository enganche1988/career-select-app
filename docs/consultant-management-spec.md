# コンサルタント管理構造 仕様書

## 概要

CareerSelect では、コンサルタント情報を以下の3レイヤーで管理します：

1. **プロフィール情報（検索軸）** - 検索・マッチングに使用される基本情報
2. **自己申告の実績（selfReportedXXX）** - コンサルタント自身が入力する実績情報
3. **CareerSelect プラットフォーム内の実績（platformXXX）** - Consultation / Review / 転職完了から自動計測される実績

## 重要方針

### MVP フェーズ
- **selfReported のみ利用**
- プラットフォーム実績は表示しない（または「準備中」と表示）

### 後期フェーズ
- **platformXXX を自動集計して反映**
- Consultation、Review、転職完了データから自動計算
- 手動編集不可（verified データとして扱う）

### データ整合性
- **verified（platform実績）は手動編集不可**
- 中抜きを防ぐため、プラットフォーム実績はシステムが自動更新のみ
- selfReported と platform は明確に分離して管理

## データモデル設計

### モデル構成

```
Consultant (1) ── (1) ConsultantProfile
     │
     └── (1) ConsultantStats
```

### Consultant モデル
- 基本識別情報（id, email）
- リレーション管理（profile, stats）
- 関連データ（consultations, reviews）

### ConsultantProfile モデル
- **A. Demographics（基本属性）**
  - displayName: 表示名
  - ageRange: 年代
  - gender: 性別（任意）
  - education: 学歴（任意）
  - avatarUrl: アバター画像URL（任意）

- **B. Background（経歴）**
  - previousIndustry: 前職業界
  - previousJobFunction: 前職職種
  - previousCompanies: 前職企業リスト（配列）

- **C. Expertise（専門領域）**
  - specialtyIndustries: 得意業界（配列）
  - specialtyJobFunctions: 得意職種（配列）
  - targetLevels: 対象レベル（配列）
  - preferredCompanySizes: 希望企業規模（配列）

- **Self-reported metrics（自己申告実績）**
  - selfReportedTotalSupports: 累計支援人数
  - selfReportedTotalPlacements: 累計転職成功数
  - selfReportedAverageAnnualIncome: 平均年収（支援した人の）
  - selfReportedCareerYears: キャリア年数

### ConsultantStats モデル
- **Platform metrics（プラットフォーム実績）**
  - platformConsultationCount: プラットフォーム内相談数
  - platformPlacementCount: プラットフォーム内転職成功数
  - platformReviewCount: プラットフォーム内レビュー数
  - platformAverageRating: プラットフォーム内平均評価

- **Meta（メタ情報）**
  - meta: JSON形式の追加情報（将来の拡張用）

## 実装フェーズ

### Phase 1: MVP（現在）
- ConsultantProfile の selfReported フィールドのみ使用
- ConsultantStats は作成するが、値は0のまま
- UIでは selfReported のみ表示

### Phase 2: 自動集計実装
- Consultation の status 変更を監視
- Review の作成・承認を監視
- 転職完了の判定ロジック実装
- ConsultantStats を自動更新するバッチ処理

### Phase 3: 統合表示
- selfReported と platform を併記表示
- 信頼性の高い platform データを優先表示
- 検証済みバッジなどのUI要素追加

## データ移行計画

### 既存データの移行
1. 既存の `Consultant` フィールドから `ConsultantProfile` へのマッピング
2. 既存の `totalSupportCount` を `selfReportedTotalSupports` に移行
3. 既存の `experienceYears` を `selfReportedCareerYears` に移行

### フィールドマッピング表

| 既存フィールド | 新フィールド | 備考 |
|--------------|------------|------|
| `name` | `ConsultantProfile.displayName` | 直接移行 |
| `experienceYears` | `ConsultantProfile.selfReportedCareerYears` | 直接移行 |
| `totalSupportCount` | `ConsultantProfile.selfReportedTotalSupports` | 直接移行 |
| `expertiseRoles` | `ConsultantProfile.specialtyJobFunctions` | JSON配列から変換 |
| `expertiseCompanyTypes` | `ConsultantProfile.preferredCompanySizes` | JSON配列から変換 |
| `thumbnailUrl` | `ConsultantProfile.avatarUrl` | 直接移行 |
| `headline` | `ConsultantProfile` の新フィールド（要検討） | - |
| `profileSummary` | `ConsultantProfile` の新フィールド（要検討） | - |

## UI実装ガイド

### コンサルタント登録画面
- **セクション1: 基本情報**
  - Email（必須、一意）
  - 表示名（必須）
  - 年代（必須）
  - 性別（任意）
  - 学歴（任意）
  - アバター画像（任意）

- **セクション2: 経歴**
  - 前職業界（任意）
  - 前職職種（任意）
  - 前職企業（複数可、任意）

- **セクション3: 専門領域**
  - 得意業界（複数選択、必須）
  - 得意職種（複数選択、必須）
  - 対象レベル（複数選択、任意）
  - 希望企業規模（複数選択、任意）

- **セクション4: 自己申告実績**
  - 累計支援人数（任意）
  - 累計転職成功数（任意）
  - 平均年収（任意）
  - キャリア年数（必須）

### コンサルタント詳細表示
- **プロフィール情報**: ConsultantProfile から表示
- **実績表示**: 
  - MVP: selfReported のみ表示
  - 後期: selfReported と platform を併記、platform に「検証済み」バッジ

### 管理画面
- ConsultantStats は読み取り専用表示
- 自動更新のログを表示
- 手動編集不可であることを明示

## セキュリティ・整合性

### 編集権限
- **ConsultantProfile**: コンサルタント本人のみ編集可能
- **ConsultantStats**: システムのみ更新可能（手動編集不可）

### データ検証
- selfReported の値は任意だが、異常値チェックを実装
- platform の値は常に Consultation / Review データから計算

### 監査ログ
- ConsultantStats の更新履歴を meta JSON に記録
- 更新日時、更新理由、更新前後の値を保存

## 将来の拡張

### 予定されている機能
- 実績の時系列表示
- 業界別・職種別の実績集計
- 実績のグラフ表示
- 実績の比較機能（コンサルタント間）

### メタデータの活用
- ConsultantStats.meta に追加情報を保存
- 集計方法の変更履歴
- A/Bテスト用のフラグ
- カスタム指標の追加

