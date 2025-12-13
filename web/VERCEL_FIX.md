# Vercel本番環境エラー修正ガイド

## 問題

Vercel本番環境で以下のエラーが発生しています：
- Application error: a server-side exception has occurred
- Digest: 3921554145

これは、SQLite接続エラー（Error code 14: Unable to open the database file）の可能性が高いです。

## 原因

1. **Vercelの環境変数にDATABASE_URLが設定されていない**
2. **本番環境でマイグレーションが適用されていない**

## 解決方法

### ステップ1: Vercelの環境変数を設定（最重要）

1. Vercelダッシュボードにログイン: https://vercel.com/dashboard
2. プロジェクト `career-select-app` を選択
3. 「Settings」→「Environment Variables」に移動
4. 以下の環境変数を追加：

```
変数名: DATABASE_URL
値: postgresql://neondb_owner:npg_bQnOld1Z3gXt@ep-cool-cell-a1v3wpli-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**重要:**
- ✅ Production、Preview、Development すべての環境に適用
- ✅ 値は引用符（`"`）で囲まない
- ✅ 環境変数を追加すると自動的に再デプロイが開始されます

### ステップ2: デプロイを確認

1. 「Deployments」タブに移動
2. 最新のデプロイメントの状態を確認
3. ビルドログで以下を確認：
   - `prisma generate` が実行されている
   - `prisma migrate deploy` が実行されている（新しいbuildスクリプト）
   - エラーが発生していない

### ステップ3: 動作確認

デプロイ完了後、以下を確認：

1. コンサルタントダッシュボード（`/dashboard`）が正常に表示されるか
2. コンサルタント一覧（`/consultants`）が正常に表示されるか
3. VercelのログでPostgreSQL接続のログが表示されるか

## 確認方法

### Vercelのログで確認

1. Vercelダッシュボードで「Deployments」タブを開く
2. 最新のデプロイメントを選択
3. 「Functions」タブでログを確認
4. 以下のようなログが表示されていれば成功：
   ```
   prisma:info Starting a postgresql pool with 5 connections.
   ```

### 環境変数の確認

Vercelダッシュボードの「Settings」→「Environment Variables」で確認：

- ✅ `DATABASE_URL` が存在する
- ✅ 値が正しい（Neonの接続文字列）
- ✅ Production、Preview、Development すべてに適用されている

## トラブルシューティング

### エラーが続く場合

1. **環境変数の再設定**
   - 環境変数を一度削除
   - 再度追加（値は引用符なし）
   - 再デプロイを待つ

2. **ビルドログの確認**
   - 「Deployments」→ 最新のデプロイメント → 「Build Logs」
   - `prisma generate` と `prisma migrate deploy` が実行されているか確認
   - エラーメッセージがないか確認

3. **手動で再デプロイ**
   - 「Deployments」→ 最新のデプロイメント → 「Redeploy」

### 接続エラーが発生する場合

- DATABASE_URLの値が正しいか確認
- Neonのデータベースが起動しているか確認
- `?sslmode=require&channel_binding=require` が含まれているか確認

## 変更内容

`package.json`のbuildスクリプトを更新しました：

```json
"build": "prisma generate && prisma migrate deploy && next build"
```

これにより、Vercelでのビルド時に：
1. Prisma Clientが生成される
2. 本番環境のマイグレーションが適用される
3. Next.jsアプリがビルドされる

## 次のステップ

1. ✅ Vercelの環境変数にDATABASE_URLを設定
2. ✅ 自動再デプロイを待つ（または手動でRedeploy）
3. ✅ 動作確認

