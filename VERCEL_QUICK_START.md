# Vercelデプロイ クイックスタート

## 5分でデプロイする手順

### 1. GitHubにコードをプッシュ（未プッシュの場合）

```bash
git add .
git commit -m "Q&A主役化への構造・UI改修"
git push origin main
```

### 2. Vercelにログイン

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン

### 3. プロジェクトをインポート

1. 「Add New...」→「Project」をクリック
2. GitHubリポジトリ `enganche1988/career-select-app` を選択
3. 設定を確認:
   - **Framework Preset**: Next.js（自動検出）
   - **Root Directory**: `web`（自動設定されるはず）
4. **「Environment Variables」を設定**（重要！）

### 4. 環境変数を設定

「Environment Variables」セクションで以下を追加:

#### `DATABASE_URL`
- **Value**: Neon PostgreSQLの接続文字列
  - 例: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development すべてにチェック

#### `BLOB_READ_WRITE_TOKEN`（画像アップロードを使用する場合）
- **Value**: Vercel Blob Storageのトークン
- **取得方法**: Vercelダッシュボード → Storage → Blob → Create → Tokenをコピー
- **Environment**: ✅ Production, ✅ Preview, ✅ Development すべてにチェック

### 5. デプロイ

「Deploy」ボタンをクリック

### 6. デプロイ完了を待つ

- ビルドログを確認（エラーがないか）
- 「Ready」と表示されたら完了

### 7. データベースマイグレーション（初回のみ）

デプロイ後、データベースのマイグレーションを実行:

```bash
cd web
export DATABASE_URL="あなたのNeon PostgreSQL接続文字列"
npm run db:migrate:deploy
```

### 8. 確認

デプロイされたURL（例: `https://career-select-app.vercel.app`）にアクセスして確認

---

## よくある問題

### ビルドエラーが出る場合

1. **環境変数が設定されているか確認**
   - Vercelダッシュボード → Settings → Environment Variables

2. **DATABASE_URLが正しいか確認**
   - Neonダッシュボードで接続文字列を確認
   - `sslmode=require`が含まれているか確認

3. **ビルドログを確認**
   - デプロイメント → Build Logs でエラー内容を確認

### サイトが表示されない場合

1. **データベースマイグレーションを実行**
   ```bash
   cd web
   export DATABASE_URL="あなたの接続文字列"
   npm run db:migrate:deploy
   ```

2. **環境変数が正しく設定されているか確認**
   - Production環境に設定されているか確認

---

## 詳細な手順

より詳しい手順は `VERCEL_DEPLOYMENT_GUIDE.md` を参照してください。

