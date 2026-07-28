export type KnowledgeDocument = {
  id: string;
  kind: "page" | "blog";
  title: string;
  url: string;
  summary: string;
  content: string;
  date: string;
};

type SearchResult = {
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
    .map((sentence) => {
      const normalized = normalize(sentence);
      const score = terms.reduce(
        (total, term) => total + occurrences(normalized, term) * (term.length + 2),
        0,
      );
      return { sentence, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected: string[] = [];
  for (const item of ranked) {
    if (selected.some((sentence) => sentence.includes(item.sentence) || item.sentence.includes(sentence))) continue;
    selected.push(item.sentence);
    if (selected.join("").length >= 360 || selected.length === 2) break;
  }

  return selected.join("");
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

  const passages = results
    .slice(0, 2)
    .map((result) => `・${result.passage}`)
    .join("\n\n");

  const healthQuestion =
    /痛|症状|不調|病|妊娠|持病|頭痛|腰痛|肩こり|冷え|むくみ|セルライト|肌|睡眠|便秘/.test(query);
  const note = healthQuestion
    ? "掲載内容は一般的な案内です。痛みや強い不調がある場合は、自己判断せず医療機関へご相談ください。"
    : "掲載内容や条件は変更される場合があります。最終確認はリンク先の公式ページをご覧ください。";

  return {
    text: `Expanse公式サイト内の${documents.length}件のページ・記事から、質問に近い内容を確認しました。\n\n${passages}\n\n${note}`,
    links: results.map((result) => ({
      label: result.document.title.replace(/\s*\|\s*アーユルヴェーダExpanse[\s\S]*$/, "").slice(0, 42),
      href: result.document.url,
    })),
  };
}
