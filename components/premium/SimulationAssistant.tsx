"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { openPremium, postWithSession, premiumEnabled, usePremium } from "@/lib/billing/premium";
import { getPremiumCopy } from "@/lib/premium/copy";

type Simulation = { title: string; subject?: string; concepts?: string };
type Message = { role: "user" | "assistant"; content: string };

// Shown at most once per browser session, after 30 seconds with a simulation visible.
const promptShownKey = "learnerkits-premium-prompt-shown";
const promptDelaySeconds = 30;

/** Mounted on simulation pages: the Premium reminder timer and the AI tutor panel. */
export function SimulationAssistant(props: { locale: string; simulation: Simulation }) {
  return <ActiveSimulationAssistant {...props}/>;
}

function ActiveSimulationAssistant({ locale, simulation }: { locale: string; simulation: Simulation }) {
  const copy = getPremiumCopy(locale);
  const premium = usePremium();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!premiumEnabled || premium !== "free") return;
    try { if (sessionStorage.getItem(promptShownKey)) return; } catch { return; }
    let seconds = 0;
    const timer = window.setInterval(() => {
      // Count only time the student can actually see the simulation.
      if (document.visibilityState !== "visible" || ++seconds < promptDelaySeconds) return;
      window.clearInterval(timer);
      try { sessionStorage.setItem(promptShownKey, "1"); } catch { /* ignore */ }
      openPremium("timer");
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [premium]);

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [messages, busy, error]);

  if (!premiumEnabled) return null;

  const toggle = () => {
    if (premium === "premium") setOpen((value) => !value);
    else if (premium === "free") openPremium("tutor");
  };

  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const { ok, data } = await postWithSession<{ reply?: string }>("/api/ai/tutor", { locale, simulation, messages: next.slice(-12) });
      if (ok && data.reply) setMessages([...next, { role: "assistant", content: data.reply }]);
      else setError(data.error || copy.tutor.error);
    } catch { setError(copy.tutor.error); }
    setBusy(false);
  };

  return <>
    <button type="button" className="tutorFab" onClick={toggle} aria-expanded={premium === "premium" ? open : undefined} aria-controls={premium === "premium" ? "ai-tutor-panel" : undefined}>
      <span aria-hidden="true">✦</span>{copy.tutor.button}{premium === "free" && <small>{copy.badge}</small>}
    </button>
    {open && premium === "premium" && <section id="ai-tutor-panel" className="tutorPanel" aria-label={copy.tutor.title} data-clarity-mask="true">
      <header><strong>{copy.tutor.title}</strong><button type="button" onClick={() => setOpen(false)} aria-label={copy.tutor.close}>×</button></header>
      <div className="tutorMessages" ref={log} aria-live="polite">
        <p className="tutorMsg assistant">{copy.tutor.greeting(simulation.title)}</p>
        {messages.map((message, index) => <p key={index} className={`tutorMsg ${message.role}`}>{message.content}</p>)}
        {busy && <p className="tutorMsg assistant tutorThinking">{copy.tutor.thinking}</p>}
        {error && <p role="alert" className="tutorError">{error}</p>}
      </div>
      <form onSubmit={send}>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={2} maxLength={1000}
          placeholder={copy.tutor.placeholder} aria-label={copy.tutor.placeholder}
          onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }}/>
        <button type="submit" className="button primary" disabled={busy || !input.trim()}>{copy.tutor.send}</button>
      </form>
      <p className="tutorNote">{copy.tutor.disclaimer}</p>
    </section>}
  </>;
}
