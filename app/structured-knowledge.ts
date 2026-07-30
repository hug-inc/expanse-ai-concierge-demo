export type KnowledgeIntent =
  | "recruitment"
  | "store"
  | "reservation"
  | "menu"
  | "concern"
  | "first_visit"
  | "ayurveda"
  | "bridal"
  | "general";

export type StructuredSource = {
  title: string;
  url: string;
  passage: string;
  intent: KnowledgeIntent;
};

const source = (
  intent: KnowledgeIntent,
  title: string,
  url: string,
  passage: string,
): StructuredSource => ({ intent, title, url, passage });

const stores = source(
  "store",
  "Expanse 店舗一覧・アクセス",
  "https://expanse.jp/#shoplist",
  "現在の店舗は恵比寿本店・池袋本店・銀座SPAの3店舗。恵比寿本店は東京都渋谷区恵比寿4-3-1 クイズ恵比寿3F-O、電話03-3442-6656、店舗ページhttps://expanse.jp/ebisu02。池袋本店は東京都豊島区南池袋1-17-2 南池袋I-Nビル8F、電話0800-800-1787、店舗ページhttps://expanse.jp/ikebukuro02。銀座SPAは東京都中央区銀座7-9-11 モンブラン銀座ビル8階、電話03-6263-9501、店舗ページhttps://expanse.jp/ginza02。全店、平日11:00〜20:00、土日祝10:00〜20:00、最終受付18:00。旧渋谷店は閉店済み。渋谷からはJRで隣駅かつ隣接エリアの恵比寿本店が通常もっとも近く行きやすい。",
);

const recruitment = source(
  "recruitment",
  "Expanse 採用情報・募集条件",
  "https://expanse.jp/recruit_02",
  "募集職種はセラピスト、レセプション・カウンセラー、WEBデザイナー、グラフィックデザイナー、WEBマーケター、動画クリエイター、EC shop運営担当、EC Shop運営責任者。セラピストは未経験でも応募可能。給与は未経験正社員が月給250,000円〜、経験者正社員が月給260,000円〜、毎月の評価制度は月0〜150,000円。パート・アルバイト・業務委託は時給・時間報酬1,300〜3,500円。勤務は平日10:00〜20:00、土日祝は早番9:00〜19:30・遅番9:30〜20:00、休憩1時間。パート等は週3日以上・1日5時間以上。年間休日134日、入社6か月後に有給10日。交通費全額支給、社会保険完備、店販手当、最大80％OFFの社員割引、表彰制度あり。応募フォームhttps://expanse.jp/recruit_02#entry、採用担当03-6263-9501（10:00〜17:00）。",
);

const reservations = source(
  "reservation",
  "Expanse 予約・問い合わせ",
  "https://expanse.jp/reserve/",
  "公式予約ページから店舗・コース・日時を選んで予約できる。空き状況、当日予約、変更・キャンセルなど予約固有の確認は、予約ページまたは利用店舗へ問い合わせる。恵比寿本店03-3442-6656、池袋本店0800-800-1787、銀座SPA03-6263-9501。",
);

const firstVisit = source(
  "first_visit",
  "初めての方へ・施術前の注意",
  "https://expanse.jp/first02",
  "初回は体調や体質を確認するカウンセリングを行い、施術内容を相談してから開始する。恵比寿・池袋のメニューでは初回カウンセリング約15分は施術時間に含まれない。妊娠中、持病がある、通院中の場合は医師の了承を得て予約・来店する。強い痛みや急な症状はサロン施術で判断せず医療機関へ相談する。",
);

const menuCatalog = source(
  "menu",
  "恵比寿本店・池袋本店 メニュー・料金一覧",
  "https://expanse.jp/menu02",
  "主な税込料金。アヴィヤンガ全身90分22,000円／初回17,600円、120分26,400円／初回20,900円。アユルハンド全身90分26,400円／初回20,900円、120分30,800円／初回24,200円。マタニティ60分20,900円／初回16,500円。ExpaRフェイシャル60分12,650円／初回9,900円。シローダーラー60分17,600円／初回15,400円。ハマム浴120分25,300円／初回18,700円。池袋限定の漢方アロマ90分23,650円／初回19,250円、120分28,050円／初回22,550円。全身＋シローダーラー120分26,900円／初回23,700円、全身＋フェイス＋シローダーラー150分36,300円／初回31,900円。銀座SPAは別メニュー・別料金。",
);

const options = source(
  "menu",
  "オプションメニュー・料金",
  "https://expanse.jp/menu02",
  "オプション単独では予約不可。シローダーラー20分8,250円、ムカヴィヤンガ30分6,050円、ハマム浴30分3,850円、漢方蒸し20分4,950円、国産よもぎ足浴10分1,430円、ディープデトックス3,300円、薬草オイルパック3,300円、シロヴィヤンガ10分3,080円、ヘッド10分2,750円、延長15分3,850円、肩首集中10分2,750円、首デコルテ10分2,750円、ハーブボール10分3,300円、腸マッサージ10分3,850円、二の腕集中10分2,750円。店舗限定メニューもある。",
);

const abhyanga = source(
  "concern",
  "アヴィヤンガ全身コース",
  "https://expanse.jp/menu02",
  "全身疲労、肩・背中・腰のこり、冷え、緊張、体質ケア、リラックスには温かいハーブオイルを使うアヴィヤンガが候補。90分は肩・背中・腰・デコルテ・腕・首・ヒップ・太もも・膝・ふくらはぎ・足裏を施術し、通常22,000円／初回17,600円。120分は頭も含み通常26,400円／初回20,900円。恵比寿・池袋で提供。",
);

const ayurhand = source(
  "concern",
  "アユルハンド（痩身）コース",
  "https://expanse.jp/menu02",
  "太もも・お尻・下半身・二の腕・ウエストの引き締め、セルライト、むくみ、ボディラインにはExpanse独自の強圧オールハンド施術アユルハンドが第一候補。施術部位は二の腕、脇リンパ、背中、腰回り、ウエスト、ヒップ、太もも、足首で、希望により時間配分を相談できる。90分通常26,400円／初回20,900円、120分通常30,800円／初回24,200円。恵比寿・池袋で提供。",
);

const shirodhara = source(
  "concern",
  "シローダーラーコース",
  "https://expanse.jp/menu02",
  "頭が休まらない、睡眠、ストレス、眼精疲労、頭の疲れには温かいオイルを額へ流すシローダーラーが候補。60分通常17,600円／初回15,400円。全身アヴィヤンガ＋シローダーラー120分通常26,900円／初回23,700円。20分オプション8,250円。恵比寿・池袋の料金で、銀座SPAは別体系。",
);

const hamam = source(
  "concern",
  "ハマム浴・温活コース",
  "https://expanse.jp/menu02",
  "冷え、温活、むくみ、発汗を伴うケアにはハーブスチームで温めるハマム浴が候補。120分通常25,300円／初回18,700円。別コースへ追加する30分オプションは3,850円で単独予約不可。恵比寿・池袋で提供。",
);

const facial = source(
  "concern",
  "ExpaRフェイシャル",
  "https://expanse.jp/menu02",
  "顔や肌のケアにはExpaRフェイシャル60分が候補。通常12,650円／初回9,900円。ムカヴィヤンガ30分6,050円はオプションで単独予約不可。恵比寿・池袋で提供。",
);

const maternity = source(
  "concern",
  "マタニティコース",
  "https://expanse.jp/menu02",
  "妊娠中向けマタニティコースは60分、通常20,900円／初回16,500円。体調に配慮し横向きなど楽な姿勢で、腰やむくみやすい下半身を中心に施術する。必ず医師の了承を得て予約・来店する。恵比寿・池袋で提供。",
);

const dosha = source(
  "ayurveda",
  "アーユルヴェーダ体質・ドーシャ",
  "https://expanse.jp/blog/5512.html",
  "アーユルヴェーダでは心身をヴァータ・ピッタ・カパの3つのドーシャで捉える。ヴァータは風と空で動き・循環を司り、乱れると冷え・乾燥・不眠などが出やすく、温める・休む・潤すことを意識する。ピッタは火と水で消化・代謝・集中力を司り、乱れるとイライラ・肌荒れ・胃の不調などが出やすく、冷ます・休む・穏やかに過ごす。カパは地と水で安定・潤いを支え、乱れると重さ・むくみ・だるさが出やすく、動かす・軽くする・温めることを意識する。診断は傾向の目安で医療診断ではない。",
);

const bridal = source(
  "bridal",
  "Expanse ブライダルエステ",
  "https://expanse.jp/bridal",
  "ブライダルエステは、挙式日、悩み、希望、予算やスケジュールをカウンセリングし、一人ひとりに合わせたオーダーメイドプログラムを作成する。Expanse独自のアユルハンドを中心に、オールハンドのボディ施術で当日へ向けて整える。具体的な回数・内容・料金は希望条件を確認して相談する。",
);

function addUnique(target: StructuredSource[], item: StructuredSource) {
  if (!target.some((current) => current.title === item.title)) target.push(item);
}

export function intentFor(query: string): KnowledgeIntent {
  const text = query.normalize("NFKC").toLowerCase();
  if (/(働|仕事|就職|転職|採用|求人|募集|応募|エントリー|職種|給料|給与|月給|時給|セラピストにな|スタッフにな)/.test(text)) return "recruitment";
  if (/(予約|空き|キャンセル|変更|遅刻|問い合わせ)/.test(text)) return "reservation";
  if (/(店舗|お店|住所|所在地|アクセス|最寄り|近い|行きやすい|営業時間|電話|渋谷|新宿|東京駅|品川|上野)/.test(text)) return "store";
  if (/(ブライダル|挙式|結婚式|花嫁)/.test(text)) return "bridal";
  if (/(初めて|初回|カウンセリング|妊娠|妊婦|持病|通院|男性|ペア|二人)/.test(text)) return "first_visit";
  if (/(アーユルヴェーダ|アーユルベーダ|ドーシャ|ヴァータ|ピッタ|カパ|体質診断)/.test(text)) return "ayurveda";
  if (/(太もも|下半身|脚|お尻|ヒップ|二の腕|ウエスト|痩身|引き締|セルライト|むくみ|冷え|肩|背中|腰|こり|疲れ|睡眠|不眠|頭|眼精疲労|ストレス|顔|肌)/.test(text)) return "concern";
  if (/(メニュー|コース|施術|料金|値段|価格|いくら|何円|オプション|時間|何分)/.test(text)) return "menu";
  return "general";
}

export function structuredSourcesFor(query: string): StructuredSource[] {
  const text = query.normalize("NFKC").toLowerCase();
  const intent = intentFor(text);
  if (intent === "recruitment") return [recruitment];
  if (intent === "reservation") return [reservations, stores];
  if (intent === "store") return [stores];
  if (intent === "bridal") return [bridal];
  if (intent === "first_visit") {
    if (/(妊娠|妊婦|マタニティ)/.test(text)) return [maternity, firstVisit];
    return [firstVisit, stores];
  }
  if (intent === "ayurveda") return [dosha];

  const results: StructuredSource[] = [];
  if (/(太もも|下半身|脚痩せ|脚やせ|お尻|ヒップ|二の腕|ウエスト|痩身|引き締|セルライト|ボディライン|ダイエット)/.test(text)) addUnique(results, ayurhand);
  if (/(全身|疲れ|疲労|肩|背中|腰|こり|体質|アヴィヤンガ|アビヤンガ)/.test(text)) addUnique(results, abhyanga);
  if (/(眠|睡眠|不眠|頭|脳疲労|眼精疲労|ストレス|シローダーラー|シロダーラー)/.test(text)) addUnique(results, shirodhara);
  if (/(冷え|温活|発汗|ハマム|むくみ)/.test(text)) addUnique(results, hamam);
  if (/(顔|肌|フェイシャル|ムカヴィヤンガ)/.test(text)) addUnique(results, facial);
  if (/(妊娠|妊婦|マタニティ)/.test(text)) addUnique(results, maternity);
  if (/(オプション|ヘッド|延長|ハーブボール|よもぎ|腸マッサージ)/.test(text)) addUnique(results, options);
  if (intent === "menu" || /(料金|値段|価格|いくら|何円|おすすめ|どれ|比較)/.test(text)) addUnique(results, menuCatalog);
  return results.slice(0, 4);
}

export function retrievalQueryFor(currentMessage: string, previousUserMessages: string[]) {
  const current = currentMessage.trim();
  const needsContext =
    /^(それ|その|これ|この|あれ|前の|さっき|同じ)|それの|そのコース|その店舗|どっち|比較して|詳しく|料金は|値段は|予約は/.test(current);
  if (!needsContext) return current;
  return [...previousUserMessages.slice(-2), current].join(" ");
}
