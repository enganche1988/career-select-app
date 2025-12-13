#!/bin/bash
# .envファイル作成ヘルパースクリプト

echo "📝 Neon PostgreSQLのDATABASE_URLを入力してください"
echo "例: postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
echo ""
read -p "DATABASE_URL: " db_url

if [ -z "$db_url" ]; then
    echo "❌ DATABASE_URLが入力されませんでした"
    exit 1
fi

# .envファイルを作成
cat > .env << ENVFILE
# Database
DATABASE_URL="${db_url}"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENVFILE

echo "✅ .envファイルを作成しました"
echo ""
echo "次のステップ:"
echo "1. ./setup-database.sh を実行してマイグレーションを実行"
echo "2. または手動で以下を実行:"
echo "   npx prisma migrate reset"
echo "   npx prisma migrate dev --name init_postgresql"
echo "   npx prisma generate"
echo "   npx prisma db seed"
