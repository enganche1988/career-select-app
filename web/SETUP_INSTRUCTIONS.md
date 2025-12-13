# PostgreSQL移行セットアップ手順

## ⚠️ 重要: まず最初に実行してください

### 1. NeonのDATABASE_URLを.envファイルに設定

`web/.env`ファイルを開き、以下のプレースホルダーを実際のNeonのDATABASE_URLに置き換えてください：

```bash
# 現在（プレースホルダー）
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# 実際のNeonのDATABASE_URLに置き換え
DATABASE_URL="postgresql://実際のユーザー名:実際のパスワード@実際のホスト.neon.tech/実際のDB名?sslmode=require"
```

**NeonのDATABASE_URLの取得方法:**
1. Neonダッシュボードにログイン
2. プロジェクトを選択
3. 「Connection Details」または「Connection String」を確認
4. `postgresql://`で始まる接続文字列をコピー
5. 末尾に`?sslmode=require`を追加（まだ含まれていない場合）

## 2. マイグレーションの実行

DATABASE_URLを設定したら、以下のコマンドを実行してください：

```bash
cd web

# 1. 既存のSQLiteマイグレーションを削除（PostgreSQL用に再作成するため）
# 注意: これは開発環境のみで実行してください
rm -rf prisma/migrations

# 2. 新しいPostgreSQLマイグレーションを作成
npx prisma migrate dev --name init_postgresql

# 3. シードデータを投入（オプション）
npx prisma db seed

# 4. 動作確認
npm run dev
```

## 3. 本番環境（Vercel）の設定

### 3-1. Vercel環境変数の設定

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」に移動
4. 以下の環境変数を追加：

```
変数名: DATABASE_URL
値: （Neonの本番環境用DATABASE_URL）
```

**重要:**
- Production、Preview、Developmentすべての環境に適用
- `?sslmode=require`を含める

### 3-2. 本番環境でのマイグレーション実行

Vercelにデプロイ後、以下のいずれかの方法でマイグレーションを実行：

**方法A: ローカルから実行（推奨）**

```bash
# 本番環境のDATABASE_URLを一時的に設定
export DATABASE_URL="postgresql://本番環境の接続文字列"

# マイグレーションを実行
npx prisma migrate deploy
```

**方法B: Vercelのデプロイフックを使用**

Vercelの「Settings」→「Git」で、デプロイ後にマイグレーションを実行するスクリプトを設定することも可能です。

## 4. トラブルシューティング

### DATABASE_URLが設定されていないエラー

```
Error: P1001: Can't reach database server
```

→ `.env`ファイルに正しいDATABASE_URLが設定されているか確認してください。

### マイグレーションエラー

```bash
# マイグレーション状態を確認
npx prisma migrate status

# マイグレーションをリセット（開発環境のみ）
npx prisma migrate reset
```

### Prisma Clientのエラー

```bash
# Prisma Clientを再生成
npx prisma generate
```

## 5. 次のステップ

1. ✅ `.env`ファイルにNeonのDATABASE_URLを設定
2. ✅ `npx prisma migrate dev --name init_postgresql`を実行
3. ✅ `npx prisma db seed`でシードデータを投入
4. ✅ `npm run dev`で動作確認
5. ✅ Vercelの環境変数にDATABASE_URLを設定
6. ✅ 本番環境でマイグレーションを実行
7. ✅ デプロイして動作確認
