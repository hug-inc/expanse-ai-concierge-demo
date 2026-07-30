import assert from "node:assert/strict";
import test from "node:test";
import { retrievalQueryFor, structuredSourcesFor } from "../app/structured-knowledge.ts";

test("太もも痩せではアユルハンドと料金表を優先する", () => {
  const sources = structuredSourcesFor("太もも痩せしたい。どのコースがいいですか？");
  assert.equal(sources[0]?.title, "アユルハンド（痩身）コース");
  assert.match(sources[0]?.passage ?? "", /120分.*30,800円/);
  assert.equal(sources[0]?.url, "https://expanse.jp/menu02");
});

test("渋谷から近い店舗では店舗一覧を返す", () => {
  const sources = structuredSourcesFor("渋谷から近い店舗は？");
  assert.equal(sources[0]?.title, "Expanse 店舗一覧・アクセス");
  assert.match(sources[0]?.passage ?? "", /恵比寿本店/);
});

test("睡眠の相談ではシローダーラーを返す", () => {
  const sources = structuredSourcesFor("眠りが浅くて頭が休まらない。おすすめは？");
  assert.ok(sources.some((source) => source.title === "シローダーラーコース"));
});

test("冷えとむくみではハマム浴を返す", () => {
  const sources = structuredSourcesFor("冷えとむくみに合うコースを教えて");
  assert.ok(sources.some((source) => source.title === "ハマム浴・温活コース"));
});

test("妊娠中の相談ではマタニティと注意事項を返す", () => {
  const sources = structuredSourcesFor("妊娠中でも受けられますか？");
  const maternity = sources.find((source) => source.title === "マタニティコース");
  assert.match(maternity?.passage ?? "", /医師の了承/);
});

test("働きたい質問では採用情報だけを返す", () => {
  const sources = structuredSourcesFor("Expanseで働いてみたい");
  assert.deepEqual(sources.map((source) => source.title), ["Expanse 採用情報・セラピスト給与"]);
  assert.equal(sources[0]?.url, "https://expanse.jp/recruit_02");
});

test("未経験セラピストの給与は現在の公式金額を返す", () => {
  const sources = structuredSourcesFor("セラピスト未経験だと給与いくら？");
  assert.equal(sources.length, 1);
  assert.match(sources[0]?.passage ?? "", /未経験の正社員が月給250,000円〜/);
  assert.equal(sources[0]?.url, "https://expanse.jp/recruit_02");
});

test("新しい話題には過去のコース質問を混ぜない", () => {
  const query = retrievalQueryFor("働いてみたい", [
    "太もも痩せにはどのコース？",
    "シローダーラーの料金は？",
  ]);
  assert.equal(query, "働いてみたい");
  assert.deepEqual(
    structuredSourcesFor(query).map((source) => source.title),
    ["Expanse 採用情報・セラピスト給与"],
  );
});

test("それの料金では直前の話題を検索に引き継ぐ", () => {
  const query = retrievalQueryFor("それの料金は？", ["アヴィヤンガについて教えて"]);
  assert.match(query, /アヴィヤンガ/);
  assert.ok(structuredSourcesFor(query).some((source) => source.title === "アヴィヤンガ全身コース"));
});
