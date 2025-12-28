# Vercelデプロイガイド

## 概要

このガイドでは、CareerSelectアプリをVercelにデプロイして、恒久的にWeb上でアクセス可能にする手順を説明します。

---

## 前提条件

- GitHubアカウント
- Vercelアカウント（無料で作成可能: https://vercel.com）
- Neon PostgreSQLデータベース（既に設定済みの場合）

---

## デプロイ手順

### ステップ1: GitHubリポジトリの確認

1. 現在のコードがGitHubにプッシュされているか確認
   ```bash
   git remote -v
   ```
   
2. 最新のコードをプッシュ（未プッシュの場合）
   ```bash
   git add .
   git commit -m "Q&A主役化への構造・UI改修"
   git push origin main  # または master
   ```

### ステップ2: Vercelアカウントの準備

1. Vercelにアクセス: https://vercel.com
2. 「Sign Up」または「Log In」でアカウントにログイン
3. GitHubアカウントと連携（推奨）

### ステップ3: Vercelプロジェクトの作成

#### 方法A: 既存プロジェクトがある場合

1. Vercelダッシュボードにアクセス: https://vercel.com/dashboard
2. 既存のプロジェクト「career-select-app」を確認
3. プロジェクトを選択して「Settings」→「Git」でリポジトリ連携を確認

#### 方法B: 新規プロジェクトを作成する場合

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリを選択（`enganche1988/career-select-app`）
3. プロジェクト設定:
   - **Framework Preset**: Next.js（自動検出されるはず）
   - **Root Directory**: `web`（既に`vercel.json`で設定済み）
   - **Build Command**: `cd web && npm run build`（自動設定されるはず）
   - **Install Command**: `cd web && npm install`（自動設定されるはず）
   - **Output Directory**: `.next`（自動設定されるはず）

4. 「Deploy」をクリック

### ステップ4: 環境変数の設定

**重要**: デプロイ前に環境変数を設定する必要があります。

1. Vercelプロジェクトの「Settings」→「Environment Variables」に移動

2. 以下の環境変数を追加:

   #### 必須環境変数

   **`DATABASE_URL`**
   - **Value**: Neon PostgreSQLの接続文字列
   - **例**: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
   - **Environment**: Production, Preview, Development すべてにチェック

   **`BLOB_READ_WRITE_TOKEN`**（画像アップロード機能を使用する場合）
   - **Value**: Vercel Blob Storageのトークン
   - **取得方法**: Vercelダッシュボード → Storage → Blob → Create → Tokenをコピー
   - **Environment**: Production, Preview, Development すべてにチェック

3. 各環境変数を追加後、「Save」をクリック

### ステップ5: ビルド設定の確認

`vercel.json`が既に存在し、以下の設定が含まれています:

```json
{
  "buildCommand": "cd web && npm run build",
  "installCommand": "cd web && npm install",
  "framework": "nextjs",
  "rootDirectory": "web"
}
```

この設定により、Vercelは自動的に:
- `web`ディレクトリをルートとして認識
- `web`ディレクトリ内で`npm install`を実行
- `web`ディレクトリ内で`npm run build`を実行（Prisma生成も含む）

### ステップ6: データベースマイグレーションの実行

VercelのビルドプロセスでPrismaクライアントは生成されますが、**データベースマイグレーションは手動で実行する必要があります**。

#### 方法A: Vercelのビルドログで実行（推奨）

1. デプロイ後、Vercelダッシュボードで「Deployments」を確認
2. 最新のデプロイメントをクリック
3. 「Build Logs」を確認
4. エラーが発生している場合は、環境変数`DATABASE_URL`が正しく設定されているか確認

#### 方法B: ローカルからマイグレーションを実行

```bash
cd web
# DATABASE_URL環境変数を設定（本番環境のURL）
export DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
npm run db:migrate:deploy
```

### ステップ7: デプロイの確認

1. Vercelダッシュボードで「Deployments」を確認
2. 最新のデプロイメントのステータスが「Ready」になっているか確認
3. デプロイメントをクリックして、URLを確認（例: `https://career-select-app.vercel.app`）
4. ブラウザでURLにアクセスして、サイトが正常に表示されるか確認

---

## トラブルシューティング

### ビルドエラー: Prisma Client not found

**原因**: Prismaクライアントが生成されていない

**解決方法**:
1. `package.json`の`postinstall`スクリプトが正しく設定されているか確認
   ```json
   "postinstall": "prisma generate"
   ```
2. Vercelのビルドログで`prisma generate`が実行されているか確認

### ビルドエラー: DATABASE_URL is not defined

**原因**: 環境変数が設定されていない

**解決方法**:
1. Vercelダッシュボードで「Settings」→「Environment Variables」を確認
2. `DATABASE_URL`が正しく設定されているか確認
3. すべての環境（Production, Preview, Development）にチェックが入っているか確認

### ランタイムエラー: Database connection failed

**原因**: データベース接続文字列が間違っている、またはデータベースが存在しない

**解決方法**:
1. Neonダッシュボードでデータベースが作成されているか確認
2. 接続文字列が正しいか確認（`sslmode=require`が含まれているか）
3. データベースのマイグレーションが実行されているか確認

### 404エラー: Page not found

**原因**: Next.jsのルーティング設定の問題

**解決方法**:
1. `vercel.json`の`rootDirectory`が`web`に設定されているか確認
2. `web/app`ディレクトリ内にページファイルが存在するか確認

---

## 自動デプロイの設定

GitHubリポジトリと連携している場合、以下の操作で自動デプロイが有効になります:

1. **プッシュ時の自動デプロイ**: `main`ブランチにプッシュすると自動的にデプロイ
2. **プルリクエストのプレビュー**: プルリクエストを作成すると、プレビュー環境が自動的に作成される

### ブランチ設定

1. Vercelダッシュボードで「Settings」→「Git」に移動
2. 「Production Branch」を`main`（または`master`）に設定
3. 「Auto-deploy」が有効になっているか確認

---

## 環境変数の管理

### 本番環境のみに設定する場合

環境変数を追加する際、「Environment」で「Production」のみにチェックを入れます。

### プレビュー環境にも設定する場合

「Preview」にもチェックを入れると、プルリクエストのプレビュー環境でも使用できます。

### 開発環境にも設定する場合

「Development」にもチェックを入れると、`vercel dev`コマンドでローカル開発時にも使用できます。

---

## カスタムドメインの設定（オプション）

1. Vercelダッシュボードで「Settings」→「Domains」に移動
2. 「Add Domain」をクリック
3. ドメイン名を入力（例: `careerselect.com`）
4. DNS設定の指示に従って、DNSレコードを設定
5. ドメインの検証が完了するまで待つ（数分〜数時間）

---

## デプロイ後の確認事項

- [ ] トップページが正常に表示される
- [ ] コンサルタント一覧ページが正常に表示される
- [ ] コンサルタント詳細ページが正常に表示される
- [ ] Q&A一覧ページが正常に表示される
- [ ] データベース接続が正常に動作している
- [ ] 画像アップロード機能が動作している（使用する場合）

---

## 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Neon PostgreSQL](https://neon.tech)

---

## サポート

問題が発生した場合:
1. Vercelのビルドログを確認
2. ブラウザのコンソールでエラーを確認
3. 環境変数が正しく設定されているか確認
4. データベース接続が正常か確認

