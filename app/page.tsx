"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  actions?: string[];
  link?: { label: string; href: string };
};

const topics = ["コース相談", "よくある質問", "ブログから探す", "店舗・予約"];

const answers: Record<string, Omit<Message, "id" | "role">> = {
  "コース相談": {
    text: "もちろんです。今いちばん気になることを教えてください。",
    actions: ["肩・腰の疲れ", "眠り・頭の疲れ", "むくみ・冷え", "まずは全身ケア"],
  },
  "肩・腰の疲れ": {
    text: "肩・背中・腰を含む「アヴィヤンガ全身」がおすすめです。温かいハーブオイルを使い、全身を丁寧にケアします。より深く休みたい方にはシローダーラーとの組み合わせも人気です。",
    actions: ["店舗を選ぶ", "料金・時間について"],
  },
  "眠り・頭の疲れ": {
    text: "頭が休まらない、寝てもすっきりしない方には「シローダーラー」がおすすめです。温かいオイルを額にゆっくり流す、アーユルヴェーダを代表するトリートメントです。",
    actions: ["店舗を選ぶ", "予約について"],
  },
  "むくみ・冷え": {
    text: "全身を温めながら巡りを整える「アヴィヤンガ全身」と、ハマム浴の組み合わせがおすすめです。当日の体調に合わせてセラピストが内容をご案内します。",
    actions: ["店舗を選ぶ", "料金・時間について"],
  },
  "まずは全身ケア": {
    text: "初めての方には、背中・肩・腰・脚などを広くケアする全身アヴィヤンガがおすすめです。カウンセリングで体調を伺ってから施術しますので、ご安心ください。",
    actions: ["店舗を選ぶ", "予約について"],
  },
  "店舗について": {
    text: "エクスパンスは銀座・恵比寿・池袋に店舗があります。ご希望の店舗を選んでください。",
    actions: ["銀座SPA", "恵比寿本店", "池袋本店"],
  },
  "店舗を選ぶ": {
    text: "ご希望の店舗を選んでください。",
    actions: ["銀座SPA", "恵比寿本店", "池袋本店"],
  },
  "銀座SPA": {
    text: "銀座中央通りにある完全予約制のSPAです。アヴィヤンガやシローダーラーに加え、曜日限定のドクターセラピーコースもあります。",
    link: { label: "銀座SPAの予約ページへ", href: "https://expanse.jp/reserve/" },
  },
  "恵比寿本店": {
    text: "恵比寿本店では、全身アヴィヤンガやシローダーラー、ハマム浴などをご案内しています。目的に合わせたコース相談も可能です。",
    link: { label: "恵比寿本店の予約ページへ", href: "https://expanse.jp/reserve/" },
  },
  "池袋本店": {
    text: "池袋本店では、全身ケアやシローダーラー、ヘッドスパを組み合わせたコースなどをご案内しています。",
    link: { label: "池袋本店の予約ページへ", href: "https://expanse.jp/reserve/" },
  },
  "料金・時間について": {
    text: "コースや店舗、キャンペーンにより異なります。例として全身＋シローダーラーは120分前後のプランがあります。最新の料金は公式ページでご確認いただくか、店舗を選んでください。",
    actions: ["銀座SPA", "恵比寿本店", "池袋本店"],
  },
  "予約について": {
    text: "公式予約ページから店舗・コース・日時を選択できます。空き状況や当日のご相談は、各店舗へ直接お問い合わせください。",
    link: { label: "公式予約ページを開く", href: "https://expanse.jp/reserve/" },
  },
  "店舗・予約": {
    text: "銀座・恵比寿・池袋の3店舗があります。全店、平日は11:00〜20:00、土日祝は10:00〜20:00で、最終受付は18:00と案内されています。店舗情報と予約、どちらをご覧になりますか？",
    actions: ["店舗について", "予約について", "営業時間・電話番号"],
  },
  "よくある質問": {
    text: "初めての方から多い質問をまとめました。知りたい項目を選んでください。",
    actions: ["初めてでも大丈夫？", "施術時間とカウンセリング", "妊娠中・通院中の場合", "男性・ペア利用"],
  },
  "初めてでも大丈夫？": {
    text: "はい。初回は身体の状態や体質についてカウンセリングを行い、内容を確認してから施術します。公式サイトでは初回来店時に15分ほどのカウンセリング時間を設けると案内されています。",
    link: { label: "「初めての方へ」を見る", href: "https://expanse.jp/first02" },
  },
  "施術時間とカウンセリング": {
    text: "メニューに記載された施術時間に、カウンセリング時間は含まれません。初回来店時は別途15分ほどのカウンセリング時間が案内されています。コースによってシャワーや着替えの時間も異なるため、余裕をもってご予定ください。",
    link: { label: "メニューと注意事項を見る", href: "https://expanse.jp/menu02" },
  },
  "妊娠中・通院中の場合": {
    text: "妊娠中・持病のある方・通院中の方は、医師の了承を得てから予約・来店するよう公式サイトで案内されています。妊婦向けのマタニティコースもありますが、体調を最優先に、事前に店舗へご相談ください。",
    link: { label: "マタニティコースを確認する", href: "https://expanse.jp/menu02" },
  },
  "男性・ペア利用": {
    text: "銀座SPAの予約ページには男性向けトリートメントと、2名で利用できるペア限定プランが掲載されています。店舗や日時により受付状況が異なるため、予約時にご確認ください。",
    link: { label: "予約メニューを確認する", href: "https://expanse.jp/ginza/reserve.html" },
  },
  "営業時間・電話番号": {
    text: "公式サイトの掲載情報です。\n\n恵比寿本店：03-3442-6656\n池袋本店：0800-800-1787\n銀座SPA：03-6263-9501\n\n平日 11:00〜20:00、土日祝 10:00〜20:00（最終受付18:00）です。",
    link: { label: "公式の店舗情報を見る", href: "https://expanse.jp/first02#contact" },
  },
  "ブログから探す": {
    text: "Expanse公式ブログの記事から、気になるテーマをご案内します。読みたいテーマを選んでください。",
    actions: ["冷え・温活", "体質・ドーシャ", "食事・セルフケア", "美容・セルライト"],
  },
  "冷え・温活": {
    text: "冷えのタイプを整理し、無理なく続けられる温活を紹介した記事があります。一時的に温めるだけでなく、熱を作れる身体を目指す考え方が解説されています。",
    link: { label: "冷え性の温活記事を読む", href: "https://expanse.jp/blog/6070.html" },
  },
  "体質・ドーシャ": {
    text: "アーユルヴェーダでは、ヴァータ・ピッタ・カパという3つのエネルギーから体質を捉えます。公式ブログでは、たとえばピッタの特徴や整え方を詳しく紹介しています。",
    link: { label: "ピッタ体質の記事を読む", href: "https://expanse.jp/blog/5485.html" },
  },
  "食事・セルフケア": {
    text: "公式ブログには、アーユルヴェーダの「6つの味」や、体質に合わせた食事の考え方など、日常に取り入れやすい記事があります。",
    link: { label: "アーユルヴェーダの6つの味を読む", href: "https://expanse.jp/blog/649.html" },
  },
  "美容・セルライト": {
    text: "セルライトは、皮下脂肪が皮膚の下の結合組織を押し上げる一方、線維性の組織が皮膚を引き下げることで、表面がオレンジの皮のように凸凹して見える状態です。太もも・おしり・腰まわりなどに現れやすく、体型にかかわらず見られる一般的で健康上は害のない変化です。\n\n脂肪そのものと同じではないため、体重を落とすだけで必ず消えるとは限りません。体重増加で目立ちやすくなることはありますが、痩せている方にもできます。\n\n見た目を整えるには、急激な減量よりも、適度な運動・筋力維持・バランスのよい食事・長時間同じ姿勢を避けることを続けるのが基本です。マッサージはむくみや筋肉の張りを和らげ、見え方を一時的に整える助けにはなりますが、セルライトを完全に除去するものではありません。",
    actions: ["セルライトの原因", "痩せたら消える？", "触ると痛い場合", "セルライトのセルフケア"],
    link: { label: "Expanseのセルライト解説を読む", href: "https://expanse.jp/blog/6516.html" },
  },
  "セルライトの原因": {
    text: "主な仕組みは、皮下脂肪と皮膚をつなぐ線維性の結合組織の構造です。脂肪が上へ押し出され、結合組織が皮膚を下へ引くため凸凹が生まれます。\n\n目立ち方には、遺伝、ホルモン、加齢による皮膚の弾力低下、体重、筋肉量、活動量など複数の要素が関係します。「老廃物だけが固まったもの」という単純な説明ではありません。",
    link: { label: "原因と対策の記事を読む", href: "https://expanse.jp/blog/6516.html" },
  },
  "痩せたら消える？": {
    text: "体脂肪が減ることで目立ちにくくなる場合はありますが、セルライトは脂肪量だけでなく皮膚と結合組織の構造にも関係するため、減量だけで完全に消えるとは限りません。急激に痩せて皮膚がゆるむと、かえって凸凹が目立つこともあります。\n\n無理な食事制限ではなく、筋力トレーニングや有酸素運動、十分な栄養を組み合わせ、健康的な体重を維持するのが現実的です。",
    link: { label: "脂肪との違いを解説した記事を読む", href: "https://expanse.jp/blog/6473.html" },
  },
  "触ると痛い場合": {
    text: "セルライト自体は一般に健康上無害で、強い痛みを起こすものとは限りません。触れるだけで痛い場合は、むくみ、筋肉の緊張、皮膚や皮下組織の炎症など別の原因も考えられるため、「セルライトだから」と決めつけないことが大切です。\n\n強く揉まず、痛みが続く、片脚だけ腫れる、赤み・熱感がある、急に悪化した場合は、サロンではなく医療機関へご相談ください。",
    link: { label: "痛みについての記事を読む", href: "https://expanse.jp/blog/6515.html" },
  },
  "セルライトのセルフケア": {
    text: "毎日の対策は、①長時間座りっぱなし・立ちっぱなしを避ける、②ウォーキングや下半身の筋力トレーニングを続ける、③塩分に偏らない食事と十分な水分を意識する、④入浴後などに痛くない強さでやさしくケアする、の4つが基本です。\n\n強くつぶすようなマッサージは、内出血や炎症につながることがあります。見た目の変化には時間がかかるため、無理なく継続できる方法を選んでください。",
    link: { label: "生活習慣の記事を読む", href: "https://expanse.jp/blog/6461.html" },
  },
  "アーユルヴェーダとは？": {
    text: "アーユルヴェーダはインド・スリランカで生まれた伝統医学の一つで、身体と心のバランスを整え、健康を維持する考え方です。Expanseでは体質や当日の状態を確認し、ハーブオイルを使った施術を案内しています。",
    link: { label: "公式の解説ページを見る", href: "https://expanse.jp/service" },
  },
};

const initialMessage: Message = {
  id: 1,
  role: "bot",
  text: "こんにちは。Expanseのサイト案内コンシェルジュです。コースや店舗のほか、よくある質問、ブログ、アーユルヴェーダの解説もご案内できます。",
  actions: topics,
};

function replyFor(input: string): Omit<Message, "id" | "role"> {
  if (answers[input]) return answers[input];
  const text = input.trim();
  if (/アーユルヴェーダとは|アーユルベーダとは|どんなもの/.test(text)) return answers["アーユルヴェーダとは？"];
  if (/初めて|初回|カウンセリング/.test(text)) return answers["初めてでも大丈夫？"];
  if (/妊娠|妊婦|持病|通院|医師/.test(text)) return answers["妊娠中・通院中の場合"];
  if (/男性|ペア|二人|カップル/.test(text)) return answers["男性・ペア利用"];
  if (/営業時間|電話|連絡先/.test(text)) return answers["営業時間・電話番号"];
  if (/ブログ|記事|読み物/.test(text)) return answers["ブログから探す"];
  if (/ドーシャ|ヴァータ|ピッタ|カパ|体質/.test(text)) return answers["体質・ドーシャ"];
  if (/食事|セルフケア|味/.test(text)) return answers["食事・セルフケア"];
  if (/冷え|温活/.test(text)) return answers["冷え・温活"];
  if (/触る.*痛|押す.*痛|セルライト.*痛/.test(text)) return answers["触ると痛い場合"];
  if (/セルライト.*原因|なぜ.*セルライト/.test(text)) return answers["セルライトの原因"];
  if (/痩せ.*セルライト|セルライト.*痩せ|ダイエット.*セルライト/.test(text)) return answers["痩せたら消える？"];
  if (/セルライト.*ケア|セルライト.*改善|セルライト.*なく|セルライト.*消/.test(text)) return answers["セルライトのセルフケア"];
  if (/セルライト|美容|フェイシャル/.test(text)) return answers["美容・セルライト"];
  if (/予約|空き/.test(text)) return answers["予約について"];
  if (/料金|値段|時間|何分/.test(text)) return answers["料金・時間について"];
  if (/銀座/.test(text)) return answers["銀座SPA"];
  if (/恵比寿/.test(text)) return answers["恵比寿本店"];
  if (/池袋/.test(text)) return answers["池袋本店"];
  if (/眠|頭|眼精|ストレス/.test(text)) return answers["眠り・頭の疲れ"];
  if (/肩|腰|こり|疲れ/.test(text)) return answers["肩・腰の疲れ"];
  if (/むくみ/.test(text)) return answers["むくみ・冷え"];
  return {
    text: "ありがとうございます。サイトに掲載されたコース・店舗・予約・FAQ・ブログ・アーユルヴェーダ情報をご案内できます。下の項目から選ぶか、知りたいことを短い言葉でお聞かせください。",
    actions: topics,
  };
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages((current) => [...current, { id: Date.now(), role: "user", text: clean }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const reply = replyFor(clean);
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "bot", ...reply },
      ]);
      setTyping(false);
    }, 520);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  return (
    <main>
      <div className="demo-ribbon">CHATBOT DEMO / 本番サイトには影響しません</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Expanse デモページのトップへ">
          <span className="brand-main">Expanse..</span>
          <span className="brand-sub">AYURVEDA SALON</span>
        </a>
        <nav aria-label="メインメニュー">
          <a href="#about">初めての方へ</a>
          <a href="#courses">MENU</a>
          <a href="#shops">SHOP LIST</a>
        </nav>
        <button className="reserve-head" onClick={() => setOpen(true)}>ご予約・ご相談</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="hero-copy">
          <p className="eyebrow">AUTHENTIC AYURVEDA</p>
          <h1>深く休み、<br />本来のわたしへ。</h1>
          <p>温かなハーブオイルと確かな手技で、<br className="desktop" />心と身体をゆっくり解きほぐす時間を。</p>
          <button className="hero-cta" onClick={() => setOpen(true)}>
            サイト案内AIに質問する
            <span>→</span>
          </button>
        </div>
        <div className="hero-note">
          <span>SCROLL</span><i />
        </div>
      </section>

      <section className="intro" id="about">
        <p className="section-kicker">WELCOME TO EXPANSE</p>
        <h2>あなたの今に寄り添う、<br />アーユルヴェーダ体験</h2>
        <p className="intro-body">初めての方にも安心してお過ごしいただけるよう、丁寧なカウンセリングから始めます。コース選びだけでなく、よくある質問や公式ブログの記事もAIコンシェルジュにお気軽にお尋ねください。</p>
      </section>

      <section className="courses" id="courses">
        <div className="section-heading">
          <div>
            <p className="section-kicker">RECOMMENDED</p>
            <h2>おすすめの過ごし方</h2>
          </div>
          <button onClick={() => setOpen(true)}>自分に合うコースを相談 →</button>
        </div>
        <div className="course-grid">
          <article className="course-card card-01">
            <span>01</span>
            <div><p>全身を整える</p><h3>アヴィヤンガ</h3></div>
          </article>
          <article className="course-card card-02">
            <span>02</span>
            <div><p>頭と心を静める</p><h3>シローダーラー</h3></div>
          </article>
          <article className="course-card card-03">
            <span>03</span>
            <div><p>温めて巡らせる</p><h3>ハマム浴</h3></div>
          </article>
        </div>
      </section>

      <section className="shops" id="shops">
        <p className="section-kicker">SALON LIST</p>
        <h2>銀座・恵比寿・池袋</h2>
        <p>お近くのサロンをご案内します。</p>
        <button onClick={() => { setOpen(true); window.setTimeout(() => send("店舗について"), 100); }}>店舗を相談する</button>
      </section>

      <button
        className={`chat-launcher ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "チャットを閉じる" : "AIコンシェルジュを開く"}
        aria-expanded={open}
      >
        {open ? <span className="close-icon">×</span> : <><span className="chat-mark">✦</span><span className="launcher-copy"><b>AIに相談</b><small>コース選びをお手伝い</small></span></>}
      </button>

      <section className={`chat-panel ${open ? "is-open" : ""}`} aria-label="AIコンシェルジュ" aria-hidden={!open}>
        <div className="chat-header">
          <div className="avatar">E</div>
          <div>
            <strong>Expanse コンシェルジュ</strong>
            <span><i /> オンライン</span>
          </div>
          <button onClick={() => setOpen(false)} aria-label="チャットを閉じる">×</button>
        </div>
        <div className="chat-demo-notice">デモ版・公式サイト掲載情報をもとにご案内</div>
        <div className="chat-messages" aria-live="polite">
          {messages.map((message) => (
            <div className={`message-row ${message.role}`} key={message.id}>
              {message.role === "bot" && <span className="mini-avatar">E</span>}
              <div>
                <div className="bubble">{message.text}</div>
                {message.actions && (
                  <div className="quick-actions">
                    {message.actions.map((action) => (
                      <button key={action} onClick={() => send(action)} disabled={typing}>{action}</button>
                    ))}
                  </div>
                )}
                {message.link && (
                  <a className="chat-link" href={message.link.href} target="_blank" rel="noreferrer">
                    {message.link.label} <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="message-row bot">
              <span className="mini-avatar">E</span>
              <div className="bubble typing"><i /><i /><i /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <form className="chat-input" onSubmit={submit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="ご質問を入力してください"
            aria-label="ご質問"
          />
          <button type="submit" disabled={!input.trim() || typing} aria-label="送信">→</button>
        </form>
        <p className="chat-footnote">医療的な診断は行いません。最新情報はリンク先の公式ページをご確認ください。</p>
      </section>
    </main>
  );
}
