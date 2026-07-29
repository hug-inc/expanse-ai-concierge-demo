export type StructuredSource = {
  title: string;
  url: string;
  passage: string;
};

const stores: StructuredSource = {
  title: "Expanse 店舗一覧・アクセス",
  url: "https://expanse.jp/#shoplist",
  passage:
    "現在の店舗は恵比寿本店・池袋本店・銀座SPAの3店舗。恵比寿本店は東京都渋谷区恵比寿4-3-1 クイズ恵比寿3F-O、電話03-3442-6656、店舗ページhttps://expanse.jp/ebisu02。池袋本店は東京都豊島区南池袋1-17-2 南池袋I-Nビル8F、電話0800-800-1787、店舗ページhttps://expanse.jp/ikebukuro02。銀座SPAは東京都中央区銀座7-9-11 モンブラン銀座ビル8階、電話03-6263-9501、店舗ページhttps://expanse.jp/ginza02。全店、平日11:00〜20:00、土日祝10:00〜20:00、最終受付18:00。旧渋谷店は閉店済み。渋谷からはJRで隣駅かつ隣接エリアの恵比寿本店が通常もっとも近く行きやすい。",
};

const recruitment: StructuredSource = {
  title: "Expanse 採用情報・募集職種",
  url: "https://expanse.jp/recruit_02",
  passage:
    "Expanseでは、セラピスト、レセプション・カウンセラー、WEBデザイナー、グラフィックデザイナー、WEBマーケター、動画クリエイター、EC shop運営担当、EC Shop運営責任者を募集。店舗職の希望勤務地は銀座中央通り店・池袋本店・恵比寿本店。未経験から応募できるセラピスト募集もある。職種ごとに仕事内容・条件・給与・休日が異なるため、希望職種を確認して詳しい条件を案内する。応募フォームはhttps://expanse.jp/recruit_02#entry、採用担当は03-6263-9501（10:00〜17:00）。",
};

const ayurhand: StructuredSource = {
  title: "アユルハンド（痩身）コース",
  url: "https://expanse.jp/menu02",
  passage:
    "太もも・お尻・下半身の引き締め、セルライト、むくみ、ボディラインの相談では、Expanse独自の痩身技術「アユルハンド」が第一候補。強圧のオールハンドで全身を揉みこみ、むくみ、代謝促進、セルライトケア、ボディラインを整えることを目的とする。恵比寿本店・池袋本店で提供。全身90分は通常26,400円／初回20,900円、120分は通常30,800円／初回24,200円。",
};

const abhyanga: StructuredSource = {
  title: "アヴィヤンガ全身コース",
  url: "https://expanse.jp/menu02",
  passage:
    "全身疲労、肩・背中・腰のこり、体質ケア、リラックスには、体質と当日の状態に合わせた温かいハーブオイルで全身を施術するアヴィヤンガが第一候補。恵比寿本店・池袋本店で提供。全身90分は通常22,000円／初回17,600円、120分は通常26,400円／初回20,900円。初回カウンセリングは施術時間とは別に約15分。",
};

const shirodhara: StructuredSource = {
  title: "シローダーラーコース",
  url: "https://expanse.jp/menu02",
  passage:
    "頭が休まらない、睡眠、ストレス、眼精疲労、頭の疲れには、温かいオイルを額へ流すシローダーラーが候補。恵比寿・池袋のシローダーラー60分は通常17,600円／初回15,400円。アヴィヤンガ全身＋シローダーラー120分は通常26,900円／初回23,700円。20分オプションは8,250円。銀座SPAは別料金体系。",
};

const hamam: StructuredSource = {
  title: "ハマム浴・温活コース",
  url: "https://expanse.jp/menu02",
  passage:
    "冷え、温活、むくみ、発汗を伴うケアには、ハーブスチームで身体を温めるハマム浴が候補。恵比寿・池袋のハマム浴コース120分は通常25,300円／初回18,700円。別コースへ追加する30分オプションは3,850円で、オプション単独では予約不可。",
};

const facial: StructuredSource = {
  title: "ExpaRフェイシャル",
  url: "https://expanse.jp/menu02",
  passage:
    "顔や肌のケアにはExpaRフェイシャル60分が候補。恵比寿・池袋で通常12,650円／初回9,900円。ムカヴィヤンガ30分6,050円はオプションで、単独予約不可。",
};

const maternity: StructuredSource = {
  title: "マタニティコース",
  url: "https://expanse.jp/menu02",
  passage:
    "妊娠中の方向けマタニティコースは恵比寿・池袋で60分、通常20,900円／初回16,500円。妊娠中・持病・通院中の場合は医師の了承を得て、予約前に店舗へ相談する。",
};

const menuCatalog: StructuredSource = {
  title: "恵比寿本店・池袋本店 メニューと料金",
  url: "https://expanse.jp/menu02",
  passage:
    "主なメニューは、アヴィヤンガ全身90分22,000円／初回17,600円・120分26,400円／初回20,900円、アユルハンド全身90分26,400円／初回20,900円・120分30,800円／初回24,200円、マタニティ60分20,900円／初回16,500円、ExpaRフェイシャル60分12,650円／初回9,900円、シローダーラー60分17,600円／初回15,400円、ハマム浴120分25,300円／初回18,700円。池袋限定の漢方アロマは90分23,650円／初回19,250円、120分28,050円／初回22,550円。銀座SPAは別メニュー・別料金。",
};

function addUnique(target: StructuredSource[], source: StructuredSource) {
  if (!target.some((item) => item.title === source.title)) target.push(source);
}

export function structuredSourcesFor(query: string): StructuredSource[] {
  const text = query.normalize("NFKC").toLowerCase();
  const results: StructuredSource[] = [];

  if (/(働|仕事|就職|転職|採用|求人|募集|応募|エントリー|職種|給料|給与|セラピストにな|スタッフにな)/.test(text)) {
    addUnique(results, recruitment);
    return results;
  }

  if (/(店舗|お店|住所|所在地|アクセス|最寄り|近い|行きやすい|営業時間|電話|渋谷|恵比寿|池袋|銀座)/.test(text)) {
    addUnique(results, stores);
  }
  if (/(太もも|下半身|脚痩せ|脚やせ|お尻|ヒップ|痩身|引き締|セルライト|ボディライン|ダイエット)/.test(text)) {
    addUnique(results, ayurhand);
  }
  if (/(全身|疲れ|疲労|肩|背中|腰|こり|体質|アヴィヤンガ|アビヤンガ)/.test(text)) {
    addUnique(results, abhyanga);
  }
  if (/(眠|睡眠|不眠|頭|脳疲労|眼精疲労|ストレス|シローダーラー|シロダーラー)/.test(text)) {
    addUnique(results, shirodhara);
  }
  if (/(冷え|温活|発汗|ハマム|むくみ)/.test(text)) {
    addUnique(results, hamam);
  }
  if (/(顔|肌|フェイシャル|ムカヴィヤンガ)/.test(text)) {
    addUnique(results, facial);
  }
  if (/(妊娠|妊婦|マタニティ)/.test(text)) {
    addUnique(results, maternity);
  }
  if (/(メニュー|コース|料金|値段|価格|いくら|何円|おすすめ|どれ|比較)/.test(text)) {
    addUnique(results, menuCatalog);
  }

  return results.slice(0, 4);
}

export function retrievalQueryFor(currentMessage: string, previousUserMessages: string[]) {
  const current = currentMessage.trim();
  const needsContext =
    /^(それ|その|これ|この|あれ|前の|さっき|同じ)|それの|そのコース|その店舗|どっち|比較して|詳しく|料金は|値段は|予約は/.test(current);

  if (!needsContext) return current;
  return [...previousUserMessages.slice(-2), current].join(" ");
}
