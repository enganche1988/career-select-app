# PostgreSQL移行ガイド

## 前提条件

- Neon PostgreSQL の DATABASE_URL を取得済み
- ローカル環境とVercel本番環境の両方でPostgreSQLを使用

## 移行手順

### 1. ローカル環境のセットアップ

#### 1-1. 環境変数の設定

`.env` ファイルを作成（または既存のものを更新）：

```bash
# .env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

**重要**: Neonの接続URLには `?sslmode=require` を必ず含めてください。

#### 1-2. 既存のマイグレーションをリセット

```bash
cd web
npx prisma migrate reset
```

このコマンドは：
- 既存のデータベースを削除
- 新しいスキーマでデータベースを再作成
- シードデータを投入

**警告**: このコマンドは既存のデータをすべて削除します。本番環境では実行しないでください。

#### 1-3. 新しいマイグレーションを作成

```bash
npx prisma migrate dev --name init_postgresql
```

#### 1-4. Prisma Client を再生成

```bash
npx prisma generate
```

#### 1-5. シードデータの投入（オプション）

```bash
npx prisma db seed
```

### 2. Vercel本番環境のセットアップ

#### 2-1. Vercel環境変数の設定

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」に移動
4. 以下の環境変数を追加：

```
DATABASE_URL = postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

**重要**: 
- Neonの接続URLをそのまま設定
- `?sslmode=require` を含める
- 「Production」「Preview」「Development」すべての環境に適用

#### 2-2. 本番環境でのマイグレーション実行

Vercelのビルド時に自動的にマイグレーションが実行されるように、`package.json` の `build` スクリプトを確認してください。

または、Vercelの「Deployments」タブから「Redeploy」を実行すると、新しい環境変数が適用されます。

#### 2-3. 本番環境での手動マイグレーション（必要に応じて）

Vercelの「Deployments」→「Functions」から、一時的にマイグレーション用のAPIエンドポイントを作成するか、
ローカルから本番環境のDATABASE_URLを使ってマイグレーションを実行：

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**注意**: 本番環境のDATABASE_URLは機密情報なので、ローカル環境に保存しないでください。

### 3. 動作確認

#### 3-1. ローカル環境

```bash
npm run dev
```

以下のURLで動作確認：
- http://localhost:3000/consultants - コンサルタント一覧
- http://localhost:3000/consultants/[id] - コンサルタント詳細

#### 3-2. 本番環境

Vercelにデプロイ後、以下を確認：
- コンサルタント一覧ページが正常に表示される
- コンサルタント詳細ページが正常に表示される
- OGP画像が正常に生成される
- データベース接続エラーが発生しない

### 4. トラブルシューティング

#### 4-1. 接続エラーが発生する場合

- DATABASE_URLが正しく設定されているか確認
- `?sslmode=require` が含まれているか確認
- Neonのデータベースが起動しているか確認

#### 4-2. マイグレーションエラーが発生する場合

```bash
# マイグレーション状態を確認
npx prisma migrate status

# マイグレーションをリセット（開発環境のみ）
npx prisma migrate reset
```

#### 4-3. Prisma Client のエラー

```bash
# Prisma Client を再生成
npx prisma generate
```

## 変更内容

### Prismaスキーマ

- `provider`: `sqlite` → `postgresql`
- `url`: `file:./dev.db` → `env("DATABASE_URL")`

### その他の変更

- SQLite固有の型は使用していないため、スキーマの型定義は変更なし
- Json型はPostgreSQLでもサポートされているため、そのまま使用可能

## 注意事項

1. **データのバックアップ**: 本番環境のデータを移行する場合は、事前にバックアップを取得してください。

2. **環境変数の管理**: 
   - `.env` ファイルは `.gitignore` に含まれているため、Gitにコミットされません
   - Vercelの環境変数はダッシュボードで管理してください

3. **接続プール**: NeonなどのサーバーレスPostgreSQLでは、接続プールの設定が必要な場合があります。必要に応じて `DATABASE_URL` に接続プールのパラメータを追加してください。

