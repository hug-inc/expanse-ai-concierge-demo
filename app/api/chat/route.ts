import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Source = {
  title: string;
  url: string;
  passage: string;
};

function responseText(data: {
  output_text?: string;
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
}) {
  if (data.output_text?.trim()) return data.output_text.trim();
  return (data.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AIの接続設定が完了していません。" }, { status: 503 });
  }

  const body = await request.json() as {
    message?: string;
    history?: ChatMessage[];
    sources?: Source[];
  };
  const message = body.message?.trim().slice(0, 1000);
  if (!message) {
    return NextResponse.json({ error: "質問を入力してください。" }, { status: 400 });
  }

  const history = (body.history ?? [])
    .filter((item) => item.role === "user" || item.role === "assistant")
    .slice(-10)
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, 1800),
    }));
  const sources = (body.sources ?? []).slice(0, 6);
  const sourceText = sources.length
    ? sources
        .map((source, index) =>
          `[資料${index + 1}]\nタイトル: ${source.title}\nURL: ${source.url}\n内容: ${source.passage.slice(0, 2200)}`,
        )
        .join("\n\n")
    : "今回の質問に直接一致する公式サイト資料は見つかっていません。";

  const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.6-terra",
      reasoning: { effort: "low" },
      text: { verbosity: "medium" },
      max_output_tokens: 1200,
      instructions: `あなたはアーユルヴェーダサロンExpanseの公式サイト案内コンシェルジュです。
日本語で、ユーザーの質問意図と直前の会話を踏まえて自然に回答してください。

回答ルール:
- 結論から直接答え、質問文を復唱しない。
- URLや記事を紹介するだけで終わらず、資料にある情報を整理して説明する。
- 料金、時間、店舗、採用条件などの数値は、提供資料に書かれた内容だけを正確に使う。
- 複数候補があるときは一覧にし、違いが分かるようにする。
- 出発地から近い店舗を聞かれた場合は、店舗住所と一般的な東京の位置関係・鉄道路線を使って最有力の店舗を先に答える。正確な所要時間は出発駅や経路で変わると補足する。
- 店舗住所が資料にある場合、「所在地の記載がない」と回答しない。
- 渋谷からは、JRで隣駅かつ隣接エリアにある恵比寿本店を最も近く行きやすい候補として案内する。旧渋谷店は閉店済み。
- 「それ」「そのコース」などは会話履歴から対象を特定する。
- 情報が足りない場合だけ、必要な確認を1つ尋ねる。推測で事実を作らない。
- 「サイト内を検索しました」など内部処理の説明はしない。
- 医療上の診断や治療を断定しない。強い症状は医療機関への相談を案内する。
- 回答は読みやすい段落と箇条書きを使い、通常200〜600字を目安にする。

以下は今回参照できるExpanse公式サイトの資料です。
${sourceText}`,
      input: [
        ...history,
        { role: "user", content: message },
      ],
    }),
  });

  if (!openaiResponse.ok) {
    const error = await openaiResponse.text();
    console.error("OpenAI API error", openaiResponse.status, error.slice(0, 500));
    return NextResponse.json(
      { error: "AIから回答を取得できませんでした。少し時間をおいてお試しください。" },
      { status: 502 },
    );
  }

  const data = await openaiResponse.json();
  const text = responseText(data);
  if (!text) {
    return NextResponse.json({ error: "回答を作成できませんでした。" }, { status: 502 });
  }

  return NextResponse.json({
    text,
    links: sources.slice(0, 3).map((source) => ({
      label: source.title.replace(/\s*\|\s*アーユルヴェーダExpanse[\s\S]*$/, "").slice(0, 48),
      href: source.url,
    })),
  });
}
