# 共有・デプロイガイド

## 更新日
2025-12-13

## 目的
外部（コンサル）への共有方法を明確化し、Vercelデプロイの不安定性を回避する。

---

## 共有方法（確定方針）

### 基本方針
- **外部（コンサル）への共有はVercelを使わない**
- **ローカル + ngrok による一時URL共有を正式手段とする**

### 手順

1. **ローカル開発サーバーを起動**
   ```bash
   cd web
   npm run dev
   ```
   - ポートが3000埋まっていれば3001などに自動回避
   - 起動後、表示されるポート番号を確認（例: `http://localhost:3000`）

2. **ngrokでトンネルを作成**
   ```bash
   # 別ターミナルで実行
   ngrok http 3000
   # または、ポートが3001の場合は
   ngrok http 3001
   ```

3. **ngrokのURLを共有**
   - ngrokの Forwarding に表示される https URL を共有
   - 例: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`

### 運用ルール

- ✅ **共有するページ**:
  - `/` - トップページ
  - `/consultants` - コンサルタント一覧
  - `/consultants/[id]` - コンサルタント詳細

- ❌ **共有しないページ**:
  - `/dashboard` 配下は一切共有しない（運用でカバー）
  - 管理画面へのアクセスは提供しない

- ⚠️ **注意事項**:
  - ngrok URL は「一時確認用URL」として扱う
  - URLはngrokセッション終了時に無効になる
  - 必要に応じて新しいURLを生成して共有

---

## Vercelデプロイについて

### 現状
- Vercelデプロイはbuild/型/環境差異で不安定になりやすく、検証フェーズでは沼る
- ローカル（`npm run dev`）は安定して動作している
- DB / Prisma / 画面表示はローカルで確認済み

### 方針
- **現フェーズでは原則使用しない**
- **Vercelエラー対応は現フェーズでは原則行わない**
- 本番Vercelはエンジニアレビュー後に対応

### 将来対応（今はやらない）
- 本番Vercelはエンジニアレビュー後に対応
- middleware/auth/role分離は正式リリース前に実装

---

## ngrokのセットアップ

### インストール
```bash
# Homebrew (macOS)
brew install ngrok/ngrok/ngrok

# または公式サイトからダウンロード
# https://ngrok.com/download
```

### 認証（初回のみ）
```bash
ngrok config add-authtoken <your-authtoken>
# authtokenはngrokのダッシュボードから取得
```

### 使用方法
```bash
# 基本的な使用方法
ngrok http 3000

# カスタムドメインを使用する場合
ngrok http 3000 --domain=your-custom-domain.ngrok.io
```

---

## トラブルシューティング

### ポートが使用中の場合
```bash
# ポート3000が使用中の場合は、Next.jsが自動的に3001に切り替えます
# ngrokも対応するポートを指定してください
ngrok http 3001
```

### ngrokセッションが切れた場合
- ngrokセッションを再起動して新しいURLを生成
- 新しいURLを共有

### ローカル開発サーバーが起動しない場合
```bash
# ポートを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>

# 再度起動
cd web && npm run dev
```

---

## 参考ドキュメント

- `DEVELOPMENT_POLICY.md` - 開発方針（共有・デプロイ方針を含む）
- `HANDOVER_FOR_ENGINEERS.md` - エンジニア引き継ぎ用ドキュメント

