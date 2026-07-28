# Expanse AIコンシェルジュ

アーユルヴェーダサロン「Expanse」の公式サイト情報をもとに、メニュー、料金、店舗、採用、ブログ、よくある質問などへ回答するAIチャットボットのデモです。

[![Expanse AIコンシェルジュのプレビュー](https://raw.githubusercontent.com/hug-inc/expanse-ai-concierge-demo/main/public/og.png)](https://expanse-ai-concierge-demo.ebisawa818511.chatgpt.site/)

## [公開デモを見る](https://expanse-ai-concierge-demo.ebisawa818511.chatgpt.site/)

ブラウザでチャットを開き、たとえば次のように質問できます。

- メニューを教えて
- アヴィヤンガの料金は？
- カパについて詳しく教えて
- 採用している職種と条件は？
- それの120分はいくら？

## 主な機能

- Expanse公式サイトのページ・ブログを検索
- OpenAI APIによる質問意図と会話履歴の理解
- メニューや料金などの情報を整理して回答
- 回答の参考にした公式ページへのリンク表示
- API障害時の固定回答フォールバック

## ローカル起動

必要なもの：

- Node.js `>=22.13.0`
- OpenAI APIキー

```bash
pnpm install
OPENAI_API_KEY=your_api_key pnpm run dev
```

APIキーをソースコードやGitHubへコミットしないでください。

## ビルド

```bash
pnpm run build
```

## 主な構成

- `app/page.tsx`：チャット画面とクライアント処理
- `app/api/chat/route.ts`：OpenAI APIを呼び出すサーバー処理
- `app/site-search.ts`：公式サイト情報の検索
- `public/knowledge.json`：公式サイトから生成した検索用データ
- `scripts/build-knowledge.mjs`：検索用データの更新

## 公開環境

公開サイトのAPIキーは、ホスティング環境の秘密変数 `OPENAI_API_KEY` として設定します。APIキーはこのリポジトリには含まれていません。
