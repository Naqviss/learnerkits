"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./simulationShare.module.css";

function ShareIcon({ destination }: { destination: string }) {
  const paths: Record<string, string> = {
    WhatsApp: "M12.04 2a9.9 9.9 0 0 0-8.47 15.04L2.2 22l5.1-1.34A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.13 15.06l-.3-.18-3.03.8.81-2.95-.2-.31a8.1 8.1 0 0 1 6.85-12.42Zm-3.7 3.7c-.2 0-.52.08-.78.36-.27.29-1.03 1.01-1.03 2.46s1.06 2.86 1.2 3.06c.15.2 2.08 3.33 5.15 4.53 2.55.99 3.07.79 3.62.74.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.12-.27-.2-.56-.35-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47a9 9 0 0 1-1.65-2.06c-.18-.3-.02-.45.13-.6.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.66-1.6-.91-2.19-.24-.58-.49-.5-.67-.51h-.57Z",
    "Google Classroom": "M3 4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3Zm0 2h18v10H3V6Zm9 1a2.2 2.2 0 1 0 0 4.4A2.2 2.2 0 0 0 12 7Zm-4.5 7.8c0-1.5 2-2.5 4.5-2.5s4.5 1 4.5 2.5h-9ZM4 20h16v1H4z",
    Facebook: "M13.5 22v-9h3l.45-3.5H13.5V7.3c0-1 .28-1.7 1.72-1.7H17V2.46a24 24 0 0 0-2.57-.13c-2.55 0-4.3 1.56-4.3 4.42V9.5H7.25V13h2.88v9h3.37Z",
    X: "M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-7.4L5.6 22H2.5l7.24-8.28L.8 2h6.4l4.42 6.77L18.9 2Zm-1.1 18h1.72L6.2 3.9H4.35L17.8 20Z",
    LinkedIn: "M4.98 3.5A2.48 2.48 0 1 1 5 8.46a2.48 2.48 0 0 1-.02-4.96ZM3 9.75h4V22H3V9.75Zm6.5 0h3.84v1.67h.05a4.2 4.2 0 0 1 3.78-2.08c4.04 0 4.78 2.66 4.78 6.12V22h-4v-5.8c0-1.38-.03-3.16-1.93-3.16-1.93 0-2.23 1.51-2.23 3.06V22H9.5V9.75Z",
    Email: "M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm9 7L3 7v1l9 5 9-5V7l-9 5Z",
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d={paths[destination]}/></svg>;
}

function CopyIcon() {
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/></svg>;
}

export function SimulationShare({ locale, slug, title }: { locale: string; slug: string; title: string }) {
  const [status, setStatus] = useState("");
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 3500);
    return () => window.clearTimeout(timer);
  }, [status]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("embed") === "1") {
      document.documentElement.dataset.simulationEmbed = "true";
    } else {
      delete document.documentElement.dataset.simulationEmbed;
    }
    return () => { delete document.documentElement.dataset.simulationEmbed; };
  }, [locale, slug]);
  const url = `https://www.learnerkits.com/${locale}/simulations/${slug}`;
  const embedUrl = `${url}?embed=1`;
  const embedCode = `<iframe src="${embedUrl}" title="${title.replace(/[&"<>]/g, (char) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" }[char]!))}" width="100%" height="700" loading="lazy" allowfullscreen></iframe>`;
  const encodedUrl = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const options = [
    ["WhatsApp", `https://wa.me/?text=${text}%20${encodedUrl}`],
    ["Google Classroom", `https://classroom.google.com/share?url=${encodedUrl}&title=${text}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`],
    ["X", `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`],
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`],
    ["Email", `mailto:?subject=${text}&body=${encodedUrl}`],
  ];
  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied to clipboard.`);
    } catch {
      setStatus("Could not copy. Select and copy the text below.");
    }
  }
  return <div className={styles.wrapper}
    onPointerEnter={(event) => { if (event.pointerType === "mouse" && details.current) details.current.open = true; }}
    onPointerLeave={(event) => { if (event.pointerType === "mouse" && details.current && !details.current.contains(document.activeElement)) details.current.open = false; }}
    onKeyDown={(event) => { if (event.key === "Escape" && details.current) { details.current.open = false; details.current.querySelector("summary")?.focus(); } }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget) && details.current && !event.currentTarget.matches(":hover")) details.current.open = false; }}
  ><details ref={details} className={styles.share}>
    <summary><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4"/></svg>Share</summary>
    <div className={styles.panel}>
      <strong className={styles.heading}>Share this simulation</strong>
      <p className={styles.description}>Send a link to students or add the simulation to your website.</p>
      <div className={styles.links}>{options.map(([label, href]) => <a key={label} href={href} onClick={() => { if (details.current) details.current.open = false; }} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer"><span className={styles.icon}><ShareIcon destination={label}/></span>{label}</a>)}
        <button type="button" onClick={async () => {
          if (!navigator.share) { await copy(url, "Link"); return; }
          if (details.current) details.current.open = false;
          try { await navigator.share({ title, url }); } catch { /* Share sheet dismissed. */ }
        }}>More options</button>
      </div>
      <div className={styles.copyRow}><label htmlFor="share-url">Simulation link</label><div><input id="share-url" readOnly value={url} onFocus={event => event.currentTarget.select()}/><button type="button" aria-label="Copy simulation link" title="Copy simulation link" onClick={() => copy(url, "Link")}><CopyIcon/></button></div></div>
      <div className={styles.copyRow}><label htmlFor="embed-url">Embed link</label><div><input id="embed-url" readOnly value={embedUrl} onFocus={event => event.currentTarget.select()}/><button type="button" aria-label="Copy embed link" title="Copy embed link" onClick={() => copy(embedUrl, "Embed link")}><CopyIcon/></button></div></div>
      <div className={styles.copyRow}><label htmlFor="embed-code">Embed code</label><div><input id="embed-code" readOnly value={embedCode} onFocus={event => event.currentTarget.select()}/><button type="button" aria-label="Copy embed code" title="Copy embed code" onClick={() => copy(embedCode, "Embed code")}><CopyIcon/></button></div></div>
    </div>
  </details><div className={styles.notification} role="status" aria-live="polite">{status}</div></div>;
}
