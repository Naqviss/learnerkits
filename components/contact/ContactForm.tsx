"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { contactTopics } from "@/lib/contact/config";
import styles from "./contact.module.css";

export function ContactForm({ locale }: { locale: string }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const sending = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    const form = event.currentTarget, data = new FormData(form);
    setState("sending"); setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), topic: data.get("topic"), message: data.get("message"), website: data.get("website"), consent: data.get("consent") === "on", locale }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error(typeof result?.error === "string" ? result.error : "Your message could not be saved. Please try again or email us.");
      form.reset(); setState("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send your message. Please try again or email us.");
      setState("error");
    } finally { sending.current = false; }
  }
  return <form className={styles.form} onSubmit={submit} onChange={() => { if (state === "success") setState("idle"); }} aria-label="Contact LearnerKits" aria-busy={state === "sending"} data-clarity-mask="true">
    <p id="contact-help">All fields are required. A first name or preferred name is enough. If you are under 13, ask a parent, guardian, or teacher to contact us instead.</p>
    <fieldset disabled={state === "sending"} aria-describedby="contact-help">
      <legend className={styles.srOnly}>Your enquiry</legend>
      <div className={styles.row}>
        <label htmlFor="contact-name">Name<input id="contact-name" name="name" autoComplete="given-name" required maxLength={100}/></label>
        <label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      </div>
      <label htmlFor="contact-topic">How can we help?<select id="contact-topic" name="topic" required defaultValue=""><option value="" disabled>Select a topic</option>{contactTopics.map(topic => <option key={topic}>{topic}</option>)}</select></label>
      <label htmlFor="contact-message">Message<textarea id="contact-message" name="message" rows={7} required minLength={20} maxLength={5000} aria-describedby="contact-message-help"/></label>
      <small id="contact-message-help">20–5,000 characters. Include the relevant page link. Do not include passwords, payment details, student records, or sensitive personal information.</small>
      <div className={styles.trap} aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className={styles.consent}><input type="checkbox" name="consent" required/><span>I have read the <Link href={`/${locale}/privacy`}>Privacy Policy</Link> and agree that LearnerKits may store my enquiry and use my email to respond.</span></label>
      <button className="button primary" type="submit">{state === "sending" ? "Sending…" : "Send message"}</button>
    </fieldset>
    <div aria-live="polite" aria-atomic="true">{state === "success" && <p className={styles.success}>Thank you. Your message has been received. If a reply is needed, we will use the email address you provided.</p>}</div>
    {state === "error" && <p className={styles.error} role="alert">{error}</p>}
    <noscript><p>JavaScript is needed to send this form. You can also use the email address below.</p></noscript>
  </form>;
}
