# Vercel環境変数設定ガイド

## 問題

Vercelのログに以下のエラーが表示されています：

```
Error querying the database: Error code 14: Unable to open the database file
```

これは、Vercelの環境変数に `DATABASE_URL` が設定されていないため、PrismaがSQLiteに接続しようとしているためです。

## 解決方法

### ステップ1: Vercelダッシュボードで環境変数を設定

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」に移動
4. 以下の環境変数を追加：

```
変数名: DATABASE_URL
値: postgresql://neondb_owner:npg_bQnOld1Z3gXt@ep-cool-cell-a1v3wpli-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**重要:**
- Production、Preview、Development すべての環境に適用してください
- 値は引用符（`"`）で囲まないでください

### ステップ2: デプロイを再実行

環境変数を設定した後、以下のいずれかの方法でデプロイを再実行してください：

**方法A: 自動再デプロイ**
- 環境変数を追加すると、Vercelが自動的に再デプロイを開始します

**方法B: 手動で再デプロイ**
1. 「Deployments」タブに移動
2. 最新のデプロイメントを選択
3. 「Redeploy」をクリック

### ステップ3: 動作確認

デプロイ完了後、以下を確認してください：

1. コンサルタント一覧ページ（`/consultants`）が正常に表示されるか
2. コンサルタント詳細ページ（`/consultants/[id]`）が正常に表示されるか
3. VercelのログでSQLiteエラーが発生していないか

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

Vercelダッシュボードの「Settings」→「Environment Variables」で、以下を確認：

- `DATABASE_URL` が存在する
- 値が正しい（Neonの接続文字列）
- Production、Preview、Development すべてに適用されている

## トラブルシューティング

### エラーが続く場合

1. **環境変数の再設定**
   - 環境変数を一度削除して、再度追加してください

2. **デプロイの完全再実行**
   - 「Deployments」→「Redeploy」で完全に再デプロイしてください

3. **Prisma Clientの再生成**
   - ローカルで `npx prisma generate` を実行
   - 変更をコミット・プッシュ
   - Vercelで再デプロイ

### 接続エラーが発生する場合

- DATABASE_URLの値が正しいか確認
- Neonのデータベースが起動しているか確認
- `?sslmode=require&channel_binding=require` が含まれているか確認

