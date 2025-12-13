# Vercelデプロイエラー修正ガイド

## 問題

Vercelが古いコミット（2ae04c8）をデプロイしようとしていますが、最新のコミット（36dbed9）が反映されていません。

## 原因

Vercelの設定で以下が原因の可能性があります：
1. **Root Directory設定**: `web`ディレクトリが正しく設定されていない
2. **GitHub連携**: webhookが正しく動作していない
3. **キャッシュ**: ビルドキャッシュが古い状態を保持している

## 解決方法

### 方法1: VercelダッシュボードでRoot Directoryを確認

1. **Vercelダッシュボードにログイン**
2. **プロジェクトを選択**
3. **Settings** → **General**
4. **Root Directory** を確認
   - `web` に設定されているか確認
   - 設定されていない場合は `web` に変更して保存

### 方法2: 手動で再デプロイ

1. **Vercelダッシュボード** → **Deployments**
2. **最新のデプロイメント**を選択
3. **Redeploy** をクリック
4. **Use existing Build Cache** のチェックを外す
5. **Redeploy** を実行

### 方法3: GitHubの最新コミットを確認

```bash
# ローカルで最新のコミットを確認
git log --oneline -3

# リモートの最新コミットを確認
git fetch origin
git log origin/main --oneline -3
```

### 方法4: Vercelのキャッシュをクリア

1. **Vercelダッシュボード** → **Settings** → **General**
2. **Clear Build Cache** をクリック
3. 再デプロイを実行

## 確認事項

### 1. Root Directory設定

Vercelダッシュボードで以下を確認：
- **Root Directory**: `web` に設定されているか
- **Build Command**: `npm run build` が正しく設定されているか
- **Output Directory**: `.next` が正しく設定されているか

### 2. 環境変数

以下が正しく設定されているか確認：
- `DATABASE_URL`: PostgreSQL接続文字列
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storage用（ファイルアップロード機能用）

### 3. 最新コミットの確認

Vercelのデプロイログで、以下のコミットが使用されているか確認：
- **期待されるコミット**: `36dbed9` (Add file upload feature...)
- **実際のコミット**: `2ae04c8` (Remove invalid rootDirectory...)

もし古いコミットが使用されている場合は、上記の方法で修正してください。

## トラブルシューティング

### まだ古いコミットがデプロイされる場合

1. **GitHubのwebhookを確認**
   - GitHubリポジトリ → Settings → Webhooks
   - Vercelのwebhookが正しく設定されているか確認

2. **手動でデプロイをトリガー**
   - Vercelダッシュボード → Deployments → Deploy
   - GitHubのブランチを選択してデプロイ

3. **Vercel CLIでデプロイ**
   ```bash
   cd web
   vercel --prod
   ```

## 期待されるビルドログ

正常な場合、以下のようなログが表示されます：

```
Cloning github.com/enganche1988/career-select-app (Branch: main, Commit: 36dbed9)
...
✔ Generated Prisma Client
...
✓ Compiled successfully
✓ Running TypeScript ...
```

**エラーの場合**（現在）:
```
Cloning github.com/enganche1988/career-select-app (Branch: main, Commit: 2ae04c8)
...
Failed to compile.
Type error: Cannot find name 'parseStringArray'.
```

