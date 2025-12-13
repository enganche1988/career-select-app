# Vercel SQLiteエラー修正完了

## 問題の原因

**ルートディレクトリに古いSQLite設定の`prisma/schema.prisma`が残っていた**ため、Vercelのビルド時にSQLite接続を試みてエラーになっていました。

## 実施した修正

### 1. `.vercelignore`を作成
ルートの`prisma`ディレクトリをビルド時に無視するように設定しました。

### 2. `web/vercel.json`を作成
Vercelのビルド設定を明示的に指定しました。

### 3. ルートの`prisma`ディレクトリを削除
古いSQLite設定の`prisma`ディレクトリを削除しました（`web/prisma`が正しいPostgreSQL設定です）。

## 次のステップ

### Vercelダッシュボードでの確認

1. **Root Directory設定を確認**
   - Vercelダッシュボード → Settings → General
   - **Root Directory** が `web` に設定されているか確認
   - 設定されていない場合は `web` に変更

2. **環境変数の確認**
   - Settings → Environment Variables
   - `DATABASE_URL`が正しく設定されているか確認
   - Production, Preview, Developmentすべての環境に設定されているか確認

3. **再デプロイ**
   - 設定変更後、必ず再デプロイを実行
   - または、新しいコミットをプッシュして自動デプロイ

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

3. **Root Directory設定を再確認**
   - 必ず `web` に設定されていることを確認

4. **ビルドログを確認**
   - デプロイログで`prisma generate`が正常に実行されているか確認
   - `Starting a postgresql pool`と表示されているか確認（SQLiteではない）

## 今後の注意点

- **Prismaスキーマは`web/prisma/schema.prisma`のみを使用**
- ルートディレクトリに`prisma`ディレクトリを作成しない
- VercelのRoot Directoryは必ず`web`に設定

