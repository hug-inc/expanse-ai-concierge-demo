import { NextRequest, NextResponse } from "next/server";
import { intentFor, retrievalQueryFor, structuredSourcesFor } from "../../structured-knowledge";

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
  const retrievalQuery = retrievalQueryFor(
    message,
    history.filter((item) => item.role === "user").map((item) => item.content),
  );
  const structuredSources = structuredSourcesFor(retrievalQuery);
  const intent = intentFor(retrievalQuery);
  const intentPatterns = {
    recruitment: /採用|求人|募集|recruit/i,
    store: /店舗|恵比寿|池袋|銀座|アクセス|shop|ebisu|ikebukuro|ginza/i,
    reservation: /予約|店舗|reserve|恵比寿|池袋|銀座/i,
    menu: /メニュー|料金|コース|施術|menu|service|option/i,
    concern: /メニュー|コース|施術|アヴィヤンガ|アユルハンド|シロ|ハマム|menu|service/i,
    first_visit: /初めて|妊娠|マタニティ|男性|ペア|first|menu/i,
    ayurveda: /アーユルヴェーダ|ドーシャ|ヴァータ|ピッタ|カパ|体質/i,
    bridal: /ブライダル|bridal|結婚|挙式/i,
    general: /.*/,
  };
  const submittedSources = (body.sources ?? []).filter((source) =>
    intentPatterns[intent].test(`${source.title} ${source.url} ${source.passage.slice(0, 300)}`),
  );
  const sources = [
    ...structuredSources,
    ...submittedSources,
  ]
    .filter((source, index, items) =>
      items.findIndex((item) => item.title === source.title && item.url === source.url) === index,
    )
    .slice(0, 8);
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
- 太もも痩せ、下半身痩せ、脚やお尻の引き締め、セルライトの相談では、資料にアユルハンドがある場合は第一候補として、理由・施術内容・料金を説明し、コース案内へのリンクを付ける。「コース名の記載がない」と回答しない。
- 質問に合う公式の店舗ページ・コースページが資料に含まれる場合は、そのリンクを必ず回答に付ける。
- 回答は原則「結論・おすすめ→理由→内容→時間・料金→対応店舗→公式リンク」の順に組み立てる。該当しない項目は省略してよい。
- 構造化されたコース・店舗資料を、一般ブログ記事より優先する。
- 質問の分野と異なる資料は使わない。採用質問に施術、店舗質問にブログ、体質質問に採用などを混ぜない。
- 働きたい、求人、採用、応募などの質問では採用情報だけを使い、施術コースやメニューのリンクを付けない。まず募集職種を示し、希望職種を確認する。
- セラピストの給与を聞かれた場合は、資料にある未経験・経験者・雇用形態別の具体額を直接答える。「具体的な記載がない」と回答しない。
- 質問が具体的なら、追加確認を先に求めず、分かる範囲の具体的な答えを完成させてから必要な補足だけを添える。
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
