# 実装サマリー：Q&A主役化への構造・UI改修

## 更新日
2025-01-XX

## 実装概要

CareerSelectサービスの主役を「公開Q&A（質問と回答）」に移すための構造・UI改修を実施しました。
既存実装（コンサル一覧/詳細、予約導線、レビュー投稿→承認→表示）を活かした上で、Q&Aを起点とした情報設計に変更しています。

---

## 変更/追加したファイル一覧

### トップページ関連
- `web/app/_components/HeroSection.tsx` - キャッチコピー・サブコピー・CTA2つのみに調整
- `web/app/_components/LatestQASection.tsx` - 新着Q&A表示（5-8件、コメント追加）
- `web/app/_components/ActiveConsultantsSection.tsx` - 既存実装を確認（要件に合致）
- `web/app/_components/ServiceExplanationSection.tsx` - 3ステップのみ、長文説明を削除

### コンサルタント一覧ページ関連
- `web/app/consultants/page.tsx` - データ取得を最適化（select使用、N+1回避）
- `web/app/consultants/ConsultantGrid.tsx` - 回答抜粋の生成ロジックを改善（文の途中で切れないように）

### コンサルタント詳細ページ関連
- `web/app/consultants/[id]/page.tsx` - Q&A回答一覧セクションを追加（最新10件程度）

### 型定義・DTO
- `web/lib/types/consultantList.ts` - **新規作成** 一覧用表示専用DTO型定義

### その他
- `web/lib/mockData.ts` - ConsultantWithReviews型にanswersと_countを追加
- `web/app/questions/new/page.tsx` - **新規作成** 質問投稿ページ（仮置き実装）

---

## 追加/変更した型・DTO

### 新規追加：`web/lib/types/consultantList.ts`

```typescript
// レビューサマリー
export type ReviewSummary = {
  avgScore: number | null;
  count: number;
};

// Q&Aサマリー
export type QASummary = {
  answerCount: number;
};

// 最新回答（抜粋）
export type LatestAnswer = {
  questionId: string;
  questionTitle: string;
  answerExcerpt: string; // 2〜4行分の抜粋（約120文字）
  answeredAt: Date;
};

// コンサルタント一覧用DTO
export type ConsultantListDTO = Pick<Consultant, ...> & {
  reviewSummary: ReviewSummary;
  qaSummary: QASummary;
  latestAnswers: LatestAnswer[];
};
```

### 変更：`ConsultantWithReviews`型（`web/lib/mockData.ts`）

```typescript
export type ConsultantWithReviews = Consultant & {
  reviews: Review[];
  consultations?: any[];
  user?: any;
  answers?: Array<{...}>;  // 追加
  _count?: { answers: number };  // 追加
};
```

---

## クエリ方針

### コンサルタント一覧ページ（`web/app/consultants/page.tsx`）

**最適化方針：**
- `select`を使用して必要なフィールドのみ取得（N+1回避）
- 回答は最新3件まで取得（`take: 3`）
- 回答の`content`は全文取得（フロントエンドで抜粋生成）
- レビューは承認済みのみを考慮（フロントエンドでフィルタリング）

**クエリ構造：**
```typescript
prisma.consultant.findMany({
  select: {
    id: true,
    name: true,
    ageRange: true,
    previousIndustry: true,
    previousJobFunction: true,
    specialtyJobFunctions: true,
    expertiseRoles: true,
    headline: true,
    reviews: { select: { type: true, score: true, isApproved: true } },
    _count: { select: { answers: true } },
    answers: {
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        question: { select: { id: true, title: true } },
      },
    },
  },
  orderBy: { createdAt: 'desc' },
});
```

### コンサルタント詳細ページ（`web/app/consultants/[id]/page.tsx`）

**最適化方針：**
- 回答は最新10件まで取得（`take: 10`）
- 質問情報も同時に取得（N+1回避）

**クエリ構造：**
```typescript
prisma.consultant.findUnique({
  where: { id },
  include: {
    reviews: true,
    consultations: true,
    user: true,
    answers: {
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        question: { select: { id: true, title: true } },
      },
    },
    _count: { select: { answers: true } },
  },
});
```

---

## 実装済み機能

### ✅ トップページ
- [x] ファーストビュー：キャッチコピー「キャリアの悩みを、人の回答で選ぶ。」
- [x] サブコピー：「匿名の質問に、複数のキャリアコンサルタントが公開で答えます。」
- [x] CTA 2つのみ：「質問してみる」（Primary）、「Q&Aを見る」（Secondary）
- [x] 新着Q&Aセクション（5-8件表示、質問者属性、回答数、最新回答日時）
- [x] 回答が見えるコンサルタントセクション（回答が活発なコンサル、最新回答1件抜粋）
- [x] サービス説明セクション（3ステップのみ、各1行）

### ✅ コンサルタント一覧ページ
- [x] カード構成：
  - A. 上部：最小プロフィール（表示名、年代、前職業界/職種、得意領域タグ、指標ミニ）
  - B. 中央：回答一覧（固定高さ＋縦スクロール、最新3件まで）
  - C. 下部：CTA（「詳細を見る」「この人に相談する」）
- [x] データ取得最適化（回答抜粋のみ、N+1回避）
- [x] 回答抜粋生成ロジック（文の途中で切れないように）

### ✅ コンサルタント詳細ページ
- [x] この人のQ&A回答一覧（最新10件程度）
- [x] 回答がない場合の表示
- [x] 回答が10件を超える場合の「すべての回答を見る」リンク

---

## 未対応・後回しのTODO一覧

### 高優先度
1. **質問投稿機能の実装** (`/questions/new`)
   - 現在は仮置きページのみ
   - 匿名質問フォームの実装が必要
   - 質問者属性（年代/業界/職種）の入力
   - 質問タイトル・本文の投稿

2. **Q&A詳細ページの実装** (`/questions/[id]`)
   - 質問本文の表示
   - 複数の回答の表示
   - 回答投稿機能（コンサルタント向け）

3. **Q&A一覧ページのフィルタリング**
   - コンサルタント別フィルタ（`/questions?consultant=${id}`）
   - 質問者属性別フィルタ
   - 回答数でのソート

### 中優先度
4. **回答抜粋の最適化**
   - 現在はフロントエンドで抜粋生成
   - DB側で抜粋を生成する場合のパフォーマンス検討

5. **レコメンド機能**
   - 回答が活発なコンサルタントのレコメンド
   - 質問内容に基づくコンサルタントレコメンド

6. **会社親アカウント機能**
   - 複数コンサルタントを管理する会社アカウント

7. **SNS連携**
   - Twitter/X連携
   - LinkedIn連携

### 低優先度
8. **パフォーマンス最適化**
   - 回答抜粋のキャッシュ
   - ページネーションの実装
   - 無限スクロールの検討

9. **UI/UX改善**
   - 回答カードのアニメーション
   - 回答の「いいね」機能
   - 回答のシェア機能

---

## 設計方針の確認

### ✅ サービスの前提（最重要）
- CareerSelectは「コンサルを売るサイト」ではない
- 公開Q&Aを起点に、回答内容（思考力・スタンス・人間性）を見て求職者が納得して個人のコンサルタントを指名できるサービス

### ✅ UI・情報設計の主役
- プロフィール ＜ 回答内容
- 実績の主張 ＜ 比較可能な中身
- 売り込み ＜ 判断材料

### ✅ トップページ設計
- トップページは「動いているQ&Aの場」を見せる入口
- コンサルや実績を並べる営業ページではない

### ✅ コンサルタント一覧ページ設計
- 一覧は「プロフィール棚」ではなく、「この人はどんな回答をするか」を比較する場
- 回答内容を中心に配置

---

## 技術的な注意点

1. **型安全性**
   - `select`を使用した場合の型アサーションが必要
   - `ConsultantWithReviews`型を拡張して対応

2. **N+1問題の回避**
   - `include`と`select`を適切に使用
   - 必要な関連データを一度に取得

3. **パフォーマンス**
   - 回答は最新3件（一覧）または10件（詳細）まで取得
   - 全文取得してフロントエンドで抜粋生成（DB側での文字列操作は非効率）

4. **既存実装との互換性**
   - 既存のレビュー投稿→承認→表示機能は維持
   - 既存の予約導線は維持
   - 既存のコンサルタント詳細ページの構造は維持

---

## 次のステップ

1. 質問投稿機能の実装（`/questions/new`）
2. Q&A詳細ページの実装（`/questions/[id]`）
3. Q&A一覧ページのフィルタリング機能
4. 回答投稿機能（コンサルタント向け）

---

## 参考

- 要件定義: ユーザーからの指示に基づく
- 既存実装: `web/app/consultants/`, `web/app/_components/`
- データモデル: `web/prisma/schema.prisma`

