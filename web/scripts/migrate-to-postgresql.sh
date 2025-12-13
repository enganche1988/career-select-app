#!/bin/bash

# PostgreSQL移行スクリプト
# 使用方法: ./scripts/migrate-to-postgresql.sh

set -e

echo "🚀 PostgreSQL移行スクリプトを開始します..."
echo ""

# DATABASE_URLの確認
if ! grep -q "postgresql://" .env 2>/dev/null || grep -q "host.neon.tech" .env 2>/dev/null; then
  echo "❌ エラー: .envファイルにNeonの実際のDATABASE_URLが設定されていません"
  echo ""
  echo "以下の手順で設定してください:"
  echo "1. NeonダッシュボードでDATABASE_URLを取得"
  echo "2. .envファイルを開く"
  echo "3. DATABASE_URLの値を実際の接続文字列に置き換える"
  echo ""
  exit 1
fi

echo "✅ DATABASE_URLが設定されていることを確認しました"
echo ""

# 既存のSQLiteマイグレーションをバックアップ
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations/*/migration.sql 2>/dev/null | wc -l)" -gt 0 ]; then
  echo "📦 既存のSQLiteマイグレーションをバックアップします..."
  BACKUP_DIR="prisma/migrations_backup_$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$BACKUP_DIR"
  cp -r prisma/migrations/* "$BACKUP_DIR/" 2>/dev/null || true
  echo "✅ バックアップ完了: $BACKUP_DIR"
  echo ""
fi

# 既存のSQLiteマイグレーションを削除
echo "🗑️  既存のSQLiteマイグレーションを削除します..."
rm -rf prisma/migrations/*
echo "✅ 削除完了"
echo ""

# Prisma Clientを再生成
echo "🔧 Prisma Clientを再生成します..."
npx prisma generate
echo "✅ 再生成完了"
echo ""

# 新しいPostgreSQLマイグレーションを作成
echo "📝 新しいPostgreSQLマイグレーションを作成します..."
npx prisma migrate dev --name init_postgresql
echo "✅ マイグレーション作成完了"
echo ""

# シードデータを投入
echo "🌱 シードデータを投入します..."
npx prisma db seed
echo "✅ シードデータ投入完了"
echo ""

echo "🎉 PostgreSQL移行が完了しました！"
echo ""
echo "次のステップ:"
echo "1. npm run dev で動作確認"
echo "2. Vercelの環境変数にDATABASE_URLを設定"
echo "3. 本番環境でマイグレーションを実行"

