export type KnowledgeDocument = {
  id: string;
  kind: "page" | "blog";
  title: string;
  url: string;
  summary: string;
  content: string;
  date: string;
};

export type SearchResult = {
  document: KnowledgeDocument;
  score: number;
  passage: string;
};

const domainTerms = [
  "セルライト", "アーユルヴェーダ", "アヴィヤンガ", "シロダーラー",
  "シロヴィヤンガ", "アユルハンド", "ハマム", "ドーシャ", "ヴァータ",
  "ピッタ", "カパ", "冷え", "むくみ", "肩こり", "腰痛", "頭痛",
  "眼精疲労", "不眠", "睡眠", "ストレス", "便秘", "妊娠", "マタニティ",
  "ブライダル", "フェイシャル", "ホットストーン", "ダイエット", "痩身",
  "食事", "ハーブ", "オイル", "よもぎ", "男性", "ペア", "料金", "予約",
  "営業時間", "恵比寿", "池袋", "銀座", "採用", "スクール", "資格",
  "6つの味", "六つの味", "甘味", "酸味", "塩味", "辛味", "苦味", "渋味",
  "注意点", "禁忌", "施術後", "効果", "原因", "特徴", "改善", "セルフケア",
];

const noise = /について|とは|教えて|知りたい|詳しく|ありますか|できますか|ですか|ますか|どんな|どういう|なぜ|どうして|方法|こと|もの|の|を|が|は|に|で|と|も|へ|？|\?|。/g;
const commonTerms = new Set(["アーユルヴェーダ", "オイル", "施術", "効果", "改善", "特徴"]);

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/シロダラー/g, "シロダーラー")
    .replace(/アーユルベーダ/g, "アーユルヴェーダ")
    .replace(/\s+/g, "");
}

function queryTerms(query: string) {
  const normalized = normalize(query);
  const found = domainTerms.filter((term) => normalized.includes(normalize(term)));
  const core = normalized.replace(noise, "");
  if (core.length >= 2) found.push(core);

  if (found.length === 0 && normalized.length >= 2) {
    for (let size = Math.min(5, normalized.length); size >= 2; size -= 1) {
      for (let index = 0; index <= normalized.length - size; index += 1) {
        found.push(normalized.slice(index, index + size));
      }
      if (found.length > 10) break;
    }
  }
  return [...new Set(found.map(normalize))].filter((term) => term.length >= 2);
}

function occurrences(text: string, term: string) {
  if (!term) return 0;
  let count = 0;
  let position = text.indexOf(term);
  while (position !== -1 && count < 12) {
    count += 1;
    position = text.indexOf(term, position + term.length);
  }
  return count;
}

function relevantPassage(document: KnowledgeDocument, terms: string[]) {
  const sentences = document.content
    .split(/(?<=[。！？!?])|\s{2,}/)
    .map((sentence) =>
      sentence
        .replace(/\b(?:style|class|id|href|src)="[^"]*"/gi, "")
        .replace(/\.{3,}|…{2,}/g, "…")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((sentence) => sentence.length >= 25 && sentence.length <= 260);

  const ranked = sentences
    .map((sentence, index) => {
      const normalized = normalize(sentence);
      const score = terms.reduce(
        (total, term) => total + occurrences(normalized, term) * (term.length + 2),
        0,
      );
      return { sentence, score, index };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const selectedIndexes = new Set<number>();
  for (const item of ranked.slice(0, 3)) {
    for (let offset = -1; offset <= 2; offset += 1) {
      const index = item.index + offset;
      if (index >= 0 && index < sentences.length) selectedIndexes.add(index);
    }
    const currentLength = [...selectedIndexes]
      .sort((a, b) => a - b)
      .map((index) => sentences[index])
      .join("").length;
    if (currentLength >= 700) break;
  }

  return [...selectedIndexes]
    .sort((a, b) => a - b)
    .map((index) => sentences[index])
    .join("")
    .slice(0, 900);
}

function doshaAnswer(query: string) {
  const normalized = normalize(query);

  if (normalized.includes("カパ")) {
    if (/食事|食べ物|食材|味/.test(query)) {
      return {
        text: `カパを食事で整えたい場合は、「温かい・軽い・適度に刺激がある」を軸に考えます。

【取り入れやすいもの】
温かいスープや蒸し野菜、豆類、葉野菜など、油分が多すぎない出来たての料理が向いています。味では、辛味・苦味・渋味を適度に取り入れる考え方があり、生姜や黒こしょうなどのスパイスも食事のアクセントになります。

【控えめにしたいもの】
甘いもの、揚げ物など油分の多い料理、乳製品のとり過ぎ、冷たい飲み物、量の多い食事は、カパの「重さ」や「冷たさ」を強めやすいとされます。完全に禁止するのではなく、重だるさや眠気がある時に量と頻度を調整するのが現実的です。

【食べ方のポイント】
空腹を感じてから適量を食べ、夜遅い時間の重い食事を避けます。温かい飲み物を選び、食後に短く歩くのも取り入れやすい方法です。体質だけでなく、持病・アレルギー・現在の体調を優先してください。`,
        actions: ["カパ体質の特徴", "カパが乱れた時", "カパの生活習慣", "カパ向けの施術"],
      };
    }

    if (/乱れ|増え|不調|サイン|重だる|むくみ|眠気/.test(query)) {
      return {
        text: `カパが過剰になった時は、本来の「安定」が「停滞」として現れると考えます。

身体では、朝起きにくい、眠気が強い、身体が重い、むくみやすい、体重が増えやすい、消化が遅く食後に重さを感じる、といった傾向が目安です。鼻や喉に粘液がたまりやすいと感じることもあります。

心では、やる気が出にくい、変化を避けたい、物や考えを手放しにくい、気分が沈んで同じ状態にとどまりやすい、といった形で現れることがあります。

ただし、これらはアーユルヴェーダ上の一般的な見方です。急なむくみ、息苦しさ、強い倦怠感、長引く不調などはカパだけで判断せず、医療機関へご相談ください。`,
        actions: ["カパの食事", "カパの生活習慣", "カパ向けの施術"],
      };
    }

    if (/生活|過ご|セルフケア|整え|運動/.test(query)) {
      return {
        text: `カパを生活面で整えるポイントは、「温める・動かす・変化をつける」です。

朝は寝過ぎを避け、できれば早めに起きて日光を浴びます。ウォーキングや軽い筋力運動など、少し汗ばむ程度の運動を無理なく継続すると、重だるさを切り替えやすくなります。

同じ場所・同じ行動が続くと停滞しやすいため、新しい道を歩く、予定を一つ変える、人と会うなど、小さな刺激を生活に加えるのもおすすめです。昼寝や長時間座り続けることは控え、こまめに身体を動かします。

入浴や温かい飲み物で冷えを避ける一方、オイルを大量に使う重いケアが合わない時もあります。その日の乾燥・疲労・むくみなどを見ながら調整することが大切です。`,
        actions: ["カパの食事", "カパが乱れた時", "カパ向けの施術"],
      };
    }

    if (/施術|コース|サロン|マッサージ/.test(query)) {
      return {
        text: `カパ特有の重だるさや停滞感が気になる方には、身体を温めて巡りを促す方向のケアが選択肢になります。

Expanseでは、体質と当日の状態をカウンセリングしたうえでハーブオイルを選ぶ全身アヴィヤンガがあります。冷えや重さが気になる場合は、ハーブスチームで身体を温めるハマム浴との組み合わせも相談できます。むくみやボディラインが主な悩みなら、強圧のオールハンドでケアするアユルハンドもあります。

「カパ体質だからこの施術」と一律に決めるのではなく、疲労、乾燥、睡眠、むくみ、刺激の好みを伝えて、その日の状態に合う内容を相談するのがおすすめです。`,
        actions: ["コース相談", "店舗を選ぶ", "料金・時間について"],
      };
    }

    return {
      text: `カパは、アーユルヴェーダにおける3つの生命エネルギー（ドーシャ）のひとつで、「水」と「地」の性質を持つと考えられています。安定・結合・潤いを支える、どっしりと落ち着いたエネルギーです。

【バランスが整っているとき】
穏やかで包容力があり、忍耐強く、物事を継続する力があります。体力や持久力が比較的安定し、肌や髪に潤いが出やすいのもカパの特徴です。

【カパが増えすぎたときの傾向】
身体の重だるさ、眠気、むくみ、動き出しにくさ、体重が増えやすい、消化がゆっくりになるといった傾向が現れやすいとされます。心の面では、変化を避けたくなったり、やる気が出にくくなったりすることがあります。

【整えるための過ごし方】
カパの「重い・冷たい・ゆっくり」という性質と反対の、軽さ・温かさ・刺激を意識します。朝寝坊や昼寝を控え、散歩や軽い運動で身体を動かすこと、生活に新しい刺激を取り入れることが向いています。

【食事のポイント】
温かく、軽く、できたての食事を中心にし、辛味・苦味・渋味を適度に取り入れる考え方があります。反対に、甘いもの、油分の多いもの、冷たいもの、食べ過ぎはカパを増やしやすいとされるため、重だるさがある時は控えめにします。

なお、実際の体質はカパだけで決まるとは限らず、ヴァータやピッタとの複合型、季節や現在の体調による一時的な乱れもあります。簡易診断は目安として、今の心身の状態も合わせて見ることが大切です。

いま知りたいのは、体質そのもの、最近の不調、食事、生活習慣、サロンでのケアのどれに近いですか？`,
      actions: ["カパ体質の特徴", "カパが乱れた時", "カパの食事", "カパの生活習慣", "カパ向けの施術"],
    };
  }

  return null;
}

export function searchSite(query: string, documents: KnowledgeDocument[], limit = 3): SearchResult[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];

  return documents
    .map((document) => {
      const title = normalize(document.title);
      const summary = normalize(document.summary);
      const content = normalize(document.content);
      let score = 0;
      for (const term of terms) {
        const specificity = terms.length > 1 && commonTerms.has(term) ? 0.25 : 1;
        score += occurrences(title, term) * (24 + term.length * 3) * specificity;
        score += occurrences(summary, term) * (9 + term.length) * specificity;
        score += occurrences(content, term) * Math.min(5 + term.length, 12) * specificity;
      }
      if (document.kind === "page") score *= 1.08;
      return { document, score, passage: relevantPassage(document, terms) };
    })
    .filter((result) => result.score > 10 && result.passage)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function siteAnswer(query: string, documents: KnowledgeDocument[]) {
  const results = searchSite(query, documents);
  if (results.length === 0) return null;

  const dosha = doshaAnswer(query);
  const passages = results
    .slice(0, dosha ? 1 : 3)
    .map((result) => `【${result.document.title.replace(/\s*\|\s*アーユルヴェーダExpanse[\s\S]*$/, "")}】\n${result.passage}`)
    .join("\n\n");

  const healthQuestion =
    /痛|症状|不調|病|妊娠|持病|頭痛|腰痛|肩こり|冷え|むくみ|セルライト|肌|睡眠|便秘/.test(query);
  const note = healthQuestion
    ? "掲載内容は一般的な案内です。痛みや強い不調がある場合は、自己判断せず医療機関へご相談ください。"
    : "掲載内容や条件は変更される場合があります。最終確認はリンク先の公式ページをご覧ください。";

  return {
    text: dosha
      ? `${dosha.text}\n\n${note}`
      : `${passages}\n\n${note}`,
    actions: dosha?.actions,
    links: results.map((result) => ({
      label: result.document.title.replace(/\s*\|\s*アーユルヴェーダExpanse[\s\S]*$/, "").slice(0, 42),
      href: result.document.url,
    })),
  };
}
