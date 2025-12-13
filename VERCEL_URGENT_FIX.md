# Vercelデプロイエラー緊急修正ガイド

## 問題

Vercelが古いコミット（2ae04c8）を参照し続けています。最新のコミット（31c8e7e）が反映されていません。

## 根本原因

Vercelダッシュボードで、**特定のコミットが固定されている**か、**GitHubのwebhookが正しく動作していない**可能性があります。

## 緊急対応手順

### 方法1: Vercelダッシュボードで手動デプロイ（推奨）

1. **Vercelダッシュボードにログイン**
2. **プロジェクトを選択**
3. **Deployments** タブを開く
4. **「Deploy」ボタンをクリック**
5. **「Deploy from GitHub」を選択**
6. **ブランチ**: `main` を選択
7. **コミット**: 最新のコミット（31c8e7e以降）を選択
8. **「Deploy」を実行**

### 方法2: VercelダッシュボードでRoot Directoryを設定

1. **Vercelダッシュボード** → **Settings** → **General**
2. **Root Directory** を確認
   - 空欄または設定されていない場合: `web` を入力
   - 既に設定されている場合: `web` に変更
3. **「Save」をクリック**
4. **再デプロイを実行**

### 方法3: GitHubのwebhookを確認

1. **GitHubリポジトリ** → **Settings** → **Webhooks**
2. **Vercelのwebhook**が存在するか確認
3. 存在しない場合、Vercelダッシュボードから再設定

### 方法4: Vercel CLIで直接デプロイ

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# ログイン
vercel login

# プロジェクトをリンク
cd /Users/tatsuofujimura/Desktop/career-select-app
vercel link

# 本番環境にデプロイ
vercel --prod
```

## 確認事項

### 1. 最新コミットの確認

```bash
git log --oneline -3
```

期待される出力:
```
31c8e7e Add vercel.json to set rootDirectory to web
36dbed9 Add file upload feature for thumbnail images using Vercel Blob Storage
441d8fe Fix: Import parseStringArray from @/lib/types/consultant in profile page
```

### 2. vercel.jsonの確認

ルートディレクトリに`vercel.json`が存在し、以下の内容であることを確認:

```json
{
  "buildCommand": "cd web && npm run build",
  "installCommand": "cd web && npm install",
  "framework": "nextjs",
  "rootDirectory": "web"
}
```

### 3. Vercelのデプロイログ確認

Vercelのデプロイログで以下を確認:
- **期待されるコミット**: `31c8e7e` 以降
- **実際のコミット**: `2ae04c8`（これが問題）

## 最も確実な解決方法

**Vercelダッシュボードで手動デプロイ**が最も確実です：

1. Vercelダッシュボード → Deployments
2. 「Deploy」ボタンをクリック
3. 最新のコミット（31c8e7e）を選択
4. Root Directoryを`web`に設定
5. デプロイを実行

## 注意事項

- Vercelの自動デプロイが正しく動作していない可能性があります
- GitHubのwebhookが正しく設定されていない可能性があります
- Vercelダッシュボードで特定のコミットが固定されている可能性があります

## 次のステップ

上記の方法1（手動デプロイ）を実行してください。これが最も確実な解決方法です。

