"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { openPremium, postWithSession, premiumEnabled, usePremium } from "@/lib/billing/premium";
import { getPremiumCopy } from "@/lib/premium/copy";
import styles from "./examPrep.module.css";

type Message = { role: "user" | "assistant"; content: string };
type Props = { topic: string; course: string; subject: string; concepts: string };

const starters = ["Explain this topic in simple words", "Give me an exam-style question", "What mistakes do students make here?"];

/** An AI tutor box on the topic page. It uses the same Premium tutor service as the simulations, with the topic as context. */
export function TopicTutor({ topic, course, subject, concepts }: Props) {
  const copy = getPremiumCopy("en");
  const premium = usePremium();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [messages, busy, error]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const { ok, data } = await postWithSession<{ reply?: string }>("/api/ai/tutor", { locale: "en", topic: { name: topic, course }, simulation: { title: topic, subject, concepts }, messages: next.slice(-12) });
      if (ok && data.reply) setMessages([...next, { role: "assistant", content: data.reply }]);
      else setError(data.error || copy.tutor.error);
    } catch { setError(copy.tutor.error); }
    setBusy(false);
  };
  const submit = (event: FormEvent) => { event.preventDefault(); void send(input); };

  return <section className={styles.panel} aria-labelledby="topic-tutor" data-clarity-mask="true">
    <div className={styles.panelTop}><h2 id="topic-tutor">Ask the AI tutor about {topic}</h2><span className={`${styles.badge} ${styles.paid}`}>Premium</span></div>
    {premium !== "premium" ? <>
      <p>Stuck on something? The AI tutor knows which topic you are studying and can explain it another way, give you more practice questions or check your reasoning.</p>
      <div className={styles.actions} style={{ marginTop: 0 }}>
        {premiumEnabled && premium === "free" && <button type="button" className="button primary" onClick={() => openPremium("tutor")}>Unlock the AI tutor</button>}
        <Link className={premiumEnabled ? "button" : "button primary"} href="/en/premium">See what Premium includes →</Link>
      </div>
    </> : <>
      <div className={styles.chat} ref={log} aria-live="polite">
        <p className={`${styles.msg} ${styles.assistant}`}>{copy.tutor.greeting(topic)}</p>
        {messages.map((message, index) => <p key={index} className={`${styles.msg} ${message.role === "user" ? styles.user : styles.assistant}`}>{message.content}</p>)}
        {busy && <p className={`${styles.msg} ${styles.assistant}`}>{copy.tutor.thinking}</p>}
        {error && <p role="alert" className={styles.chatError}>{error}</p>}
      </div>
      {messages.length === 0 && <div className={styles.starters}>{starters.map((starter) => <button type="button" key={starter} disabled={busy} onClick={() => void send(starter)}>{starter}</button>)}</div>}
      <form className={styles.chatForm} onSubmit={submit}>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={2} maxLength={1000} placeholder={copy.tutor.placeholder} aria-label={copy.tutor.placeholder}
          onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(input); } }} />
        <button type="submit" className="button primary" disabled={busy || !input.trim()}>{copy.tutor.send}</button>
      </form>
      <p className={styles.chatNote}>{copy.tutor.disclaimer}</p>
    </>}
  </section>;
}
