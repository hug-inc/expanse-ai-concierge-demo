import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const site = "https://expanse.jp";
const corePages = [
  ["/", "トップ・キャンペーン"],
  ["/first02", "初めての方へ"],
  ["/menu02", "恵比寿・池袋メニュー"],
  ["/service", "施術内容・アーユルヴェーダ"],
  ["/option02", "オプションメニュー"],
  ["/ebisu02", "恵比寿本店"],
  ["/ikebukuro02", "池袋本店"],
  ["/ginza02", "銀座SPA"],
  ["/reserve/", "予約案内"],
  ["/recruit_02", "採用情報"],
  ["/bridal", "ブライダルエステ"],
];

function decode(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;|&#8220;|&#8221;/g, "\"")
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8211;|&#8212;/g, "—")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function documentFromPost(post) {
  const content = decode(post.content?.rendered).slice(0, 9000);
  return {
    id: `blog-${post.id}`,
    kind: "blog",
    title: decode(post.title?.rendered),
    url: post.link,
    summary: decode(post.excerpt?.rendered).slice(0, 500),
    content,
    date: post.date?.slice(0, 10) ?? "",
  };
}

function documentFromPage(page) {
  const content = decode(page.content?.rendered).slice(0, 16000);
  return {
    id: `page-wp-${page.id}`,
    kind: "page",
    title: decode(page.title?.rendered),
    url: page.link,
    summary: decode(page.excerpt?.rendered).slice(0, 500),
    content,
    date: page.modified?.slice(0, 10) ?? "",
  };
}

const posts = [];
for (let page = 1; page <= 7; page += 1) {
  const response = await fetch(`${site}/wp-json/wp/v2/posts?per_page=100&page=${page}`);
  if (!response.ok) throw new Error(`Blog page ${page} failed: ${response.status}`);
  posts.push(...(await response.json()).map(documentFromPost));
}

const pages = [];
for (const [path, fallbackTitle] of corePages) {
  const response = await fetch(`${site}${path}`);
  if (!response.ok) continue;
  const html = await response.text();
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? fallbackTitle);
  const main =
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ??
    html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ??
    html;
  pages.push({
    id: `page-${path}`,
    kind: "page",
    title: title || fallbackTitle,
    url: `${site}${path}`,
    summary: fallbackTitle,
    content: decode(main).slice(0, 16000),
    date: "",
  });
}

// WordPressで公開されている固定ページも取り込み、手動のURL一覧に
// 含まれていないFAQ・スクール・ブライダル等を検索対象にする。
const wpPagesResponse = await fetch(`${site}/wp-json/wp/v2/pages?per_page=100&page=1`);
if (wpPagesResponse.ok) {
  const knownUrls = new Set(pages.map((page) => page.url.replace(/\/$/, "")));
  for (const page of await wpPagesResponse.json()) {
    const document = documentFromPage(page);
    if (!knownUrls.has(document.url.replace(/\/$/, ""))) pages.push(document);
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  source: site,
  count: posts.length + pages.length,
  documents: [...pages, ...posts],
};

await writeFile(
  resolve("public/knowledge.json"),
  JSON.stringify(output),
  "utf8",
);

console.log(`Created knowledge.json with ${output.count} documents.`);
