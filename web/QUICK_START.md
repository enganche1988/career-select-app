# PostgreSQL移行 - クイックスタート

## 🚀 すぐに始める（3ステップ）

### ステップ1: DATABASE_URLを設定

`web/.env`ファイルを開き、Neonの実際のDATABASE_URLに置き換えてください：

```bash
DATABASE_URL="postgresql://実際の接続文字列?sslmode=require"
```

### ステップ2: マイグレーション実行

```bash
cd web

# 既存のSQLiteマイグレーションを削除（PostgreSQL用に再作成）
rm -rf prisma/migrations

# 新しいPostgreSQLマイグレーションを作成
npx prisma migrate dev --name init_postgresql

# シードデータを投入
npx prisma db seed
```

### ステップ3: 動作確認

```bash
npm run dev
```

http://localhost:3000/consultants にアクセスして動作確認してください。

---

## 📋 完了した作業

- ✅ PrismaスキーマをPostgreSQL用に更新
- ✅ package.jsonのビルドスクリプトを更新
- ✅ migration_lock.tomlをPostgreSQL用に更新
- ✅ .envファイルのテンプレートを作成

## ⚠️ 残りの作業

1. **.envファイルにNeonの実際のDATABASE_URLを設定** ← これが必須です！
2. `npx prisma migrate dev --name init_postgresql` を実行
3. `npx prisma db seed` でシードデータを投入
4. Vercelの環境変数にDATABASE_URLを設定
5. 本番環境でマイグレーションを実行

---

## 🔍 DATABASE_URLの確認方法

Neonダッシュボードで：
1. プロジェクトを選択
2. 「Connection Details」を開く
3. 「Connection String」をコピー
4. 末尾に`?sslmode=require`を追加（まだ含まれていない場合）

例：
```
postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```
