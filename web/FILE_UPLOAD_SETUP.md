# ファイルアップロード機能セットアップガイド

## 実装内容

サムネイル画像をURL入力からファイルアップロード形式に変更しました。

## 使用技術

- **Vercel Blob Storage**: ファイルをクラウドストレージに保存
- **Next.js Server Actions**: サーバーサイドでファイル処理

## セットアップ手順

### 1. Vercel Blob Storageの設定

Vercelダッシュボードで以下を設定してください：

1. **Vercelダッシュボードにログイン**
2. **プロジェクト設定** → **Storage** → **Create Database**
3. **Blob** を選択して作成
4. **環境変数の確認**:
   - `BLOB_READ_WRITE_TOKEN` が自動的に設定されます
   - ローカル開発用には、Vercel CLIで取得できます

### 2. ローカル開発環境の設定

ローカルで開発する場合、Vercel CLIを使用してトークンを取得：

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# ログイン
vercel login

# プロジェクトをリンク
cd web
vercel link

# 環境変数を取得
vercel env pull .env.local
```

または、`.env.local`に直接設定：

```bash
BLOB_READ_WRITE_TOKEN=your_token_here
```

### 3. 機能の確認

1. **プロフィール編集ページ** (`/dashboard/profile`) にアクセス
2. **サムネイル画像**セクションでファイルを選択
3. フォームを送信
4. アップロードされた画像が表示されることを確認

## ファイル構成

### 新規作成ファイル
- `web/app/api/upload/route.ts`: ファイルアップロード用APIルート（現在は未使用、将来の拡張用）

### 変更ファイル
- `web/app/dashboard/profile/page.tsx`: フォームをファイルアップロード形式に変更
- `web/app/dashboard/profile/actions.ts`: ファイルアップロード処理を追加

## 制限事項

- **ファイルサイズ**: 最大5MB
- **対応形式**: JPEG、PNG、WebP、GIF
- **ストレージ**: Vercel Blob Storage（無料プランでは制限あり）

## トラブルシューティング

### エラー: "BLOB_READ_WRITE_TOKEN is not defined"

**原因**: 環境変数が設定されていない

**解決方法**:
1. VercelダッシュボードでBlob Storageを作成
2. 環境変数が自動設定されているか確認
3. ローカル開発の場合は`.env.local`に設定

### エラー: "ファイルのアップロードに失敗しました"

**原因**: 
- ファイルサイズが5MBを超えている
- 対応していないファイル形式
- Vercel Blob Storageの設定が不完全

**解決方法**:
1. ファイルサイズを確認（5MB以下）
2. ファイル形式を確認（JPEG、PNG、WebP、GIF）
3. Vercel Blob Storageの設定を確認

### 画像が表示されない

**原因**: 
- アップロードは成功したが、URLが正しく保存されていない
- CORS設定の問題

**解決方法**:
1. データベースの`thumbnailUrl`フィールドを確認
2. ブラウザの開発者ツールでネットワークエラーを確認
3. Vercel Blob Storageのアクセス設定を確認（`access: 'public'`）

## 今後の拡張

- 画像のリサイズ・最適化
- 複数画像のアップロード
- 画像のプレビュー機能
- ドラッグ&ドロップ対応

