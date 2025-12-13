#!/bin/bash
# PostgreSQL移行セットアップスクリプト

set -e

echo "🚀 PostgreSQL移行セットアップを開始します..."

# .envファイルの確認
if [ ! -f .env ]; then
    echo "❌ .envファイルが見つかりません"
    echo "📝 .envファイルを作成して、Neon PostgreSQLのDATABASE_URLを設定してください"
    echo ""
    echo "例:"
    echo 'DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"'
    exit 1
fi

# DATABASE_URLの確認
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ .envファイルにDATABASE_URLが設定されていません"
    exit 1
fi

echo "✅ .envファイルを確認しました"

# Prisma Clientの再生成
echo "📦 Prisma Clientを再生成中..."
npx prisma generate

# マイグレーションのリセット（確認付き）
echo ""
echo "⚠️  既存のデータベースをリセットしますか？ (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🔄 データベースをリセット中..."
    npx prisma migrate reset
else
    echo "⏭️  リセットをスキップしました"
fi

# 新しいマイグレーションの作成
echo "📝 新しいマイグレーションを作成中..."
npx prisma migrate dev --name init_postgresql

# シードデータの投入
echo "🌱 シードデータを投入中..."
npx prisma db seed || echo "⚠️  シードデータの投入に失敗しました（スキップ）"

echo ""
echo "✅ セットアップが完了しました！"
echo "🚀 開発サーバーを起動: npm run dev"
