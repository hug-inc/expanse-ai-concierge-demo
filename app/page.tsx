"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  actions?: string[];
  link?: { label: string; href: string };
};

const topics = ["コースを相談したい", "店舗について", "料金・時間について", "予約について"];

const answers: Record<string, Omit<Message, "id" | "role">> = {
  "コースを相談したい": {
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
};

const initialMessage: Message = {
  id: 1,
  role: "bot",
  text: "こんにちは。アーユルヴェーダサロン Expanse のご案内係です。コース選びや店舗について、どのようなことをお探しですか？",
  actions: topics,
};

function replyFor(input: string): Omit<Message, "id" | "role"> {
  if (answers[input]) return answers[input];
  const text = input.trim();
  if (/予約|空き/.test(text)) return answers["予約について"];
  if (/料金|値段|時間|何分/.test(text)) return answers["料金・時間について"];
  if (/銀座/.test(text)) return answers["銀座SPA"];
  if (/恵比寿/.test(text)) return answers["恵比寿本店"];
  if (/池袋/.test(text)) return answers["池袋本店"];
  if (/眠|頭|眼精|ストレス/.test(text)) return answers["眠り・頭の疲れ"];
  if (/肩|腰|こり|疲れ/.test(text)) return answers["肩・腰の疲れ"];
  if (/冷え|むくみ/.test(text)) return answers["むくみ・冷え"];
  return {
    text: "ありがとうございます。このデモではコース・店舗・料金・予約についてご案内できます。下の項目から選ぶか、もう少し短い言葉でお聞かせください。",
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
            AIコンシェルジュに相談
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
        <p className="intro-body">初めての方にも安心してお過ごしいただけるよう、丁寧なカウンセリングから始めます。今日のお悩みや理想の過ごし方を、AIコンシェルジュにもお気軽にご相談ください。</p>
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
        <div className="chat-demo-notice">デモ版・AI API未接続</div>
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
        <p className="chat-footnote">医療的な診断は行いません。情報はデモ用です。</p>
      </section>
    </main>
  );
}
