# PostgreSQL移行 - 実行手順

## ✅ 完了した作業

1. ✅ PrismaスキーマをPostgreSQL用に更新
2. ✅ package.jsonにビルドスクリプトを追加
3. ✅ セットアップスクリプトを作成
4. ✅ ドキュメントを作成

## 🎯 次に実行すること

### 1. .envファイルの作成

Neon PostgreSQLのDATABASE_URLを設定：

```bash
cd web
cat > .env << ENVEOF
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENVEOF
```

### 2. マイグレーションの実行

```bash
# 自動セットアップスクリプトを使用（推奨）
./setup-database.sh

# または手動で実行
npx prisma migrate reset
npx prisma migrate dev --name init_postgresql
npx prisma generate
npx prisma db seed
```

### 3. 動作確認

```bash
npm run dev
```

## 📚 参考ドキュメント

- `QUICK_START.md` - クイックスタートガイド
- `SETUP_INSTRUCTIONS.md` - 詳細なセットアップ手順
- `MIGRATION_GUIDE.md` - 移行ガイド

