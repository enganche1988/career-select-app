# コンサルタント登録画面 UI実装ガイド

## 概要

このドキュメントは、新しいコンサルタント管理構造に基づいたコンサルタント登録・編集画面のUI実装ガイドです。

## 画面構成

### 全体レイアウト

```
┌─────────────────────────────────────────┐
│  CareerSelect - コンサルタント登録      │
├─────────────────────────────────────────┤
│                                         │
│  [セクション1: 基本情報]                │
│  ┌─────────────────────────────────┐  │
│  │ Email *                          │  │
│  │ [________________________]      │  │
│  │                                  │  │
│  │ 表示名 *                         │  │
│  │ [________________________]      │  │
│  │                                  │  │
│  │ 年代 *                           │  │
│  │ [20代前半 ▼]                    │  │
│  │                                  │  │
│  │ 性別（任意）                     │  │
│  │ [男性] [女性] [その他] [回答しない]│
│  │                                  │  │
│  │ 学歴（任意）                     │  │
│  │ [大学卒業 ▼]                    │  │
│  │                                  │  │
│  │ アバター画像（任意）             │  │
│  │ [画像をアップロード]             │  │
│  └─────────────────────────────────┘  │
│                                         │
│  [セクション2: 経歴]                    │
│  ┌─────────────────────────────────┐  │
│  │ 前職業界（任意）                  │  │
│  │ [IT・インターネット ▼]          │  │
│  │                                  │  │
│  │ 前職職種（任意）                  │  │
│  │ [エンジニア ▼]                  │  │
│  │                                  │  │
│  │ 前職企業（複数可、任意）          │  │
│  │ [+ 企業を追加]                   │  │
│  │ [Google LLC] [削除]             │  │
│  │ [Microsoft Corporation] [削除]  │  │
│  └─────────────────────────────────┘  │
│                                         │
│  [セクション3: 専門領域]                │
│  ┌─────────────────────────────────┐  │
│  │ 得意業界 *（複数選択可）          │  │
│  │ ☑ IT・インターネット             │  │
│  │ ☑ SaaS / スタートアップ         │  │
│  │ ☐ メガベンチャー                │  │
│  │ ☐ 製造業                        │  │
│  │ ...                             │  │
│  │                                  │  │
│  │ 得意職種 *（複数選択可）          │  │
│  │ ☑ エンジニア                    │  │
│  │ ☑ PM / PdM                     │  │
│  │ ☐ デザイナー                    │  │
│  │ ☐ 営業                          │  │
│  │ ...                             │  │
│  │                                  │  │
│  │ 対象レベル（任意、複数選択可）    │  │
│  │ ☑ ジュニア（1-3年）            │  │
│  │ ☑ ミドル（3-7年）               │  │
│  │ ☐ シニア（7年〜）               │  │
│  │                                  │  │
│  │ 希望企業規模（任意、複数選択可）   │  │
│  │ ☑ スタートアップ（〜300名）     │  │
│  │ ☑ メガベンチャー（300〜1000名）│  │
│  │ ☐ 大企業（1000名以上）          │  │
│  └─────────────────────────────────┘  │
│                                         │
│  [セクション4: 自己申告実績]            │
│  ┌─────────────────────────────────┐  │
│  │ キャリア年数 *                   │  │
│  │ [8] 年                           │  │
│  │                                  │  │
│  │ 累計支援人数（任意）              │  │
│  │ [80] 名                          │  │
│  │                                  │  │
│  │ 累計転職成功数（任意）            │  │
│  │ [45] 名                          │  │
│  │                                  │  │
│  │ 平均年収（任意）                  │  │
│  │ [800] 万円                       │  │
│  │ ※ 支援した方の平均年収           │  │
│  └─────────────────────────────────┘  │
│                                         │
│  [保存] [キャンセル]                    │
└─────────────────────────────────────────┘
```

## セクション詳細

### セクション1: 基本情報

#### フィールド一覧

| フィールド | 必須 | 型 | 説明 |
|----------|------|-----|------|
| Email | ✅ | String (unique) | ログイン用メールアドレス |
| 表示名 | ✅ | String | 公開される表示名 |
| 年代 | ✅ | String | 選択式（20代前半/後半、30代前半/後半、40代以上） |
| 性別 | ❌ | String? | ラジオボタン（男性/女性/その他/回答しない） |
| 学歴 | ❌ | String? | 選択式（高卒/専門卒/大卒/大学院卒など） |
| アバター画像 | ❌ | String? | 画像アップロード |

#### UI実装例

```tsx
// セクション1: 基本情報
<section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">基本情報</h2>
  
  <div className="space-y-4">
    {/* Email */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">
        Email <span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        name="email"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
    </div>
    
    {/* 表示名 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">
        表示名 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="displayName"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
    </div>
    
    {/* 年代 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">
        年代 <span className="text-red-500">*</span>
      </label>
      <select
        name="ageRange"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      >
        <option value="">選択してください</option>
        <option value="20s_early">20代前半</option>
        <option value="20s_late">20代後半</option>
        <option value="30s_early">30代前半</option>
        <option value="30s_late">30代後半</option>
        <option value="40s_plus">40代以上</option>
      </select>
    </div>
    
    {/* 性別 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">性別（任意）</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" value="male" />
          <span>男性</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" value="female" />
          <span>女性</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" value="other" />
          <span>その他</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" value="" defaultChecked />
          <span>回答しない</span>
        </label>
      </div>
    </div>
    
    {/* 学歴 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">学歴（任意）</label>
      <select name="education" className="w-full border border-gray-300 rounded-lg px-4 py-2">
        <option value="">選択してください</option>
        <option value="high_school">高校卒業</option>
        <option value="vocational">専門学校卒業</option>
        <option value="university">大学卒業</option>
        <option value="graduate">大学院卒業</option>
      </select>
    </div>
    
    {/* アバター画像 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">アバター画像（任意）</label>
      <input type="file" accept="image/*" name="avatar" />
    </div>
  </div>
</section>
```

### セクション2: 経歴

#### フィールド一覧

| フィールド | 必須 | 型 | 説明 |
|----------|------|-----|------|
| 前職業界 | ❌ | String? | 選択式 |
| 前職職種 | ❌ | String? | 選択式 |
| 前職企業 | ❌ | String[] | 複数入力可、動的に追加/削除 |

#### UI実装例

```tsx
// セクション2: 経歴
<section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">経歴</h2>
  
  <div className="space-y-4">
    {/* 前職業界 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">前職業界（任意）</label>
      <select name="previousIndustry" className="w-full border border-gray-300 rounded-lg px-4 py-2">
        <option value="">選択してください</option>
        <option value="it_internet">IT・インターネット</option>
        <option value="saas_startup">SaaS / スタートアップ</option>
        {/* ... */}
      </select>
    </div>
    
    {/* 前職職種 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">前職職種（任意）</label>
      <select name="previousJobFunction" className="w-full border border-gray-300 rounded-lg px-4 py-2">
        <option value="">選択してください</option>
        <option value="engineer">エンジニア</option>
        <option value="pdm_pm">PM / PdM</option>
        {/* ... */}
      </select>
    </div>
    
    {/* 前職企業（複数） */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">前職企業（複数可、任意）</label>
      <div id="previousCompaniesList" className="space-y-2">
        {/* 動的に追加される企業入力欄 */}
      </div>
      <button
        type="button"
        onClick={() => addCompanyField()}
        className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        + 企業を追加
      </button>
    </div>
  </div>
</section>
```

### セクション3: 専門領域

#### フィールド一覧

| フィールド | 必須 | 型 | 説明 |
|----------|------|-----|------|
| 得意業界 | ✅ | String[] | 複数選択可 |
| 得意職種 | ✅ | String[] | 複数選択可 |
| 対象レベル | ❌ | String[] | 複数選択可 |
| 希望企業規模 | ❌ | String[] | 複数選択可 |

#### UI実装例

```tsx
// セクション3: 専門領域
<section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">専門領域</h2>
  
  <div className="space-y-6">
    {/* 得意業界 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">
        得意業界 <span className="text-red-500">*</span>（複数選択可）
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
        {INDUSTRIES.map(industry => (
          <label key={industry.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="specialtyIndustries"
              value={industry.value}
              className="w-5 h-5"
            />
            <span>{industry.label}</span>
          </label>
        ))}
      </div>
    </div>
    
    {/* 得意職種 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">
        得意職種 <span className="text-red-500">*</span>（複数選択可）
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
        {JOB_FUNCTIONS.map(job => (
          <label key={job.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="specialtyJobFunctions"
              value={job.value}
              className="w-5 h-5"
            />
            <span>{job.label}</span>
          </label>
        ))}
      </div>
    </div>
    
    {/* 対象レベル */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">対象レベル（任意、複数選択可）</label>
      <div className="space-y-2">
        {TARGET_LEVELS.map(level => (
          <label key={level.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="targetLevels"
              value={level.value}
              className="w-5 h-5"
            />
            <span>{level.label}</span>
          </label>
        ))}
      </div>
    </div>
    
    {/* 希望企業規模 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">希望企業規模（任意、複数選択可）</label>
      <div className="space-y-2">
        {COMPANY_SIZES.map(size => (
          <label key={size.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="preferredCompanySizes"
              value={size.value}
              className="w-5 h-5"
            />
            <span>{size.label}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
</section>
```

### セクション4: 自己申告実績

#### フィールド一覧

| フィールド | 必須 | 型 | 説明 |
|----------|------|-----|------|
| キャリア年数 | ✅ | Int | 数値入力 |
| 累計支援人数 | ❌ | Int? | 数値入力 |
| 累計転職成功数 | ❌ | Int? | 数値入力 |
| 平均年収 | ❌ | Int? | 数値入力（支援した方の平均） |

#### UI実装例

```tsx
// セクション4: 自己申告実績
<section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">自己申告実績</h2>
  <p className="text-sm text-gray-600 mb-4">
    これらの情報は検索・マッチングに使用されます。正確に入力してください。
  </p>
  
  <div className="space-y-4">
    {/* キャリア年数 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">
        キャリア年数 <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="selfReportedCareerYears"
          min="0"
          required
          className="w-24 border border-gray-300 rounded-lg px-4 py-2"
        />
        <span>年</span>
      </div>
    </div>
    
    {/* 累計支援人数 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">累計支援人数（任意）</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="selfReportedTotalSupports"
          min="0"
          className="w-24 border border-gray-300 rounded-lg px-4 py-2"
        />
        <span>名</span>
      </div>
    </div>
    
    {/* 累計転職成功数 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">累計転職成功数（任意）</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="selfReportedTotalPlacements"
          min="0"
          className="w-24 border border-gray-300 rounded-lg px-4 py-2"
        />
        <span>名</span>
      </div>
    </div>
    
    {/* 平均年収 */}
    <div>
      <label className="block mb-2 font-semibold text-gray-900">平均年収（任意）</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="selfReportedAverageAnnualIncome"
          min="0"
          className="w-24 border border-gray-300 rounded-lg px-4 py-2"
        />
        <span>万円</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">※ 支援した方の平均年収</p>
    </div>
  </div>
</section>
```

## バリデーション

### クライアントサイドバリデーション

```typescript
const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '有効なメールアドレスを入力してください'
  },
  displayName: {
    required: true,
    minLength: 1,
    maxLength: 50,
    message: '表示名は1文字以上50文字以下で入力してください'
  },
  ageRange: {
    required: true,
    message: '年代を選択してください'
  },
  specialtyIndustries: {
    required: true,
    minLength: 1,
    message: '得意業界を1つ以上選択してください'
  },
  specialtyJobFunctions: {
    required: true,
    minLength: 1,
    message: '得意職種を1つ以上選択してください'
  },
  selfReportedCareerYears: {
    required: true,
    min: 0,
    max: 50,
    message: 'キャリア年数は0以上50以下で入力してください'
  }
};
```

## サーバーアクション例

```typescript
'use server';

import { prisma } from '@/lib/prisma';

export async function createConsultantProfile(formData: FormData) {
  const email = formData.get('email') as string;
  const displayName = formData.get('displayName') as string;
  const ageRange = formData.get('ageRange') as string;
  // ... その他のフィールド
  
  // Consultant を作成
  const consultant = await prisma.consultant.create({
    data: {
      email,
      profile: {
        create: {
          displayName,
          ageRange,
          // ... その他のフィールド
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
  
  return consultant;
}
```

## 実装時の注意事項

1. **必須フィールドの明確な表示**: `*` マークとエラーメッセージ
2. **段階的な保存**: 各セクションを独立して保存可能にする（オプション）
3. **プレビュー機能**: 保存前にプレビューを表示
4. **画像アップロード**: 画像のプレビューとリサイズ機能
5. **レスポンシブ対応**: モバイルでも使いやすいUI

