# エンジニア引き継ぎドキュメント

## 更新日
2025-12-13

## 目的
このドキュメントは、暫定対応や技術的負債を明確にし、エンジニア引き継ぎ時に必要な情報を整理したものです。

---

## 現状

### プロジェクト概要
- **プロジェクト名**: CareerSelect
- **フレームワーク**: Next.js 16.0.7 (App Router)
- **データベース**: PostgreSQL (Neon) - 本番環境、SQLite - ローカル開発（移行中）
- **デプロイ先**: Vercel
- **言語**: TypeScript, React 19.2.0

### 現在の状態
- ✅ 公開ページ（トップ/一覧/詳細）は表示可能（ダミーデータ対応）
- ✅ 管理画面（ダッシュボード/プロフィール編集）は実装済み
- ⚠️ Vercelビルドは成功するが、DB接続は未確立（暫定対応でダミーデータを使用）
- ⚠️ `prisma migrate deploy`はbuildスクリプトから削除済み（暫定対応）

---

## 暫定対応（⚠️ 修正が必要）

### 1. DB非依存の公開ページ

**現状**:
- 公開ページ（`/`, `/consultants`, `/consultants/[id]`）はDB接続失敗時にダミーデータを使用
- `web/lib/mockData.ts`に固定のダミーコンサルタントデータを定義

**影響範囲**:
- `web/app/_components/HeroSection.tsx`
- `web/app/consultants/page.tsx`
- `web/app/_components/TopConsultantsSection.tsx`
- `web/app/consultants/[id]/page.tsx`

**修正方法**:
1. Vercel環境変数に`DATABASE_URL`を設定（Neon PostgreSQL接続情報）
2. 各公開ページコンポーネントからダミーデータフォールバックを削除
3. 適切なエラーハンドリングに置き換える（エラーメッセージ表示、ログ記録）
4. `web/lib/mockData.ts`を削除（または開発用のみに残す）

**関連ファイル**:
- `web/lib/mockData.ts` - ダミーデータ定義
- `web/app/_components/HeroSection.tsx` - ダミーデータ使用箇所
- `web/app/consultants/page.tsx` - ダミーデータ使用箇所
- `web/app/_components/TopConsultantsSection.tsx` - ダミーデータ使用箇所
- `web/app/consultants/[id]/page.tsx` - ダミーデータ使用箇所

### 2. migrate deployの削除

**現状**:
- `web/package.json`のbuildスクリプトから`prisma migrate deploy`を削除
- 現在のbuildスクリプト: `"build": "prisma generate && next build"`

**理由**:
- DB接続が未確立のため、`prisma migrate deploy`が失敗してビルドが落ちるのを防ぐため

**修正方法**:
1. Vercel環境変数に`DATABASE_URL`を設定
2. `web/package.json`のbuildスクリプトを以下に変更:
   ```json
   "build": "prisma generate && prisma migrate deploy && next build"
   ```
3. Vercelでビルドが成功することを確認

**関連ファイル**:
- `web/package.json` - buildスクリプト

### 3. ヘッダーナビの非表示

**現状**:
- 公開ユーザー向けヘッダーのナビリンクを非表示（`hidden`クラス）
- ロゴ（CareerSelect）クリックでトップに戻れる挙動は維持

**理由**:
- 初期フェーズではLP的な体験を優先
- ナビ項目が1つだけある状態のUX違和感を解消

**修正方法**:
- 必要に応じて、公開ユーザー向けナビリンクを復元
- または、適切なナビ項目を追加

**関連ファイル**:
- `web/app/layout.tsx` - ヘッダー定義

### 4. フッターのリンク整理

**現状**:
- フッターから内部向けリンク（コンサルタント用ダッシュボード）を削除
- 求職者向け情報のみ表示

**理由**:
- 公開UXをシンプルに保つ
- 内部導線を誤って踏ませない

**修正方法**:
- 必要に応じて、適切なリンクを追加

**関連ファイル**:
- `web/app/_components/Footer.tsx` - フッター定義

---

## 最終的に正すべき点（ToDo）

### 🔴 優先度：高（すぐに修正すべき）

1. **Vercel本番環境でのDB接続設定**
   - [ ] Vercel環境変数に`DATABASE_URL`を設定（Neon PostgreSQL接続情報）
   - [ ] 接続テストを実施
   - [ ] 本番環境でDB接続が成功することを確認

2. **migrate deployの復元**
   - [ ] `web/package.json`のbuildスクリプトに`prisma migrate deploy`を復元
   - [ ] Vercelでビルドが成功することを確認
   - [ ] マイグレーションが正しく適用されることを確認

3. **ダミーデータフォールバックの削除**
   - [ ] 各公開ページコンポーネントからダミーデータフォールバックを削除
   - [ ] 適切なエラーハンドリングに置き換える
   - [ ] `web/lib/mockData.ts`を削除（または開発用のみに残す）
   - [ ] エラーメッセージ表示とログ記録を実装

### 🟡 優先度：中（次の機能実装時に改善）

4. **エラーハンドリングの改善**
   - [ ] DB接続失敗時の適切なエラーメッセージ表示
   - [ ] エラーログの記録と監視
   - [ ] ユーザー向けの分かりやすいエラーメッセージ

5. **認証・権限管理の実装**
   - [ ] Admin/コンサルタント本人の適切な権限管理
   - [ ] 認証ライブラリ（Clerk/Auth0等）の導入検討

### 🟢 優先度：低（将来的な改善）

6. **パフォーマンス最適化**
   - [ ] データベースクエリの最適化
   - [ ] 画像の最適化（WebP対応等）
   - [ ] キャッシュ戦略の見直し

7. **テストの追加**
   - [ ] ユニットテストの追加
   - [ ] 統合テストの追加
   - [ ] E2Eテストの追加

---

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 16.0.7 (App Router)
- **UIライブラリ**: React 19.2.0
- **スタイリング**: Tailwind CSS 4
- **型定義**: TypeScript 5

### バックエンド
- **ORM**: Prisma 6.19.0
- **データベース**: PostgreSQL (Neon) - 本番環境、SQLite - ローカル開発（移行中）

### インフラ
- **デプロイ**: Vercel
- **ストレージ**: Vercel Blob Storage（画像アップロード用）

### 開発ツール
- **パッケージマネージャー**: npm
- **リンター**: ESLint
- **型チェック**: TypeScript

---

## 重要なファイル構成

### 公開ページ
- `web/app/page.tsx` - トップページ
- `web/app/consultants/page.tsx` - コンサルタント一覧
- `web/app/consultants/[id]/page.tsx` - コンサルタント詳細
- `web/app/_components/HeroSection.tsx` - ヒーローセクション
- `web/app/_components/TopConsultantsSection.tsx` - 注目コンサルタントセクション

### 管理画面
- `web/app/dashboard/page.tsx` - ダッシュボード
- `web/app/dashboard/profile/page.tsx` - プロフィール編集
- `web/app/dashboard/profile/actions.ts` - プロフィール更新アクション

### 共通コンポーネント
- `web/app/_components/ui/CanvaBackground.tsx` - Canva風背景
- `web/app/_components/ui/CanvaCard.tsx` - Canva風カード
- `web/app/_components/ui/CanvaButton.tsx` - Canva風ボタン
- `web/app/_components/ui/CanvaSection.tsx` - Canva風セクション

### 設定・型定義
- `web/prisma/schema.prisma` - Prismaスキーマ
- `web/lib/constants/profileOptions.ts` - プロフィール選択肢定数
- `web/lib/mockData.ts` - ダミーデータ（⚠️ 暫定対応）
- `web/lib/types/consultant.ts` - コンサルタント型定義

---

## 環境変数

### ローカル開発
- `DATABASE_URL` - PostgreSQL接続情報（Neon）
- `NEXT_PUBLIC_APP_URL` - アプリケーションURL

### Vercel本番環境（設定が必要）
- `DATABASE_URL` - PostgreSQL接続情報（Neon）⚠️ **未設定（暫定対応の原因）**
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage用トークン（画像アップロード用）

---

## ビルド・デプロイ

### ローカルビルド
```bash
cd web
npm run build
```

### Vercelデプロイ
- GitHubにpushすると自動デプロイ
- 現在はDB接続不要でビルド成功（暫定対応）

### マイグレーション
```bash
cd web
npm run db:migrate        # ローカル開発用
npm run db:migrate:deploy # 本番環境用（現在はbuildスクリプトから削除済み）
```

---

## 注意事項

### 暫定対応に触れる変更を行う場合
**必ず以下のドキュメントも同時に更新すること**:
- `CURRENT_STATUS.md` - 現状の整理
- `DEVELOPMENT_POLICY.md` - 開発方針
- `HANDOVER_FOR_ENGINEERS.md` - このドキュメント

詳細は `AGENT.md` を参照してください。

### コミット・PR時のチェックリスト
- [ ] 暫定対応に触れる変更がないか確認
- [ ] 暫定対応に触れる変更がある場合、関連ドキュメントを更新
- [ ] ローカルで `npm run build` が通ることを確認
- [ ] 変更内容を簡潔に要約

---

## 参考ドキュメント

- `AGENT.md` - AIエージェント運用ルール
- `CURRENT_STATUS.md` - 現状の整理
- `DEVELOPMENT_POLICY.md` - 開発方針
- `docs/consultant-management-spec.md` - コンサルタント管理構造の詳細仕様
- `docs/prisma-schema-migration-plan.md` - スキーマ移行プラン

