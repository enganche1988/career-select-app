# Vercel SQLiteエラー修正ガイド

## 問題の原因

VercelでSQLiteエラーが発生する原因は、**ルートディレクトリに古いSQLite設定の`prisma/schema.prisma`が残っている**ためです。

Vercelのビルド時に、ルートの`prisma`ディレクトリが優先的に使われ、SQLite接続を試みてエラーになっています。

## 解決方法

### 方法1: VercelのRoot Directory設定を確認（推奨）

1. Vercelダッシュボードにログイン
2. プロジェクト設定 → **Settings** → **General**
3. **Root Directory** が `web` に設定されているか確認
4. 設定されていない場合は `web` に変更して保存

### 方法2: .vercelignoreでルートのprismaを無視

既に`.vercelignore`ファイルを作成済みです。これにより、ルートの`prisma`ディレクトリがビルド時に無視されます。

### 方法3: ルートのprismaディレクトリを削除（最も確実）

```bash
# ルートのprismaディレクトリを削除（バックアップ推奨）
rm -rf prisma/
```

## 確認手順

1. **Vercelの環境変数を確認**
   - `DATABASE_URL`が正しく設定されているか
   - Production, Preview, Developmentすべての環境に設定されているか

2. **ビルドログを確認**
   - Vercelのデプロイログで以下を確認：
     - `prisma generate`が正常に実行されているか
     - `Starting a postgresql pool`と表示されているか（SQLiteではない）
     - `prisma migrate deploy`が正常に実行されているか

3. **再デプロイ**
   - 設定変更後、必ず再デプロイを実行

## 期待されるビルドログ

正常な場合、以下のようなログが表示されます：

```
[info] prisma:info Starting a postgresql pool with 5 connections.
[info] prisma:info Migration applied successfully
```

**エラーの場合**（修正前）:
```
[info] prisma:info Starting a sqlite pool with 5 connections.
[error] Error code 14: Unable to open the database file
```

## トラブルシューティング

### まだSQLiteエラーが出る場合

1. **Vercelのキャッシュをクリア**
   - Vercelダッシュボード → Settings → General → Clear Build Cache

2. **環境変数の再設定**
   - `DATABASE_URL`を一度削除して再設定

3. **ルートのprismaディレクトリを完全に削除**
   ```bash
   rm -rf prisma/
   git add .
   git commit -m "Remove root prisma directory (using web/prisma only)"
   git push
   ```

4. **VercelのRoot Directory設定を再確認**
   - 必ず `web` に設定されていることを確認

