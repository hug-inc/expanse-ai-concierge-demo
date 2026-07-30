import assert from "node:assert/strict";
import test from "node:test";
import {
  intentFor,
  retrievalQueryFor,
  structuredSourcesFor,
} from "../app/structured-knowledge.ts";

const cases = [
  ["働いてみたい", "recruitment"],
  ["セラピスト未経験だと給与いくら？", "recruitment"],
  ["応募方法を教えて", "recruitment"],
  ["渋谷から近い店舗は？", "store"],
  ["恵比寿店の住所は？", "store"],
  ["営業時間と電話番号は？", "store"],
  ["予約したい", "reservation"],
  ["予約をキャンセルしたい", "reservation"],
  ["メニューを教えて", "menu"],
  ["アヴィヤンガの料金は？", "menu"],
  ["オプションはいくら？", "menu"],
  ["太もも痩せしたい", "concern"],
  ["眠りが浅く頭が休まらない", "concern"],
  ["肩と腰がつらい", "concern"],
  ["顔のケアをしたい", "concern"],
  ["初めてでも大丈夫？", "first_visit"],
  ["妊娠中でも受けられる？", "first_visit"],
  ["アーユルヴェーダとは？", "ayurveda"],
  ["カパについて教えて", "ayurveda"],
  ["ブライダルエステについて", "bridal"],
] as const;

for (const [query, expected] of cases) {
  test(`意図判定: ${query}`, () => {
    assert.equal(intentFor(query), expected);
  });
}

test("採用質問には採用資料だけを返す", () => {
  const sources = structuredSourcesFor("前にコースを見たけど、Expanseで働いてみたい");
  assert.equal(sources.length, 1);
  assert.equal(sources[0]?.intent, "recruitment");
  assert.match(sources[0]?.passage ?? "", /未経験正社員が月給250,000円〜/);
});

test("太ももの相談ではアユルハンドを第一候補にする", () => {
  const sources = structuredSourcesFor("太もも痩せしたい。どのコースがいいですか？");
  assert.equal(sources[0]?.title, "アユルハンド（痩身）コース");
  assert.match(sources[0]?.passage ?? "", /120分通常30,800円/);
});

test("睡眠の相談ではシローダーラーを返す", () => {
  const sources = structuredSourcesFor("眠りが浅くて頭が休まらない");
  assert.ok(sources.some((item) => item.title === "シローダーラーコース"));
});

test("妊娠中の相談では料金と医師確認の資料を返す", () => {
  const text = structuredSourcesFor("妊娠中でも受けられますか？")
    .map((item) => item.passage)
    .join(" ");
  assert.match(text, /20,900円/);
  assert.match(text, /医師の了承/);
});

test("カパ質問には体質資料だけを返す", () => {
  const sources = structuredSourcesFor("カパについて詳しく教えて");
  assert.equal(sources.length, 1);
  assert.equal(sources[0]?.intent, "ayurveda");
  assert.match(sources[0]?.passage ?? "", /地と水/);
});

test("予約質問には予約と店舗連絡先を返す", () => {
  const sources = structuredSourcesFor("予約を変更したい");
  assert.equal(sources[0]?.intent, "reservation");
  assert.match(sources.map((item) => item.passage).join(" "), /03-3442-6656/);
});

test("指示語の質問だけ直前の話題を引き継ぐ", () => {
  assert.equal(
    retrievalQueryFor("働いてみたい", ["アヴィヤンガの料金は？"]),
    "働いてみたい",
  );
  assert.match(
    retrievalQueryFor("それの料金は？", ["アヴィヤンガについて教えて"]),
    /アヴィヤンガ/,
  );
});
