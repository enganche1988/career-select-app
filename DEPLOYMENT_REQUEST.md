# デプロイ要望：Web上で恒久的にアクセス可能にする

## 更新日
2025-12-28

## 要望内容

現在、ローカルPC上で開発サーバーを起動し、ngrokを使って一時的にweb上からアクセスできる状態になっています。
**PCを起動している間のみアクセス可能**という制約があるため、**恒久的にweb上でアクセスできるようにしたい**という要望です。

---

## 現状の状況

### 1. ローカル開発環境

**起動方法**:
```bash
cd web
npm run dev
```

**アクセス方法**:
- ローカル: http://localhost:3000
- ngrok経由: https://transuranic-photovoltaic-liana.ngrok-free.dev

**現在の状態**:
- ✅ Next.js開発サーバーがポート3000で動作中
- ✅ ngrokトンネルで一時的に外部アクセス可能
- ⚠️ PCを閉じるとサービスが停止
- ⚠️ ngrokの無料版には制限あり（URLが変わる可能性、警告ページ表示など）

### 2. 本番環境（Vercel）

**既存のデプロイ設定**:
- プロジェクトURL: https://career-select-app.vercel.app（GitHubのhomepageフィールドに記載）
- Vercel設定ファイル: `vercel.json`がルートディレクトリに存在
- ルートディレクトリ: `web`に設定済み

**Vercel設定内容** (`vercel.json`):
```json
{
  "buildCommand": "cd web && npm run build",
  "installCommand": "cd web && npm install",
  "framework": "nextjs",
  "rootDirectory": "web"
}
```

### 3. データベース

**使用DB**: PostgreSQL (Neon)
- 本番環境: Neon PostgreSQL
- ローカル開発: SQLite（移行中）

**必要な環境変数**:
- `DATABASE_URL`: PostgreSQL接続文字列（Neon）
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storage用（画像アップロード機能用）

---

## 技術スタック

- **フレームワーク**: Next.js 16.0.7 (App Router)
- **言語**: TypeScript, React 19.2.0
- **スタイリング**: Tailwind CSS
- **ORM**: Prisma 6.19.0
- **データベース**: PostgreSQL (Neon)
- **デプロイ先**: Vercel（推奨）

---

## 必要な対応

### オプション1: Vercelにデプロイ（推奨）

**メリット**:
- ✅ 無料プランで利用可能
- ✅ GitHub連携で自動デプロイ
- ✅ HTTPS証明書自動設定
- ✅ グローバルCDN
- ✅ スケーラブル

**必要な作業**:
1. Vercelダッシュボードで環境変数を設定
   - `DATABASE_URL`: Neon PostgreSQL接続情報
   - `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storageトークン（既に設定済みの可能性あり）
2. GitHubリポジトリとVercelプロジェクトを連携
3. 自動デプロイの確認

**確認すべき点**:
- 既にVercelプロジェクトが存在するか（https://career-select-app.vercel.app）
- 環境変数が正しく設定されているか
- 最新のコミットがデプロイされているか

### オプション2: その他のクラウドサービス

- **Railway**: PostgreSQL + Node.jsの簡単デプロイ
- **Render**: 無料プランあり、PostgreSQL対応
- **Fly.io**: コンテナベース、無料プランあり

---

## 現在の問題点

1. **ngrokは一時的な解決策**
   - PCを閉じるとサービス停止
   - 無料版には制限あり（URL変更、警告ページなど）

2. **Vercelの状態が不明確**
   - 過去にデプロイされていたが、現在の状態が不明
   - 環境変数の設定状況が不明

---

## エンジニアに確認してほしいこと

1. **Vercelプロジェクトの現在の状態**
   - デプロイは正常に動作しているか
   - 環境変数（DATABASE_URL, BLOB_READ_WRITE_TOKEN）は設定済みか
   - 最新のコードが反映されているか

2. **デプロイ方法の選択**
   - Vercelに再デプロイするか
   - 別のサービスを利用するか

3. **データベース接続**
   - Neon PostgreSQLの接続情報が正しく設定されているか
   - マイグレーションは正常に実行されるか

4. **ドメイン設定**
   - カスタムドメインの設定が必要か
   - デフォルトのVercelドメインで問題ないか

---

## 参考情報

- **GitHubリポジトリ**: https://github.com/enganche1988/career-select-app
- **プロジェクトドキュメント**: `HANDOVER_FOR_ENGINEERS.md`
- **技術仕様**: `PROJECT.md`
- **開発ポリシー**: `DEVELOPMENT_POLICY.md`

---

## 補足

現在、ローカルで開発を進めており、機能は正常に動作しています。
ngrokを使った一時的なアクセスは可能ですが、恒久的な解決策としてクラウドへのデプロイが必要です。

Vercelは既に設定ファイルが存在し、過去にデプロイされていた実績があるため、最もスムーズに移行できると考えられます。

